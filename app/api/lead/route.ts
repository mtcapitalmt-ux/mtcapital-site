import { NextResponse } from 'next/server'
import { LeadSchema } from '@/lib/schemas'
import { permitir } from '@/lib/rate-limit'
import { registrarLead } from '@/lib/lead-destinos'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'desconhecido'

  if (!permitir(ip)) {
    return NextResponse.json(
      { erro: 'Muitos envios seguidos. Tente de novo em um minuto.' },
      { status: 429 },
    )
  }

  let bruto: unknown
  try { bruto = await req.json() }
  catch { return NextResponse.json({ erro: 'Envio inválido.' }, { status: 400 }) }

  const analise = LeadSchema.safeParse(bruto)
  if (!analise.success) {
    const campos = analise.error.issues.map((i) => ({
      campo: String(i.path[0] ?? ''),
      mensagem: i.message,
    }))
    return NextResponse.json({ erro: 'Confira os campos.', campos }, { status: 400 })
  }

  // Campo-armadilha preenchido: robô. Responde como sucesso e descarta.
  if (analise.data.armadilha) return NextResponse.json({ ok: true })

  const resultado = await registrarLead(analise.data)

  if (!resultado.ok) {
    console.error('[lead] nenhum destino aceitou:', resultado.erros.join(' | '))
    return NextResponse.json(
      { erro: 'Não conseguimos registrar seu contato agora. Fale com a gente no WhatsApp que enviamos o guia na hora.' },
      { status: 500 },
    )
  }

  if (resultado.erros.length) console.warn('[lead] destino falhou:', resultado.erros.join(' | '))

  return NextResponse.json({ ok: true })
}

import type { Lead } from '@/lib/schemas'

type Resultado = { ok: boolean; destinos: string[]; erros: string[] }

function corpoTexto(lead: Lead, quando: string): string {
  return [
    'Novo pedido do guia pelo site.',
    '',
    `Nome: ${lead.nome}`,
    `Telefone: ${lead.telefone}`,
    lead.email ? `E-mail: ${lead.email}` : 'E-mail: não informado',
    `Origem: ${lead.origem}`,
    `Recebido em: ${quando}`,
  ].join('\n')
}

async function porEmail(lead: Lead, quando: string): Promise<void> {
  const chave = process.env.RESEND_API_KEY
  const destino = process.env.LEAD_EMAIL_DESTINO
  if (!chave || !destino) throw new Error('E-mail não configurado')

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Site MT Capital <site@mtcapital.com.br>',
      to: [destino],
      subject: `Novo lead do guia — ${lead.nome}`,
      text: corpoTexto(lead, quando),
    }),
  })
  if (!r.ok) throw new Error(`Resend respondeu ${r.status}`)
}

async function porWebhook(lead: Lead, quando: string): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL
  if (!url) throw new Error('Webhook não configurado')

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lead, armadilha: undefined, recebidoEm: quando }),
  })
  if (!r.ok) throw new Error(`Webhook respondeu ${r.status}`)
}

export async function registrarLead(lead: Lead): Promise<Resultado> {
  const quando = new Date().toISOString()
  const destinos: string[] = []
  const erros: string[] = []

  const tentativas: [string, Promise<void>][] = []
  if (process.env.LEAD_EMAIL_DESTINO) tentativas.push(['email', porEmail(lead, quando)])
  if (process.env.LEAD_WEBHOOK_URL) tentativas.push(['webhook', porWebhook(lead, quando)])

  for (const [nome, promessa] of tentativas) {
    try { await promessa; destinos.push(nome) }
    catch (e) { erros.push(`${nome}: ${(e as Error).message}`) }
  }

  return { ok: destinos.length > 0, destinos, erros }
}

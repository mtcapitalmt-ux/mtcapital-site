'use client'
// Fonte: referencia/index.html:682-688 (.cap-form, dentro da seção #guia) —
// o texto de apoio da coluna esquerda (eyebrow/título/lede/primeira nota)
// vem de content/textos.ts (guia) e é renderizado por Guia.tsx; este
// componente cobre só os campos do formulário e as duas mensagens que
// dependem deles.
//
// Bug de acessibilidade corrigido na Task 19 do Plano 1: no original os três
// <input> só tinham placeholder, sem nenhum <label> — o texto de exemplo
// some assim que a pessoa começa a digitar, e quem usa leitor de tela nunca
// ficava sabendo o nome do campo. Cada input abaixo tem um <label htmlFor>
// associado ao id correspondente, oculto visualmente com .sr-only
// (styles/base.css) — o placeholder continua visível e a aparência não muda.
//
// Task 2 do Plano 2 (este arquivo): o componente ganha 'use client' porque
// agora tem estado de verdade (envio/sucesso/erro) e um handler de submit —
// a Task 19 deixou isso de propósito para não construir estado que seria
// descartado.
//
// A ordem do envio importa: primeiro o POST para /api/lead (Plano 2, Task 1)
// registra o contato; só depois de um 200 é que o WhatsApp abre.
//
// Achado 6 da revisão final do Plano 2: `window.open` depende de uma
// "interação recente do usuário" para não ser barrado por bloqueador de
// pop-up — e o round-trip do fetch acima (pior em conexão móvel lenta) pode
// estourar essa janela. Sem checar o retorno de `window.open`, a tela diria
// "Abrindo o WhatsApp..." e nada abriria: uma falha silenciosa bem no único
// passo de conversão do site. Por isso capturamos o retorno; se vier nulo
// (pop-up bloqueado), a mensagem de sucesso vira, ela mesma, um link real
// para o mesmo WhatsApp — ver `linkBloqueado` abaixo.
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { linkWhatsApp } from '@/lib/whatsapp'
import s from '@/components/sections/Guia.module.css'

type Estado = 'ocioso' | 'enviando' | 'ok' | 'erro'

function mensagemGuia(nome: string): string {
  return `Olá! Sou ${nome} e acabei de pedir o guia gratuito sobre leilão de imóveis pelo site.`
}

// A resposta de /api/lead é { ok: true } ou { erro: string, campos?: [...] }
// (ver app/api/lead/route.ts) — sem tipo compartilhado entre rota e cliente,
// então o formato é conferido aqui em vez de presumido com `any`.
function extrairErro(json: unknown): string | undefined {
  if (json && typeof json === 'object' && 'erro' in json) {
    const valor = (json as { erro?: unknown }).erro
    if (typeof valor === 'string') return valor
  }
  return undefined
}

export function FormularioGuia() {
  const [estado, setEstado] = useState<Estado>('ocioso')
  const [mensagem, setMensagem] = useState('')
  // Preenchido só quando o POST deu certo mas o `window.open` do WhatsApp
  // voltou nulo/undefined (pop-up bloqueado) — nesse caso a mensagem de
  // sucesso passa a ser renderizada como link clicável para este endereço,
  // em vez de texto solto, para o envio não terminar num beco sem saída.
  const [linkBloqueado, setLinkBloqueado] = useState<string | null>(null)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEstado('enviando')
    setMensagem('Registrando seu contato…')
    setLinkBloqueado(null)

    const form = e.currentTarget
    const dados = Object.fromEntries(new FormData(form))
    const corpo = {
      ...dados,
      consentimento: dados.consentimento === 'on',
      origem: 'guia',
    }

    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      })
      const json: unknown = await r.json().catch(() => null)

      if (!r.ok) {
        setEstado('erro')
        setMensagem(extrairErro(json) ?? 'Não foi possível enviar. Tente de novo.')
        return
      }

      const destino = linkWhatsApp(mensagemGuia(String(dados.nome)))
      const janela = window.open(destino, '_blank', 'noopener,noreferrer')

      setEstado('ok')
      if (janela) {
        setMensagem('Pronto! Abrindo o WhatsApp para enviarmos o guia.')
      } else {
        // Pop-up bloqueado: nada abriu sozinho. `linkBloqueado` faz a
        // mensagem virar um link real para a pessoa completar a ação.
        setMensagem('Pronto! Toque aqui para abrir o WhatsApp e receber o guia.')
        setLinkBloqueado(destino)
      }
    } catch {
      setEstado('erro')
      setMensagem('Falha de conexão. Fale com a gente no WhatsApp que enviamos o guia.')
    }
  }

  return (
    <Reveal>
      <form className={s['cap-form']} onSubmit={enviar}>
        <label htmlFor="nome" className="sr-only">Nome completo</label>
        <input id="nome" name="nome" type="text" placeholder="Nome completo" autoComplete="name" required />

        <label htmlFor="telefone" className="sr-only">Telefone com DDD</label>
        <input id="telefone" name="telefone" type="tel" placeholder="Telefone com DDD" autoComplete="tel" required />

        <label htmlFor="email" className="sr-only">E-mail</label>
        <input id="email" name="email" type="email" placeholder="E-mail" autoComplete="email" />

        {/* Campo-armadilha: ver comentário do topo do arquivo. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
          <label htmlFor="armadilha">Não preencha este campo</label>
          <input id="armadilha" name="armadilha" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <label className={s.consentimento}>
          <input type="checkbox" name="consentimento" required />
          <span>
            Autorizo a MT Capital a usar meu nome, telefone e e-mail para enviar o guia e
            entrar em contato sobre assessoria em leilão. Posso pedir a exclusão quando quiser.
            Veja a <Link href="/privacidade">política de privacidade</Link>.
          </span>
        </label>

        <button type="submit" className="btn" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando…' : 'Quero o guia'}
        </button>

        <p className={s['cap-msg']} aria-live="polite">
          {linkBloqueado ? (
            <a
              href={linkBloqueado}
              target="_blank"
              rel="noopener noreferrer"
              className={s['cap-msg-link']}
            >
              {mensagem}
            </a>
          ) : (
            mensagem
          )}
        </p>

        <p className={s['cap-note']}>
          Ao enviar, registramos seu contato e abrimos o WhatsApp para mandar o PDF. Não mandamos
          mensagem que você não pediu.
        </p>
      </form>
    </Reveal>
  )
}

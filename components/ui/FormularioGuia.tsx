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
// descartado. Três coisas novas:
//
// 1) Um <form> de verdade (referencia/index.html:682-688 não tinha um —
//    era uma <div class="cap-form">). O onSubmit precisa de um elemento
//    <form> para dar preventDefault() e ler FormData; a classe cap-form
//    (flex/gap do layout) migrou do wrapper Reveal para este <form>, e o
//    Reveal passou a envolver só a animação de entrada.
// 2) O campo-armadilha (armadilha): invisível a quem enxerga (fora da tela
//    via position:absolute), presente no DOM para robôs que preenchem tudo.
//    A API (Plano 2, Task 1) descarta silenciosamente qualquer envio com
//    esse campo não vazio, sem devolver 400 — um erro de validação
//    ensinaria ao robô qual campo esvaziar para passar.
// 3) A caixa de consentimento: não pré-marcada, texto nomeando o que é
//    coletado (nome, telefone, e-mail) e para quê (enviar o guia, retomar
//    contato sobre assessoria em leilão) — é a base legal LGPD da coleta,
//    não decoração. `required` faz o navegador barrar o envio sem marcar;
//    a API valida de novo do lado do servidor (LeadSchema, lib/schemas.ts),
//    porque `required` é só client-side.
//
// A ordem do envio importa: primeiro o POST para /api/lead (Plano 2, Task 1)
// registra o contato; só depois de um 200 é que o WhatsApp abre. Assim o
// contato existe mesmo que a pessoa feche a aba sem mandar a mensagem —
// o inverso (abrir o WhatsApp antes) perderia o lead se ela desistir.
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

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEstado('enviando')
    setMensagem('Registrando seu contato…')

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

      setEstado('ok')
      setMensagem('Pronto! Abrindo o WhatsApp para enviarmos o guia.')
      window.open(linkWhatsApp(mensagemGuia(String(dados.nome))), '_blank', 'noopener,noreferrer')
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

        {/* Campo-armadilha: ver nota (2) no comentário do topo do arquivo. */}
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

        <p className={s['cap-msg']} aria-live="polite">{mensagem}</p>

        <p className={s['cap-note']}>
          Ao enviar, registramos seu contato e abrimos o WhatsApp para mandar o PDF. Não mandamos
          mensagem que você não pediu.
        </p>
      </form>
    </Reveal>
  )
}

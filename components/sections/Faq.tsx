// Fonte: referencia/index.html:693-702 (seção #duvidas) e :1082-1130 (dados
// PERGUNTAS, render e handler de clique do acordeão).
//
// Correção deliberada (objetivo desta task): o original media
// `ans.scrollHeight` no momento do clique e aplicava isso como `max-height`
// inline, mais um `setTimeout(setBodyHeight, 520)` para tentar
// re-sincronizar o layout. Essa altura medida fica obsoleta se o viewport
// mudar (ex.: girar o celular) com uma resposta aberta — o texto é cortado ou
// sobra um vão. Aqui a expansão usa `grid-template-rows: 0fr → 1fr` (ver
// Faq.module.css), animado só via CSS, sem nenhuma medida em JS — não há o
// que ficar obsoleto, e nenhum `setTimeout` é necessário.
'use client'

import { useId, useState } from 'react'
import { textos } from '@/content/textos'
import { faq } from '@/content/faq'
import { partesComDestaque } from '@/lib/destaque'
import { Reveal } from '@/components/ui/Reveal'
import s from './Faq.module.css'

export function Faq() {
  const { faqCabecalho: cab } = textos
  const [aberto, setAberto] = useState<number | null>(null)
  const baseId = useId()

  // `destaque` já está contido em `titulo` (ver comentário em
  // content/textos.ts) — dividimos a string pela ocorrência do trecho em vez
  // de concatenar, senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(cab.titulo, cab.destaque)

  return (
    <section className="section" id="duvidas">
      <div className="band">
        <i></i>
      </div>
      <div className="sec-head">
        <div>
          <Reveal className="eyebrow">{cab.eyebrow}</Reveal>
          <Reveal>
            <h2 className="h2">
              {antes}
              <em className="mark">{destaque}</em>
              {depois}
            </h2>
          </Reveal>
        </div>
      </div>

      <div className={s.faq}>
        {faq.map((item, i) => {
          const estaAberto = aberto === i
          const botaoId = `${baseId}-faq-q-${i}`
          const painelId = `${baseId}-faq-a-${i}`

          return (
            <div
              key={item.pergunta}
              className={[s['faq-item'], estaAberto ? s.open : ''].filter(Boolean).join(' ')}
            >
              <button
                type="button"
                id={botaoId}
                className={s['faq-q']}
                aria-expanded={estaAberto}
                aria-controls={painelId}
                onClick={() => setAberto(estaAberto ? null : i)}
              >
                {item.pergunta}
              </button>
              <div
                id={painelId}
                className={s['faq-a']}
                role="region"
                aria-labelledby={botaoId}
              >
                <div>
                  <p>{item.resposta}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

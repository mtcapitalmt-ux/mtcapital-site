// Fonte: referencia/index.html, linhas 414–454 (seção .sec-cream de mitos)
import { textos } from '@/content/textos'
import { mitos } from '@/content/mitos'
import { Reveal } from '@/components/ui/Reveal'
import { partesComDestaque } from '@/lib/destaque'
import s from './Mitos.module.css'

export function Mitos() {
  const { mitosCabecalho: cab } = textos
  const [tituloAntes, tituloDestaque, tituloDepois] = partesComDestaque(cab.titulo, cab.destaque)

  return (
    <section className="section sec-cream">
      <div className="band band-cream"><i></i><i></i></div>
      <div className="sec-head">
        <div>
          <Reveal className="eyebrow">{cab.eyebrow}</Reveal>
          <Reveal>
            <h2 className="h2">
              {tituloAntes}<em className="mark">{tituloDestaque}</em>{tituloDepois}
            </h2>
          </Reveal>
        </div>
        <Reveal className="lede">{cab.lede}</Reveal>
      </div>
      <Reveal stagger className={s.mitos}>
        {mitos.map((m) => {
          // `destaque` já está contido em `resposta` (ver comentário em
          // content/mitos.ts) — dividimos a string pela ocorrência do trecho
          // em vez de concatenar, senão o trecho apareceria duas vezes.
          const [antes, destaque, depois] = partesComDestaque(m.resposta, m.destaque)
          return (
            <div key={m.pergunta} className={s.mito}>
              <h4 className={s['mito-q']}>{m.pergunta}</h4>
              <p className={s['mito-a']}>
                {antes}<strong>{destaque}</strong>{depois}
              </p>
            </div>
          )
        })}
      </Reveal>
    </section>
  )
}

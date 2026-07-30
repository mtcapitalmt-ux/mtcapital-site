// Fonte: referencia/index.html, linhas 398–412 (seção #sobre-leilao)
import { textos } from '@/content/textos'
import { Reveal } from '@/components/ui/Reveal'
import { partesComDestaque } from '@/lib/destaque'
import s from './Esclarecimentos.module.css'

export function Esclarecimentos() {
  const { esclarecimentos: c } = textos

  // `destaque` já está contido em `manifesto` (ver comentário em
  // content/textos.ts) — dividimos a string pela ocorrência do trecho em vez
  // de concatenar os dois, senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(c.manifesto, c.destaque)

  return (
    <section className="section" id="sobre-leilao">
      <div className="band"><i></i></div>
      <div className={s.split}>
        <div>
          <Reveal className="eyebrow">{c.eyebrow}</Reveal>
          <Reveal mask className={s.manifesto}>
            {antes}<em className="mark">{destaque}</em>{depois}
          </Reveal>
        </div>
        <Reveal stagger className={s['split-side']}>
          {c.paragrafos.map((p) => <p key={p}>{p}</p>)}
        </Reveal>
      </div>
    </section>
  )
}

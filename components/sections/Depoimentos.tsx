// Fonte: referencia/index.html:616-641 (seção .sec-cream de depoimentos)
import { textos } from '@/content/textos'
import { depoimentos } from '@/content/depoimentos'
import { partesComDestaque } from '@/lib/destaque'
import { Reveal } from '@/components/ui/Reveal'
import s from './Depoimentos.module.css'

export function Depoimentos() {
  const { depoimentosCabecalho: cab } = textos

  // `destaque` já está contido em `titulo` (ver comentário em content/textos.ts)
  // — dividimos a string pela ocorrência do trecho em vez de concatenar,
  // senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(cab.titulo, cab.destaque)

  return (
    <section className="section sec-cream">
      <div className="band band-cream"><i></i></div>
      <div className="sec-head">
        <div>
          <Reveal className="eyebrow">{cab.eyebrow}</Reveal>
          <Reveal>
            <h2 className="h2">
              {antes}<em className="mark">{destaque}</em>{depois}
            </h2>
          </Reveal>
        </div>
      </div>

      <Reveal stagger className={s.depos}>
        {depoimentos.map((d) => (
          <div key={d.nome + d.qualificacao} className={s.depo}>
            <div className={s.aspas}>&ldquo;</div>
            <blockquote>{d.texto}</blockquote>
            <footer>
              <cite>{d.nome}</cite>
              <small>{d.qualificacao}</small>
            </footer>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

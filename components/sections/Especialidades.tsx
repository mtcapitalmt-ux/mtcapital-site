// Fonte: referencia/index.html, linhas 456–507 (seção .sec-cream #especialidades)
import { textos } from '@/content/textos'
import { especialidades } from '@/content/especialidades'
import { Reveal } from '@/components/ui/Reveal'
import { partesComDestaque } from '@/lib/destaque'
import s from './Especialidades.module.css'

export function Especialidades() {
  const { especialidadesCabecalho: cab } = textos

  // `destaque` já está contido em `titulo` (ver comentário em content/textos.ts)
  // — dividimos a string pela ocorrência do trecho em vez de concatenar,
  // senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(cab.titulo, cab.destaque)

  return (
    <section className="section sec-cream" id="especialidades" style={{ paddingTop: 0 }}>
      <div className="sec-head">
        <div>
          <Reveal className="eyebrow">{cab.eyebrow}</Reveal>
          <Reveal>
            <h2 className="h2">
              {antes}<em className="mark">{destaque}</em>{depois}
            </h2>
          </Reveal>
        </div>
        <Reveal className="lede">{cab.lede}</Reveal>
      </div>
      <Reveal stagger className={s.esp}>
        {especialidades.map((e) => (
          <div key={e.numero} className={s['esp-card']}>
            <span className={s.num}>{e.numero}</span>
            <h3 className="h3">{e.titulo}</h3>
            <p>{e.chamada}</p>
            <ul>
              {e.itens.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

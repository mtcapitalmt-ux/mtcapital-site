// Fonte: referencia/index.html, linhas 559–579 (seção .sec-steel #processo)
import { textos } from '@/content/textos'
import { etapas } from '@/content/etapas'
import { Reveal } from '@/components/ui/Reveal'
import { partesComDestaque } from '@/lib/destaque'
import s from './Processo.module.css'

export function Processo() {
  const { processoCabecalho: cab } = textos

  // `destaque` já está contido em `titulo` (ver comentário em content/textos.ts)
  // — dividimos a string pela ocorrência do trecho em vez de concatenar,
  // senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(cab.titulo, cab.destaque)

  return (
    <section className="section sec-steel" id="processo">
      <div className={`sec-head ${s.head}`}>
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

      <Reveal stagger className={s.etapas}>
        {etapas.map((e) => (
          <div key={e.numero} className={s.etapa}>
            <div className={s['etapa-n']}>{e.numero}</div>
            <h3 className="h3">{e.titulo}</h3>
            <p>{e.texto}</p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

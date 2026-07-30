// Fonte: referencia/index.html:644-671 (seção #equipe)
import { textos } from '@/content/textos'
import { socios } from '@/content/socios'
import { partesComDestaque } from '@/lib/destaque'
import { Reveal } from '@/components/ui/Reveal'
import s from './Equipe.module.css'

export function Equipe() {
  const { equipeCabecalho: cab } = textos

  // `destaque` já está contido em `titulo` (ver comentário em content/textos.ts)
  // — dividimos a string pela ocorrência do trecho em vez de concatenar,
  // senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(cab.titulo, cab.destaque)

  return (
    <section className="section" id="equipe">
      <div className="band"><i></i><i></i></div>
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

      <Reveal stagger className={s.socios}>
        {socios.map((soc) => (
          <div key={soc.nome} className={s.socio}>
            <div className={s['socio-foto']}>
              {soc.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={soc.foto} alt={soc.nome} />
              ) : (
                <span>Foto do sócio</span>
              )}
            </div>
            <div className={s['socio-body']}>
              <p className="label">{soc.papel}</p>
              <h3 className="h3">{soc.nome}</h3>
              <p>{soc.bio}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

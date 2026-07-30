import { pilares } from '@/content/pilares'
import { Reveal } from '@/components/ui/Reveal'
import s from './Pilares.module.css'

export function Pilares() {
  return (
    <section className="section" style={{ paddingBlock: 0 }}>
      <Reveal stagger className={s.pilares}>
        {pilares.map((p) => (
          <div key={p.momento} className={s.pilar}>
            <p className="label">{p.momento}</p>
            <h3 className="h3">{p.titulo}</h3>
            <ul>
              {p.itens.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  )
}

// Fonte: referencia/index.html:674-691 (seção .sec-steel #guia)
//
// Escopo desta tarefa: só interface e acessibilidade do formulário de
// captura. O envio real (abrir o WhatsApp com os dados preenchidos) e o
// consentimento são as Tasks 1 e 2 do Plano 2 — aqui o botão ainda não faz
// nada de verdade (ver comentário em components/ui/FormularioGuia.tsx).
import { textos } from '@/content/textos'
import { partesComDestaque } from '@/lib/destaque'
import { Reveal } from '@/components/ui/Reveal'
import { FormularioGuia } from '@/components/ui/FormularioGuia'
import s from './Guia.module.css'

export function Guia() {
  const { guia } = textos

  // `destaque` já está contido em `titulo` (ver comentário em content/textos.ts)
  // — dividimos a string pela ocorrência do trecho em vez de concatenar,
  // senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(guia.titulo, guia.destaque)

  return (
    <section className="section sec-steel" id="guia">
      <div className={s.captura}>
        <div className={s.texto}>
          <Reveal className="eyebrow">{guia.eyebrow}</Reveal>
          <Reveal>
            <h2 className="h2">
              {antes}<em className="mark">{destaque}</em>{depois}
            </h2>
          </Reveal>
          <Reveal className="lede">{guia.lede}</Reveal>
          <Reveal className={s['cap-note']}>{guia.nota}</Reveal>
        </div>

        <FormularioGuia />
      </div>
    </section>
  )
}

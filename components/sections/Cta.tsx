// Fonte: referencia/index.html:706-712 (seção .cta — sem id, não é destino de
// navegação: não consta no mapa do site nem no Nav).
import { textos } from '@/content/textos'
import { linkWhatsApp } from '@/lib/whatsapp'
import { partesComDestaque } from '@/lib/destaque'
import { Reveal } from '@/components/ui/Reveal'
import s from './Cta.module.css'

export function Cta() {
  const { cta } = textos

  // `destaque` já está contido em `titulo` (ver comentário em content/textos.ts)
  // — dividimos a string pela ocorrência do trecho em vez de concatenar,
  // senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(cta.titulo, cta.destaque)

  // Mesmo padrão de hrefDoCta usado em Hero.tsx: o botão do original tinha
  // href="#" com o destino real montado em runtime pelo script global
  // (data-wa). Aqui o destino de textos.cta.botao é sempre 'whatsapp' com
  // mensagem definida, mas a checagem cobre o tipo CtaTexto por completo.
  const href = cta.botao.destino === 'whatsapp' && cta.botao.mensagem
    ? linkWhatsApp(cta.botao.mensagem)
    : `#${cta.botao.destino}`

  return (
    <section className={s.cta}>
      <div className="band band-steel"><i></i><i></i></div>
      <Reveal className="eyebrow">{cta.eyebrow}</Reveal>
      <Reveal>
        <h2 className="h2">
          {antes}<em className="mark">{destaque}</em>{depois}
        </h2>
      </Reveal>
      <Reveal className="lede">{cta.lede}</Reveal>
      <Reveal>
        <a className="btn" href={href} target="_blank" rel="noopener noreferrer">
          {cta.botao.rotulo}
        </a>
      </Reveal>
    </section>
  )
}

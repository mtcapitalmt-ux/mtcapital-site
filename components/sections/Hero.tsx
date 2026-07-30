import { textos } from '@/content/textos'
import type { CtaTexto } from '@/content/textos'
import { casos } from '@/content/casos'
import { config } from '@/content/config'
import { calcularMetricas } from '@/lib/metricas'
import { brlCompacto } from '@/lib/formato'
import { linkWhatsApp } from '@/lib/whatsapp'
import { Reveal } from '@/components/ui/Reveal'
import { ContadorAnimado } from '@/components/ui/ContadorAnimado'
import s from './Hero.module.css'

type Celula =
  | { valor: number; sufixo?: string; rotulo: string }
  | { texto: string; rotulo: string }

function hrefDoCta(cta: CtaTexto): string {
  return cta.destino === 'whatsapp' && cta.mensagem ? linkWhatsApp(cta.mensagem) : `#${cta.destino}`
}

export function Hero() {
  const { hero } = textos

  // `destaque` reproduz o trecho final de `titulo` (ver comentário em
  // content/textos.ts) — deriva-se a parte estática aqui, em vez de
  // retranscrever "Comprar bem" como um segundo literal desalinhado da fonte.
  const prefixoTitulo = hero.titulo.slice(0, hero.titulo.length - hero.destaque.length).trimEnd()

  // Faixa de números: cálculo ao vivo a partir de content/casos.ts.
  // Com os dois casos de exemplo ainda como publicado:false, as quatro
  // células abaixo mostram zero — correto e pretendido, não um bug.
  const m = calcularMetricas(casos, config.anosAtuacao)

  const celulas: Celula[] = [
    { valor: m.anosAtuacao, sufixo: ' anos', rotulo: 'De atuação em leilões' },
    { valor: m.operacoes, rotulo: 'Operações concluídas' },
    { texto: brlCompacto(m.volumeAvaliado), rotulo: 'Em negócios acompanhados' },
    { valor: m.maiorDesconto, sufixo: '%', rotulo: 'Maior desconto já entregue' },
  ]

  return (
    <section className={s.hero} id="top">
      <div className="band"><i></i><i></i></div>
      <div className={s['hero-inner']}>
        <Reveal className="eyebrow">{hero.eyebrow}</Reveal>
        {/* O <h1> é o único título de nível 1 da página — ao contrário do
            eyebrow/lede logo abaixo, ele não vira <div> só para carregar a
            classe de revelação: o Reveal envolve a tag real, e a opacidade/
            transform do wrapper já esconde e revela o filho normalmente. */}
        <Reveal>
          <h1 className="h1">
            {prefixoTitulo}<br />
            <em className="mark">{hero.destaque}</em>
          </h1>
        </Reveal>
        <div className={s['hero-sub']}>
          <Reveal className="lede">{hero.lede}</Reveal>
          <Reveal className={s['hero-cta']}>
            <a className="btn" href={hrefDoCta(hero.ctaPrimario)} target="_blank" rel="noopener noreferrer">
              {hero.ctaPrimario.rotulo}
            </a>
            <a className="btn btn-ghost" href={hrefDoCta(hero.ctaSecundario)}>
              {hero.ctaSecundario.rotulo}
            </a>
          </Reveal>
        </div>
      </div>

      <Reveal stagger className={s.bignum}>
        {celulas.map((c) => (
          <div key={c.rotulo}>
            <div className={`${s.k} tab`}>
              {'valor' in c ? <ContadorAnimado valor={c.valor} sufixo={c.sufixo} /> : c.texto}
            </div>
            <div className={s.v}>{c.rotulo}</div>
          </div>
        ))}
      </Reveal>

      <div className={s['scroll-cue']}>Role<i></i></div>
    </section>
  )
}

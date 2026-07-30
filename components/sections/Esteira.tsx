// Fonte: referencia/index.html, linhas 509–557 (seção .section #como-contratar)
import { textos } from '@/content/textos'
import { esteira } from '@/content/esteira'
import type { EsteiraCta } from '@/content/esteira'
import { linkWhatsApp } from '@/lib/whatsapp'
import { Reveal } from '@/components/ui/Reveal'
import { partesComDestaque } from '@/lib/destaque'
import s from './Esteira.module.css'

// Mesmo padrão de Hero.tsx (hrefDoCta): resolve o href a partir do destino —
// 'guia' vira âncora da seção de guia, 'whatsapp' vira link wa.me.
function hrefDoCta(cta: EsteiraCta): string {
  return cta.destino === 'whatsapp' && cta.mensagem ? linkWhatsApp(cta.mensagem) : `#${cta.destino}`
}

export function Esteira() {
  const { esteiraCabecalho: cab, esteiraNota: nota } = textos

  // `destaque` já está contido em `titulo` (ver comentário em content/textos.ts)
  // — dividimos a string pela ocorrência do trecho em vez de concatenar,
  // senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(cab.titulo, cab.destaque)

  return (
    <section className="section" id="como-contratar">
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

      <Reveal stagger className={s.esteira}>
        {esteira.map((passo) => (
          <div key={passo.numero} className={passo.destaque ? `${s.passo} ${s.dest}` : s.passo}>
            <span className={s['passo-n']}>{passo.numero}</span>
            <p className="label">{passo.etiqueta}</p>
            <h3 className="h3">{passo.titulo}</h3>
            <p>{passo.texto}</p>
            {passo.cta && (
              passo.cta.destino === 'whatsapp' ? (
                <a className="btn btn-ghost" href={hrefDoCta(passo.cta)} target="_blank" rel="noopener noreferrer">
                  {passo.cta.rotulo}
                </a>
              ) : (
                <a className="btn btn-ghost" href={hrefDoCta(passo.cta)}>
                  {passo.cta.rotulo}
                </a>
              )
            )}
          </div>
        ))}
      </Reveal>

      <Reveal className={s['esteira-nota']}>
        <h4 className="h4">{nota.titulo}</h4>
        <p>{nota.texto}</p>
        {/* Contraste baixo herdado do original (auditoria de acessibilidade
            já sinalizou este trecho) — mantido verbatim de propósito; a
            correção é escopo de uma tarefa futura, não desta. */}
        <p className="sim-note" style={{ color: 'rgba(245,241,234,.42)', marginTop: '16px' }}>
          {nota.notaValores}
        </p>
      </Reveal>
    </section>
  )
}

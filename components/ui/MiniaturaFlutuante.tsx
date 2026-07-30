'use client'
import { useEffect, useRef, useState } from 'react'
import type { Imovel } from '@/lib/schemas'
import { linkWhatsApp, mensagemImovel } from '@/lib/whatsapp'
import { brl, dataBR } from '@/lib/formato'
import { Reveal } from '@/components/ui/Reveal'
import s from '@/components/sections/Oportunidades.module.css'

function metaDoImovel(im: Imovel): string[] {
  return [
    im.tipo,
    [im.bairro, im.cidade, im.uf].filter(Boolean).join(' · '),
    im.area ? `${im.area.toLocaleString('pt-BR')} m²` : null,
    im.quartos ? `${im.quartos} quartos` : null,
    im.vagas ? `${im.vagas} vagas` : null,
    im.lance2?.data ? `2ª praça ${dataBR(im.lance2.data)}` : null,
  ].filter((m): m is string => m !== null)
}

type Props = {
  imoveis: Imovel[]
}

// Lista com linha hover-reveal (barra dourada) + miniatura flutuante que segue
// o cursor — porta referencia/index.html:922-961 (função renderOps, ramo com
// lista) e :957 (o listener de mousemove).
//
// No original, `document.addEventListener('mousemove', ...)` era registrado
// dentro de renderOps, ou seja, a cada nova renderização da lista — sem nunca
// ser removido. Cada atualização acumulava mais um listener idêntico, ativo
// para sempre. Aqui o listener é registrado uma única vez, no mount (efeito
// com array de dependências vazio), e o cleanup do useEffect o remove: é
// exatamente esse vazamento que esta reescrita existe para corrigir.
export function MiniaturaFlutuante({ imoveis }: Props) {
  const floatRef = useRef<HTMLDivElement>(null)
  const [imagemAtiva, setImagemAtiva] = useState<string | null>(null)

  useEffect(() => {
    const mover = (e: MouseEvent) => {
      if (!floatRef.current) return
      floatRef.current.style.top = `${e.clientY}px`
      floatRef.current.style.left = `${e.clientX}px`
    }
    document.addEventListener('mousemove', mover)
    return () => document.removeEventListener('mousemove', mover)
  }, [])

  return (
    <>
      <Reveal stagger className={s['ops-list']}>
        {imoveis.map((im) => {
          const valor = im.lance2?.valor ?? im.lance1?.valor ?? 0
          const off = im.valorAvaliacao ? Math.round((1 - valor / im.valorAvaliacao) * 100) : 0
          return (
            <a
              key={im.id}
              className={s.op}
              href={linkWhatsApp(mensagemImovel(im))}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => { if (im.imagem) setImagemAtiva(im.imagem) }}
              onMouseLeave={() => setImagemAtiva(null)}
            >
              <div className={s['op-main']}>
                <span className={s['op-title']}>{im.titulo}</span>
                <div className={s['op-meta']}>
                  {metaDoImovel(im).map((m, i) => <span key={i}>{m}</span>)}
                </div>
              </div>
              <div className={s['op-right']}>
                <span className={s['op-price']}>{brl(valor)}</span>
                {off > 0 && <span className={s['op-off']}>{off}% abaixo da avaliação</span>}
              </div>
            </a>
          )
        })}
      </Reveal>
      <div
        ref={floatRef}
        className={imagemAtiva ? `${s['op-float']} ${s.on}` : s['op-float']}
      >
        {imagemAtiva && (
          // Imagem vem de uma URL externa arbitrária por imóvel (ver
          // ImovelSchema.imagem em lib/schemas.ts); sem um domínio fixo para
          // configurar em next.config.ts, next/image não se aplica aqui.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagemAtiva} alt="" />
        )}
      </div>
    </>
  )
}

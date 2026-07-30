'use client'
import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  mask?: boolean
  stagger?: boolean
  as?: 'div' | 'section'
}

export function Reveal({ children, className, mask, stagger, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // matchMedia não existe no SSR; só pode ser lido no cliente após o mount.
    // Um initializer preguiçoso no useState quebraria no servidor ou causaria
    // mismatch de hidratação, então o padrão effect+setState aqui é o tradeoff
    // correto (um render extra inofensivo, apenas para quem prefere menos movimento).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setVisivel(true); return }

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue
          if (stagger) {
            Array.from(el.children).forEach((c, i) => {
              ;(c as HTMLElement).style.transitionDelay = `${i * 90}ms`
            })
          }
          setVisivel(true)
          io.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [stagger])

  const base = mask ? 'rv-mask' : 'rv'
  return (
    <Tag
      ref={ref}
      className={[base, visivel ? 'in' : '', className].filter(Boolean).join(' ')}
      {...(stagger ? { 'data-stagger': '' } : {})}
    >
      {children}
    </Tag>
  )
}

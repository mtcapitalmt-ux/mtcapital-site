'use client'
import { useEffect, useRef, useState } from 'react'

export function ContadorAnimado({ valor, prefixo = '', sufixo = '' }: { valor: number; prefixo?: string; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [atual, setAtual] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setAtual(valor); return }

    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return
      io.unobserve(el)
      const t0 = performance.now()
      const passo = (t: number) => {
        const p = Math.min((t - t0) / 1500, 1)
        setAtual(Math.round(valor * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(passo)
      }
      requestAnimationFrame(passo)
    }, { threshold: 0.15 })

    io.observe(el)
    return () => io.disconnect()
  }, [valor])

  return <span ref={ref}>{prefixo}{atual.toLocaleString('pt-BR')}{sufixo}</span>
}

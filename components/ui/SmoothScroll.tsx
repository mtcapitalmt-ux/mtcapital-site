'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScroll() {
  useEffect(() => {
    const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches
    const toque = matchMedia('(hover: none)').matches
    if (reduzido || toque || window.innerWidth <= 900) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let id = requestAnimationFrame(function raf(t: number) {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    })
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  return null
}

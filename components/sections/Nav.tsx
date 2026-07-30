'use client'
import { useEffect, useState } from 'react'
import { Monograma } from '@/components/brand/Monograma'
import { config } from '@/content/config'
import { linkWhatsApp } from '@/lib/whatsapp'

const LINKS: { href: string; rotulo: string }[] = [
  { href: '#especialidades', rotulo: 'Especialidades' },
  { href: '#processo', rotulo: 'Como funciona' },
  { href: '#casos', rotulo: 'Casos reais' },
  { href: '#guia', rotulo: 'Guia gratuito' },
  { href: '#equipe', rotulo: 'Quem somos' },
  { href: '#duvidas', rotulo: 'Dúvidas' },
]

const MENSAGEM_CTA =
  'Olá! Vim pelo site da MT Capital e gostaria de falar com um especialista em leilão de imóveis.'

export function Nav() {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const aoRolar = () => setStuck(window.scrollY > 60)
    window.addEventListener('scroll', aoRolar)
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <header className={`nav${stuck ? ' stuck' : ''}`} id="nav">
      <a href="#top" className="brand">
        <span className="brand-row">
          <Monograma className="brand-mark" />
          <b>{config.marca.toUpperCase()}</b>
        </span>
        <small>{config.assinatura}</small>
      </a>
      <nav className="nav-links">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>{link.rotulo}</a>
        ))}
      </nav>
      <a className="btn" href={linkWhatsApp(MENSAGEM_CTA)} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l1 2.3c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.2-.3.4-.1.7.2.3.8 1.4 1.8 2.3 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.7-.1l1-1.2c.2-.2.4-.2.6-.1l2.2 1c.3.2.5.2.5.4.1.1.1.6-.1 1.2z"/></svg>
        Fale conosco
      </a>
    </header>
  )
}

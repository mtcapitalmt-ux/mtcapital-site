// Fonte: referencia/index.html:754-756 (.wa-float — botão flutuante, fixo na
// tela, fora dos wrappers de scroll suave: por isso mora em app/layout.tsx,
// ao lado do <Nav />, e não em app/page.tsx — ver comentário lá).
import { linkWhatsApp } from '@/lib/whatsapp'
import s from './WhatsAppFlutuante.module.css'

const MENSAGEM = 'Olá! Vim pelo site da MT Capital e gostaria de falar com um especialista.'

export function WhatsAppFlutuante() {
  return (
    <a
      className={s['wa-float']}
      href={linkWhatsApp(MENSAGEM)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l1 2.3c.1.2.1.4 0 .6l-.4.6-.3.3c-.1.2-.3.4-.1.7.2.3.8 1.4 1.8 2.3 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.7-.1l1-1.2c.2-.2.4-.2.6-.1l2.2 1c.3.2.5.2.5.4.1.1.1.6-.1 1.2z" />
      </svg>
    </a>
  )
}

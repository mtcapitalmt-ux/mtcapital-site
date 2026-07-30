import { describe, it, expect, vi } from 'vitest'

vi.mock('@/content/config', () => ({ config: { whatsapp: '5511987654321' } }))

const { linkWhatsApp } = await import('@/lib/whatsapp')

describe('linkWhatsApp', () => {
  it('monta o endereço com a mensagem codificada', () => {
    expect(linkWhatsApp('Olá! Tudo bem?'))
      .toBe('https://wa.me/5511987654321?text=Ol%C3%A1!%20Tudo%20bem%3F')
  })
  it('codifica quebra de linha', () => {
    expect(linkWhatsApp('a\nb')).toContain('%0A')
  })
})

import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Faq } from '@/components/sections/Faq'
import { faq } from '@/content/faq'

describe('seção de FAQ (acordeão)', () => {
  it('renderiza as 11 perguntas, todas fechadas (aria-expanded="false")', () => {
    const { getAllByRole } = render(<Faq />)
    const botoes = getAllByRole('button')
    expect(botoes).toHaveLength(faq.length)
    for (const botao of botoes) {
      expect(botao.getAttribute('aria-expanded')).toBe('false')
    }
  })

  it('cada botão aponta (aria-controls) para o id do próprio painel, e o painel aponta de volta (aria-labelledby + role="region")', () => {
    const { getAllByRole } = render(<Faq />)
    const botoes = getAllByRole('button')
    const paineis = getAllByRole('region', { hidden: true })
    expect(paineis).toHaveLength(faq.length)

    botoes.forEach((botao, i) => {
      const painelId = botao.getAttribute('aria-controls')
      expect(painelId).toBeTruthy()
      expect(paineis[i].getAttribute('id')).toBe(painelId)
      expect(paineis[i].getAttribute('aria-labelledby')).toBe(botao.id)
    })
  })

  it('abre um item ao clicar e fecha qualquer outro que estivesse aberto (um por vez, como no original)', () => {
    const { getAllByRole } = render(<Faq />)
    const botoes = getAllByRole('button')

    fireEvent.click(botoes[0])
    expect(botoes[0].getAttribute('aria-expanded')).toBe('true')
    expect(botoes[1].getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(botoes[2])
    expect(botoes[0].getAttribute('aria-expanded')).toBe('false')
    expect(botoes[2].getAttribute('aria-expanded')).toBe('true')
  })

  it('clicar num item já aberto o fecha (toggle)', () => {
    const { getAllByRole } = render(<Faq />)
    const botoes = getAllByRole('button')

    fireEvent.click(botoes[3])
    expect(botoes[3].getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(botoes[3])
    expect(botoes[3].getAttribute('aria-expanded')).toBe('false')
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Casos } from '@/components/sections/Casos'
import { linhasDoCaso } from '@/components/ui/FiltrosCasos'
import type { Caso } from '@/lib/schemas'

const caso = (over: Partial<Caso>): Caso =>
  ({
    id: 'x', tipo: 'Casa', titulo: 't', local: 'l', resumo: 'r',
    avaliacao: 0, arremate: 0, custos: 0,
    venda: null, parcelas: null, prazoMeses: null, imagem: null,
    publicado: false, ...over,
  }) as Caso

describe('seção de casos', () => {
  it('nunca imprime o placeholder de dinheiro nem "R$ 0", com os casos de exemplo (publicado: false)', () => {
    const { container } = render(<Casos />)
    expect(container.textContent).not.toContain('000.000')
    expect(container.textContent).not.toContain('R$ 0')
  })

  it('com os dois casos de exemplo ainda não publicados, a faixa de resumo mostra "—" nas quatro células, nunca um número inventado', () => {
    const { container } = render(<Casos />)
    const travessoes = container.textContent?.match(/—/g) ?? []
    expect(travessoes).toHaveLength(4)
  })

  it('mostra o estado vazio quando não há caso publicado nessa categoria', () => {
    const { container, getByText } = render(<Casos />)
    expect(container.textContent).toContain('Nenhum caso publicado nessa categoria ainda.')
    expect(getByText(/Nenhum caso publicado/)).toBeTruthy()
  })

  it('inclui o aviso legal verbatim (referencia/index.html:612)', () => {
    const { container } = render(<Casos />)
    expect(container.textContent).toContain(
      'Resultados obtidos em operações já concluídas, com autorização dos respectivos clientes. Desempenho passado não representa garantia de resultado futuro. Cada operação possui condições, prazos e riscos próprios, apurados individualmente na análise prévia.',
    )
  })
})

describe('linhasDoCaso — regra "campo sem valor não é renderizado"', () => {
  it('não gera nenhuma linha quando avaliação e arremate são zero', () => {
    expect(linhasDoCaso(caso({}))).toHaveLength(0)
  })

  it('reproduz a forma exata do caso "ilha" de content/casos.ts (avaliação zerada, arremate real) sem nunca imprimir o placeholder', () => {
    const ilha = caso({ avaliacao: 0, arremate: 500000, parcelas: 18 })
    const linhas = linhasDoCaso(ilha)
    const rotulos = linhas.map((l) => l.rotulo)

    // Avaliação é zero: não entra — nunca "R$ 000.000" no lugar dela.
    expect(rotulos).not.toContain('Avaliação')
    expect(rotulos).toEqual(['Arrematação', 'Investimento real', 'Parcelamento'])
    expect(linhas.every((l) => !l.valor.includes('000.000'))).toBe(true)
    expect(linhas.every((l) => !l.valor.includes('R$ 0'))).toBe(true)
  })

  it('caso totalmente preenchido mostra todos os campos com valores reais, nunca um placeholder', () => {
    const completo = caso({
      avaliacao: 900000, arremate: 600000, custos: 45000,
      venda: 850000, parcelas: 12, prazoMeses: 8, publicado: true,
    })
    const linhas = linhasDoCaso(completo)

    expect(linhas.map((l) => l.rotulo)).toEqual([
      'Avaliação', 'Arrematação', 'Investimento real', 'Parcelamento', 'Até a posse',
    ])
    for (const linha of linhas) {
      expect(linha.valor).not.toContain('000.000')
    }
    expect(linhas.find((l) => l.rotulo === 'Investimento real')?.valor).toBe('R$ 645.000')
    expect(linhas.find((l) => l.rotulo === 'Parcelamento')?.valor).toBe('12×')
    expect(linhas.find((l) => l.rotulo === 'Até a posse')?.valor).toBe('8 meses')
  })
})

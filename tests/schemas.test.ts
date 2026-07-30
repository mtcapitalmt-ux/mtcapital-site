import { describe, it, expect } from 'vitest'
import { CasoSchema } from '@/lib/schemas'
import { ehPlaceholder } from '@/lib/config-guard'

const base = {
  id: 'ribeira', tipo: 'Casa' as const, titulo: 'Casa na Ribeira',
  local: 'Ribeira · RJ', resumo: 'Resumo do caso.',
  avaliacao: 400000, arremate: 250000, custos: 30000,
  venda: null, parcelas: null, prazoMeses: 8, imagem: null,
  publicado: true,
}

describe('CasoSchema', () => {
  it('aceita um caso com a conta completa', () => {
    expect(CasoSchema.parse(base)).toMatchObject({ id: 'ribeira' })
  })
  it('recusa caso publicado sem avaliação', () => {
    expect(() => CasoSchema.parse({ ...base, avaliacao: 0 })).toThrow()
  })
  it('recusa caso publicado sem arremate', () => {
    expect(() => CasoSchema.parse({ ...base, arremate: 0 })).toThrow()
  })
  it('aceita caso incompleto desde que não publicado', () => {
    expect(() => CasoSchema.parse({ ...base, avaliacao: 0, publicado: false })).not.toThrow()
  })
})

describe('ehPlaceholder', () => {
  it('reconhece os placeholders atuais do site', () => {
    expect(ehPlaceholder('5511000000000')).toBe(true)
    expect(ehPlaceholder('(11) 0000-0000')).toBe(true)
    expect(ehPlaceholder('')).toBe(true)
  })
  it('aceita dados reais', () => {
    expect(ehPlaceholder('5511987654321')).toBe(false)
    expect(ehPlaceholder('(11) 3456-7890')).toBe(false)
  })
})

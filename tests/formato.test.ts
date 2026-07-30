import { describe, it, expect } from 'vitest'
import { brl, brlCompacto, dataBR, digitos } from '@/lib/formato'

describe('brl', () => {
  it('formata em reais sem centavos', () => {
    expect(brl(1234567)).toBe('R$ 1.234.567')
    expect(brl(500000)).toBe('R$ 500.000')
  })
  it('nunca produz o placeholder R$ 000.000', () => {
    expect(brl(0)).toBe('R$ 0')
    expect(brl(0)).not.toContain('000.000')
  })
})

describe('brlCompacto', () => {
  it('não arredonda meio milhão para um milhão', () => {
    expect(brlCompacto(500000)).toBe('R$ 500 mil')
  })
  it('usa uma casa decimal com vírgula acima de um milhão', () => {
    expect(brlCompacto(1000000)).toBe('R$ 1 mi')
    expect(brlCompacto(1200000)).toBe('R$ 1,2 mi')
    expect(brlCompacto(12500000)).toBe('R$ 12,5 mi')
  })
  it('mostra o valor cheio abaixo de mil', () => {
    expect(brlCompacto(0)).toBe('R$ 0')
    expect(brlCompacto(850)).toBe('R$ 850')
  })
})

describe('dataBR', () => {
  it('converte AAAA-MM-DD para DD/MM/AAAA', () => {
    expect(dataBR('2026-08-14')).toBe('14/08/2026')
  })
  it('devolve travessão quando não há data', () => {
    expect(dataBR(null)).toBe('—')
  })
})

describe('digitos', () => {
  it('remove tudo que não é dígito', () => {
    expect(digitos('(11) 98765-4321')).toBe('11987654321')
  })
})

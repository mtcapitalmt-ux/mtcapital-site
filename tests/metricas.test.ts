import { describe, it, expect } from 'vitest'
import { calcularMetricas, descontoDe, lucroDe, investimentoReal } from '@/lib/metricas'
import type { Caso } from '@/lib/schemas'

const caso = (over: Partial<Caso>): Caso => ({
  id: 'x', tipo: 'Casa', titulo: 't', local: 'l', resumo: 'r',
  avaliacao: 0, arremate: 0, custos: 0,
  venda: null, parcelas: null, prazoMeses: null, imagem: null,
  publicado: true, ...over,
} as Caso)

describe('calcularMetricas', () => {
  it('ignora casos não publicados', () => {
    const m = calcularMetricas([
      caso({ id: 'a', avaliacao: 400000, arremate: 250000, publicado: true }),
      caso({ id: 'b', avaliacao: 900000, arremate: 500000, publicado: false }),
    ], 10)
    expect(m.operacoes).toBe(1)
    expect(m.volumeAvaliado).toBe(400000)
  })

  it('devolve zero em tudo quando não há caso publicado', () => {
    const m = calcularMetricas([caso({ publicado: false })], 10)
    expect(m).toMatchObject({
      operacoes: 0, volumeAvaliado: 0, maiorDesconto: 0,
      descontoMedio: 0, resultadoRevendas: 0, anosAtuacao: 10,
    })
  })

  it('preserva o valor exato do volume, sem arredondar para milhão', () => {
    const m = calcularMetricas([caso({ avaliacao: 500000, arremate: 300000 })], 10)
    expect(m.volumeAvaliado).toBe(500000)
  })

  it('calcula maior desconto e desconto médio', () => {
    const m = calcularMetricas([
      caso({ id: 'a', avaliacao: 1000000, arremate: 600000 }),
      caso({ id: 'b', avaliacao: 1000000, arremate: 800000 }),
    ], 10)
    expect(m.maiorDesconto).toBe(40)
    expect(m.descontoMedio).toBe(30)
  })

  it('só soma resultado de revenda concluída', () => {
    const m = calcularMetricas([
      caso({ id: 'a', avaliacao: 500000, arremate: 300000, custos: 50000, venda: 480000 }),
      caso({ id: 'b', avaliacao: 500000, arremate: 300000, custos: 50000, venda: null }),
    ], 10)
    expect(m.resultadoRevendas).toBe(130000)
  })
})

describe('auxiliares', () => {
  it('desconto é nulo sem avaliação', () => {
    expect(descontoDe(caso({ avaliacao: 0, arremate: 100 }))).toBeNull()
  })
  it('lucro é nulo sem revenda', () => {
    expect(lucroDe(caso({ arremate: 100, venda: null }))).toBeNull()
  })
  it('investimento real soma custos ao arremate', () => {
    expect(investimentoReal(caso({ arremate: 300000, custos: 45000 }))).toBe(345000)
  })
})

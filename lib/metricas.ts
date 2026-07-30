import type { Caso } from '@/lib/schemas'

export type Metricas = {
  anosAtuacao: number
  operacoes: number
  volumeAvaliado: number
  maiorDesconto: number
  descontoMedio: number
  resultadoRevendas: number
}

export function descontoDe(c: Caso): number | null {
  if (c.avaliacao <= 0 || c.arremate <= 0) return null
  return Math.round((1 - c.arremate / c.avaliacao) * 100)
}

export function investimentoReal(c: Caso): number {
  return c.arremate + c.custos
}

export function lucroDe(c: Caso): number | null {
  if (c.venda === null) return null
  return c.venda - investimentoReal(c)
}

export function calcularMetricas(casos: Caso[], anosAtuacao: number): Metricas {
  const publicados = casos.filter((c) => c.publicado)
  const volumeAvaliado = publicados.reduce((s, c) => s + c.avaliacao, 0)

  const descontos = publicados
    .map(descontoDe)
    .filter((d): d is number => d !== null && d > 0)

  const lucros = publicados
    .map(lucroDe)
    .filter((v): v is number => v !== null)

  return {
    anosAtuacao,
    operacoes: publicados.length,
    volumeAvaliado,
    maiorDesconto: descontos.length ? Math.max(...descontos) : 0,
    descontoMedio: descontos.length
      ? Math.round(descontos.reduce((s, d) => s + d, 0) / descontos.length)
      : 0,
    resultadoRevendas: lucros.reduce((s, v) => s + v, 0),
  }
}

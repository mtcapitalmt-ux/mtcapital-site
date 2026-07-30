export function brl(valor: number): string {
  return 'R$ ' + Math.round(valor).toLocaleString('pt-BR')
}

export function brlCompacto(valor: number): string {
  const v = Math.round(valor)
  if (v < 1_000) return `R$ ${v.toLocaleString('pt-BR')}`
  if (v < 1_000_000) return `R$ ${Math.round(v / 1_000).toLocaleString('pt-BR')} mil`
  const mi = v / 1_000_000
  const texto = mi.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
  return `R$ ${texto} mi`
}

export function dataBR(iso: string | null): string {
  if (!iso) return '—'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

export function digitos(s: string): string {
  return s.replace(/\D/g, '')
}

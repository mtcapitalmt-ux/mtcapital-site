export type ConfigSite = { whatsapp: string; telefone: string }

const PLACEHOLDERS: RegExp[] = [
  /^55\d{2}0{7,}$/,           // 5511000000000
  /\(\d{2}\)\s*0{4}-?0{4}/,   // (11) 0000-0000
  /^$/,
]

export function ehPlaceholder(valor: string): boolean {
  return PLACEHOLDERS.some((r) => r.test(valor))
}

export function validarConfig(cfg: ConfigSite): void {
  const pendentes = (['whatsapp', 'telefone'] as const).filter((k) => ehPlaceholder(cfg[k]))
  if (pendentes.length === 0) return

  const aviso =
    `Dados de contato ainda em placeholder: ${pendentes.join(', ')}. ` +
    `Preencha em content/config.ts antes de publicar.`

  if (process.env.NODE_ENV === 'production') throw new Error(`[MT Capital] ${aviso}`)
  console.warn(`[MT Capital] ${aviso}`)
}

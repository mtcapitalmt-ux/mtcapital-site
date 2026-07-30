// Utilitário compartilhado por seções cujo conteúdo (ver content/textos.ts e
// content/mitos.ts) guarda `destaque` como um trecho JÁ CONTIDO no texto
// completo (resposta/manifesto/título) — não um complemento a concatenar.
// Dividir pela ocorrência evita duplicar o trecho em destaque na tela.

export function partesComDestaque(texto: string, destaque: string): [string, string, string] {
  const i = texto.indexOf(destaque)
  if (i === -1) return [texto, '', '']
  return [texto.slice(0, i), destaque, texto.slice(i + destaque.length)]
}

type Registro = { contagem: number; expiraEm: number }

const memoria = new Map<string, Registro>()

export function permitir(chave: string, limite = 5, janelaMs = 60_000): boolean {
  const agora = Date.now()
  const atual = memoria.get(chave)

  if (!atual || agora > atual.expiraEm) {
    memoria.set(chave, { contagem: 1, expiraEm: agora + janelaMs })
    return true
  }
  if (atual.contagem >= limite) return false

  atual.contagem += 1
  return true
}

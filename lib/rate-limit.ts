// Limitador de taxa em memória, por processo — NÃO é uma proteção contra
// abuso distribuído. O contador vive só no processo Node em execução: cada
// instância serverless conta separadamente (duas instâncias atendendo o
// mesmo IP em paralelo permitem o dobro do limite configurado) e ele zera a
// cada novo deploy ou cold start (a instância simplesmente esquece contagens
// antigas). Isto é suficiente como freio a envios repetidos casuais e bots
// simples, não como garantia contra um ataque distribuído de verdade — isso
// exigiria um armazenamento compartilhado (ex.: Redis) fora do processo.

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

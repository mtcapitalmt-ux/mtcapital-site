import { ImovelSchema, type Imovel } from '@/lib/schemas'
import { imoveisBrutos } from '@/content/imoveis'

/**
 * Ponto único de leitura de imóveis.
 *
 * Hoje: lê a lista versionada em content/imoveis.ts.
 * Quando o painel administrativo existir: trocar o corpo desta função pela
 * consulta ao banco. A validação com ImovelSchema permanece — é ela que
 * garante que nada malformado chegue à página. Cada registro é validado
 * individualmente (em vez de validar o array inteiro de uma vez) para que
 * um único registro malformado não derrube os demais, que continuam válidos.
 */
export async function listarImoveis(): Promise<Imovel[]> {
  const imoveis: Imovel[] = []

  for (const bruto of imoveisBrutos) {
    const analise = ImovelSchema.safeParse(bruto)
    if (analise.success) {
      imoveis.push(analise.data)
      continue
    }
    const campos = analise.error.issues.map((i) => i.path.join('.')).join(', ')
    console.error('[imoveis] registro inválido descartado. Campos:', campos)
  }

  return imoveis
}

export async function listarImoveisAbertos(): Promise<Imovel[]> {
  const todos = await listarImoveis()
  return todos.filter((i) => i.status !== 'encerrado')
}

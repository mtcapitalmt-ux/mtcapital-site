import { describe, it, expect, vi } from 'vitest'

vi.mock('@/content/imoveis', () => ({
  imoveisBrutos: [
    {
      id: 'lote-001', tipo: 'Terreno', titulo: 'Terreno 1.240 m² — Praia Grande',
      cidade: 'Angra dos Reis', uf: 'RJ', bairro: 'Praia Grande',
      area: 1240, quartos: null, vagas: null,
      valorAvaliacao: 1000000,
      lance1: { valor: 1000000, data: '2026-08-14' },
      lance2: { valor: 250000, data: '2026-08-21' },
      imagem: null, status: 'aberto',
    },
    {
      id: 'lote-002', tipo: 'Casa', titulo: 'Casa encerrada',
      cidade: 'Niterói', uf: 'RJ', bairro: null,
      area: null, quartos: 3, vagas: 1,
      valorAvaliacao: 800000, lance1: null, lance2: null,
      imagem: null, status: 'encerrado',
    },
    // Registro deliberadamente malformado: tipo fora do enum e sem os campos
    // obrigatórios (cidade, uf, valorAvaliacao, status). Deve ser descartado
    // sem derrubar os demais registros válidos.
    {
      id: 'lote-003', tipo: 'Fazenda', titulo: 'Registro malformado',
    },
  ],
}))

const { listarImoveis, listarImoveisAbertos } = await import('@/lib/imoveis')

describe('listarImoveis', () => {
  it('devolve os imóveis válidos e descarta o malformado sem quebrar', async () => {
    const todos = await listarImoveis()
    expect(todos).toHaveLength(2)
    expect(todos.map((i) => i.id)).toEqual(['lote-001', 'lote-002'])
  })

  it('esconde os encerrados na lista pública, mas mantém em listarImoveis', async () => {
    const todos = await listarImoveis()
    expect(todos.some((i) => i.status === 'encerrado')).toBe(true)

    const abertos = await listarImoveisAbertos()
    expect(abertos).toHaveLength(1)
    expect(abertos[0].id).toBe('lote-001')
    expect(abertos.some((i) => i.status === 'encerrado')).toBe(false)
  })

  it('registra o descarte sem expor dados do registro (só os campos)', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    await listarImoveis()
    expect(spy).toHaveBeenCalledWith(
      '[imoveis] registro inválido descartado. Campos:',
      expect.any(String),
    )
    const mensagem = spy.mock.calls[0]?.[1] as string
    expect(mensagem).not.toContain('Fazenda')
    expect(mensagem).not.toContain('Registro malformado')
    spy.mockRestore()
  })
})

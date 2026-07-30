import { describe, it, expect } from 'vitest'
import { casos } from '@/content/casos'
import { faq } from '@/content/faq'
import { etapas } from '@/content/etapas'
import { mitos } from '@/content/mitos'
import { especialidades } from '@/content/especialidades'
import { esteira } from '@/content/esteira'
import { pilares } from '@/content/pilares'
import { textos } from '@/content/textos'

describe('conteúdo', () => {
  it('mantém a contagem aprovada de cada bloco', () => {
    expect(pilares).toHaveLength(3)
    expect(mitos).toHaveLength(7)
    expect(especialidades).toHaveLength(3)
    expect(esteira).toHaveLength(4)
    expect(etapas).toHaveLength(9)
    expect(faq).toHaveLength(11)
  })

  it('todo caso passa pelo contrato', () => {
    expect(casos.length).toBeGreaterThan(0)
  })

  it('nenhum caso de exemplo está publicado', () => {
    const exemplos = casos.filter((c) => c.resumo.includes('PENDENTE'))
    expect(exemplos.every((c) => !c.publicado)).toBe(true)
  })

  it('destaque de cada mito é um trecho genuíno de resposta (não texto adicional)', () => {
    for (const m of mitos) {
      expect(m.resposta.includes(m.destaque)).toBe(true)
    }
  })

  it('destaque do manifesto de esclarecimentos é um trecho genuíno do texto completo', () => {
    const { esclarecimentos, mitosCabecalho } = textos
    expect(esclarecimentos.manifesto.includes(esclarecimentos.destaque)).toBe(true)
    expect(mitosCabecalho.titulo.includes(mitosCabecalho.destaque)).toBe(true)
  })
})

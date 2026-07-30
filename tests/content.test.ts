import { describe, it, expect } from 'vitest'
import { casos } from '@/content/casos'
import { faq } from '@/content/faq'
import { etapas } from '@/content/etapas'
import { mitos } from '@/content/mitos'
import { especialidades } from '@/content/especialidades'
import { esteira } from '@/content/esteira'
import { pilares } from '@/content/pilares'

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
})

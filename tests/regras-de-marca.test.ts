// As três regras de marca (Plano 2, Task 8) — verificação automática, para
// que nenhuma delas dependa de alguém lembrar de checar manualmente.
//
// Regra 1 varre content/, components/ e app/ — não só content/. As duas
// únicas frases legítimas que usam "garantia"/"rentabilidade" no código hoje
// são negações escritas como JSX literal dentro de componentes
// (components/sections/Casos.tsx e components/sections/Rodape.tsx), seguindo
// o mesmo padrão do Plano 1 de manter aviso legal como literal inline em vez
// de rotear por content/. Um teste que só varresse content/ passaria hoje,
// mas não pegaria uma promessa proibida inserida depois direto num .tsx —
// que é exatamente onde prosa real já mora em dois lugares deste repositório.
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join, extname } from 'node:path'
import { casos } from '@/content/casos'
import { calcularMetricas } from '@/lib/metricas'
import { CasoSchema } from '@/lib/schemas'

const RAIZ = process.cwd()
const PASTAS_COM_PROSA = ['content', 'components', 'app']
const EXTENSOES = ['.ts', '.tsx']

function arquivosRecursivos(pasta: string): string[] {
  const resultado: string[] = []
  for (const entrada of readdirSync(pasta, { withFileTypes: true })) {
    const caminho = join(pasta, entrada.name)
    if (entrada.isDirectory()) {
      resultado.push(...arquivosRecursivos(caminho))
    } else if (EXTENSOES.includes(extname(entrada.name))) {
      resultado.push(caminho)
    }
  }
  return resultado
}

function todosOsArquivosVarridos(): string[] {
  return PASTAS_COM_PROSA.flatMap((pasta) => arquivosRecursivos(join(RAIZ, pasta)))
}

const PROIBIDAS = [
  /sem\s+riscos?\b/i,
  /\bgarantid[oa]s?\b/i,
  /garantia\s+de\s+(retorno|rentabilidade|lucro)/i,
  /\brentabilidade\b/i,
  /lucro\s+cert[oa]/i,
  /retorno\s+cert[oa]/i,
]

// Trechos onde a palavra aparece dentro de uma NEGAÇÃO — o oposto de uma
// promessa. Cada exceção é uma string exata (não regex) e justificada.
// Nunca afrouxar a regra em si — só remover o trecho literal antes de testar.
const EXCECOES = [
  // components/sections/Casos.tsx:77 — aviso legal do card de casos: nega
  // que desempenho passado garanta resultado futuro.
  'não representa garantia de resultado futuro',
  // components/sections/Rodape.tsx:92 — aviso legal do rodapé: nega que os
  // valores apresentados constituam garantia de rentabilidade.
  'não constituem garantia de rentabilidade',
]

function semExcecoes(texto: string): string {
  return EXCECOES.reduce((t, e) => t.split(e).join(''), texto)
}

describe('Regra 1 — nunca prometer resultado', () => {
  it('nenhum texto de content/, components/ ou app/ contém promessa proibida', () => {
    const achados: string[] = []

    for (const arquivo of todosOsArquivosVarridos()) {
      const texto = semExcecoes(readFileSync(arquivo, 'utf8'))
      for (const regra of PROIBIDAS) {
        const m = texto.match(regra)
        if (m) achados.push(`${arquivo}: "${m[0]}"`)
      }
    }

    expect(achados, `Promessa proibida encontrada:\n${achados.join('\n')}`).toEqual([])
  })

  it('cada exceção é uma string exata que de fato existe no código varrido (não é regra frouxa)', () => {
    // Prova de que EXCECOES não é uma muleta morta: se uma frase não
    // aparecer literalmente em nenhum arquivo, ela não protege nada e
    // deveria ser removida da lista.
    const todoTexto = todosOsArquivosVarridos()
      .map((arquivo) => readFileSync(arquivo, 'utf8'))
      .join('\n')

    for (const excecao of EXCECOES) {
      expect(todoTexto.includes(excecao), `exceção não encontrada em nenhum arquivo: "${excecao}"`).toBe(true)
    }
  })

  it('a lista PROIBIDAS de fato reconhece frases-armadilha (a malha funciona, não é regex morta)', () => {
    const exemplosDeArmadilha = [
      'invista sem risco algum',
      'lucro garantido todo mês',
      'garantia de rentabilidade de 20% ao mês',
      'acompanhe a rentabilidade deste ativo',
      'lucro certo em 90 dias',
      'retorno certo desde o primeiro mês',
    ]
    for (const regra of PROIBIDAS) {
      const pegouAlguma = exemplosDeArmadilha.some((frase) => regra.test(frase))
      expect(pegouAlguma, `a regra ${regra} não capturou nenhuma frase de exemplo`).toBe(true)
    }
  })
})

describe('Regra 2 — sempre a conta completa nos casos', () => {
  it('todo caso publicado em content/casos.ts tem avaliação, arremate e custos definidos', () => {
    const publicados = casos.filter((c) => c.publicado)
    // Hoje os dois casos de content/casos.ts estão com publicado:false (ver
    // comentário no topo daquele arquivo), então este laço roda zero vezes —
    // esse é o estado correto (nenhum dado fictício exposto). Como isso por
    // si só não prova que a regra pegaria uma violação real, o teste
    // seguinte cobre a mesma regra com dado fabricado.
    for (const c of publicados) {
      expect(c.avaliacao, `caso ${c.id}`).toBeGreaterThan(0)
      expect(c.arremate, `caso ${c.id}`).toBeGreaterThan(0)
      expect(typeof c.custos, `caso ${c.id}`).toBe('number')
    }
  })

  it('o schema recusa um caso publicado com avaliação ou arremate ausentes (prova com dado fabricado, não com sorte dos dados atuais)', () => {
    const base = {
      id: 'fixture-regra-2', tipo: 'Casa' as const, titulo: 't', local: 'l', resumo: 'r',
      avaliacao: 500000, arremate: 300000, custos: 20000,
      venda: null, parcelas: null, prazoMeses: null, imagem: null,
      publicado: true,
    }
    expect(() => CasoSchema.parse(base)).not.toThrow()
    expect(() => CasoSchema.parse({ ...base, avaliacao: 0 })).toThrow()
    expect(() => CasoSchema.parse({ ...base, arremate: 0 })).toThrow()
  })
})

describe('Regra 3 — nenhum número inventado', () => {
  it('a faixa do topo deriva dos casos, não de literal no componente', () => {
    const fonte = readFileSync(join(RAIZ, 'components/sections/Hero.tsx'), 'utf8')
    expect(fonte).toContain('calcularMetricas')
    expect(fonte).not.toMatch(/\b\d{3,}\b/)
  })

  it('sem caso publicado, todo agregado é zero', () => {
    const m = calcularMetricas([], 10)
    expect(m.operacoes).toBe(0)
    expect(m.volumeAvaliado).toBe(0)
    expect(m.maiorDesconto).toBe(0)
    expect(m.descontoMedio).toBe(0)
    expect(m.resultadoRevendas).toBe(0)
  })
})

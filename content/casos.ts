// Os dois casos abaixo são exemplos, não operações reais.
// Com publicado:false, a faixa do topo mostra zero — que é a verdade,
// e é o comportamento pretendido pela regra "nenhum número inventado".

import { CasoSchema, type Caso } from '@/lib/schemas'

const brutos = [
  {
    id: 'ribeira', tipo: 'Casa', titulo: 'Casa arrematada na Ribeira',
    local: 'Ribeira · RJ',
    resumo: 'PENDENTE — situação do imóvel, o entrave identificado no processo e como a equipe resolveu.',
    avaliacao: 0, arremate: 0, custos: 0,
    venda: null, parcelas: null, prazoMeses: null, imagem: null,
    publicado: false,
  },
  {
    id: 'ilha', tipo: 'Terreno', titulo: 'Terreno adquirido após leilão deserto',
    local: 'Ilha · RJ',
    resumo: 'O bem não recebeu lances em nenhuma das praças. A equipe negociou diretamente com o credor e fechou a aquisição parcelada, sem disputa de pregão.',
    avaliacao: 0, arremate: 500000, custos: 0,
    venda: null, parcelas: 18, prazoMeses: null, imagem: null,
    publicado: false,
  },
]

export const casos: Caso[] = brutos.map((c) => CasoSchema.parse(c))

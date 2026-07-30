// Fonte: referencia/index.html, linhas 625–639 (bloco .depos)
// PENDENTE: substituir por conteúdo real com autorização por escrito

export interface Depoimento {
  texto: string
  nome: string
  qualificacao: string
}

export const depoimentos: Depoimento[] = [
  {
    texto:
      'Substituir pelo depoimento real do cliente. O ideal é um texto de quatro a seis linhas contando qual era o receio inicial, como foi o acompanhamento e qual foi o resultado da operação.',
    nome: 'Nome do cliente',
    qualificacao: 'Investidor',
  },
  {
    texto:
      'Substituir pelo depoimento real do cliente. Depoimentos que mencionam prazos cumpridos, clareza na comunicação e ausência de surpresas costumam converter melhor neste segmento.',
    nome: 'Nome do cliente',
    qualificacao: 'Compradora — moradia própria',
  },
  {
    texto:
      'Substituir pelo depoimento real do cliente. Havendo depoimento em vídeo, este bloco pode ser convertido em player, mantendo o nome e a qualificação abaixo.',
    nome: 'Nome do cliente',
    qualificacao: 'Empresário',
  },
]

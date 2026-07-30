// Fonte: referencia/index.html, linhas 368–394 (bloco .pilares)

export interface Pilar {
  rotulo: string
  titulo: string
  itens: string[]
}

export const pilares: Pilar[] = [
  {
    rotulo: 'Antes',
    titulo: 'Lemos o processo inteiro',
    itens: [
      'Descobrimos por que o imóvel foi parar em leilão',
      'Vemos quem mais tem direito sobre ele',
      'Conferimos o que o edital obriga você a pagar',
    ],
  },
  {
    rotulo: 'Durante',
    titulo: 'Damos o lance com teto definido',
    itens: [
      'Cuidamos do cadastro e da documentação',
      'Acompanhamos o pregão na primeira e na segunda praça',
      'Não passamos do valor que a conta permite',
    ],
  },
  {
    rotulo: 'Depois',
    titulo: 'Entregamos a matrícula no seu nome',
    itens: [
      'Tiramos a carta de arrematação e pagamos o ITBI',
      'Entramos com a imissão na posse quando precisa',
      'Registramos o título no cartório',
    ],
  },
]

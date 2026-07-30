// Fonte: referencia/index.html, linhas 467–505 (bloco .esp)

export interface Especialidade {
  numero: string
  titulo: string
  chamada: string
  itens: string[]
}

export const especialidades: Especialidade[] = [
  {
    numero: '01',
    titulo: 'Leilão de imóveis e terrenos',
    chamada:
      'Você escolhe o imóvel, ou a gente traz. Dali em diante o trabalho é nosso, até a chave na sua mão.',
    itens: [
      'Procuramos imóveis que servem para o seu objetivo',
      'Lemos o processo que levou o bem a leilão',
      'Levantamos débitos, penhoras e restrições na matrícula',
      'Cuidamos da habilitação e damos o lance',
      'Tiramos o ocupante quando é preciso',
      'Registramos a matrícula no seu nome',
    ],
  },
  {
    numero: '02',
    titulo: 'Negociação com credores',
    chamada:
      'Quando ninguém dá lance, o imóvel volta para o credor. É aí que costuma aparecer a melhor negociação — e quase ninguém tenta.',
    itens: [
      'Mapeamos os imóveis que ninguém arrematou',
      'Procuramos o banco ou o credor direto',
      'Montamos a proposta com parcelamento',
      'Negociamos desconto sobre o saldo devedor',
      'Fechamos a compra e registramos',
    ],
  },
  {
    numero: '03',
    titulo: 'Consultoria para investidores',
    chamada:
      'Para quem compra com frequência, a gente acompanha a carteira inteira em vez de um imóvel por vez.',
    itens: [
      'Definimos o critério de compra junto com você',
      'Calculamos o custo total e o retorno de cada operação',
      'Monitoramos os editais das praças que te interessam',
      'Planejamos a saída: revenda, aluguel ou permuta',
    ],
  },
]

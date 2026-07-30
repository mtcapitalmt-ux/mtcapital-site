// Fonte: referencia/index.html, linhas 1083–1106 (array PERGUNTAS)

export interface FaqItem {
  pergunta: string
  resposta: string
}

export const faq: FaqItem[] = [
  {
    pergunta: 'Qual a diferença entre leilão judicial e extrajudicial?',
    resposta:
      'O judicial nasce de um processo em andamento e segue o rito dos artigos 879 a 903 do Código de Processo Civil, com edital nos autos e leiloeiro nomeado pelo juiz. O extrajudicial nasce quando o banco consolida a propriedade de um imóvel financiado, e segue a Lei 9.514/97. Os dois exigem análise antes do lance, mas o que vem depois da arrematação é bem diferente em cada um.',
  },
  {
    pergunta: 'Eu herdo as dívidas do imóvel?',
    resposta:
      'As tributárias, não. O STJ firmou no Tema 1.134 que a arrematação é aquisição originária para fins tributários — o passivo antigo de IPTU não acompanha o arrematante. Dívida de condomínio é outra natureza e costuma seguir o imóvel. Na análise a gente levanta tudo e mostra o que fica com você antes de qualquer lance.',
  },
  {
    pergunta: 'Além do lance, o que mais eu pago?',
    resposta:
      'A comissão do leiloeiro, que costuma ser 5% sobre o valor da arrematação. Depois o ITBI e o cartório. Conforme o caso, ainda entram dívida de condomínio, o custo de desocupar e a reforma. Somamos tudo isso ao lance e chamamos de investimento real. É esse número que a gente coloca na sua frente, não o do edital.',
  },
  {
    pergunta: 'Preciso ter o valor todo à vista?',
    resposta:
      'Menos do que a maioria imagina. Em leilão judicial dá para entrar com 25% e parcelar o restante em até 30 vezes sem juros. No extrajudicial, alguns casos aceitam financiamento longo. Cada edital tem sua regra, e conferir isso é uma das primeiras coisas que fazemos.',
  },
  {
    pergunta: 'Em quanto tempo eu recebo as chaves?',
    resposta:
      'Depende de o imóvel estar vazio ou ocupado. Estando vazio, o caminho é a carta de arrematação, o ITBI e o registro. Estando ocupado, entra a desocupação: um acordo amigável costuma resolver em 30 a 60 dias, e a via judicial leva de 3 a 12 meses. São faixas de mercado, não promessa — na análise a gente estima o prazo daquele caso específico.',
  },
  {
    pergunta: 'A arrematação pode ser anulada?',
    resposta:
      'Pode, nas hipóteses que a lei prevê, e nesse caso o valor pago é devolvido. Ler o processo inteiro antes serve exatamente para achar esses sinais e recomendar que você fique fora quando o risco não compensa.',
  },
  {
    pergunta: 'Vi um imóvel com desconto enorme. Vale a pena?',
    resposta:
      'Desconto muito acima da média costuma ser a precificação de um risco que estão te transferindo: ocupante difícil, vício no processo, dívida grande, imóvel em estado ruim. Sempre tem uma razão, e ela normalmente está escrita no edital. Desconto grande não é oportunidade nem armadilha por si só — é um sinal de que alguém precisa ler o processo com atenção.',
  },
  {
    pergunta: 'Como funciona a cobrança de vocês?',
    resposta:
      'São dois momentos. Primeiro uma taxa de assessoria, cobrada na contratação, que dá início ao trabalho técnico. Se a arrematação sair conosco, essa taxa é descontada do valor final. Depois, um percentual sobre a diferença entre o valor de avaliação e o que você pagou de fato. Sem arremate, não há percentual. Os valores são definidos em contrato depois da reunião de diagnóstico.',
  },
  {
    pergunta: 'Por que existe uma taxa antes do resultado?',
    resposta:
      'Porque orientar alguém direito consome muitas horas de trabalho técnico e nem toda conversa vira negócio. A taxa funciona como filtro: separa quem está pesquisando de quem está decidido. Quem paga recebe tempo de gente experiente em vez de atendimento de esteira — e, fechando o negócio, ela volta descontada.',
  },
  {
    pergunta: 'Vocês trabalham em quais lugares?',
    resposta:
      'Em leilões de todo o Brasil. Leilão eletrônico dá para acompanhar de qualquer lugar; os presenciais a gente avalia caso a caso.',
  },
  {
    pergunta: 'Dá para comprar em leilão para morar?',
    resposta:
      'Dá, e não é só investidor grande que compra: tem fundo imobiliário, tem família atrás da casa própria e tem investidor iniciante bem assessorado. Quem vai morar costuma alcançar um bairro que não caberia num financiamento tradicional. Nesse caso a gente procura imóvel vazio, com matrícula limpa e prazo previsível.',
  },
]

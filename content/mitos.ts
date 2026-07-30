// Fonte: referencia/index.html, linhas 425–453 (bloco .mitos)
// `destaque` é o trecho hoje em <b> dentro de cada resposta.

export interface Mito {
  pergunta: string
  resposta: string
  destaque: string
}

export const mitos: Mito[] = [
  {
    pergunta: 'Leilão de imóveis é seguro?',
    resposta:
      'O Brasil teve cerca de 300 mil leilões em 2025, boa parte de imóveis retomados por bancos. Golpe não movimenta esse volume. O judicial corre dentro de um processo, pelo rito dos artigos 879 a 903 do CPC. O extrajudicial segue a Lei 9.514/97. O risco não está na modalidade. Está em dar lance sem ler o processo.',
    destaque: 'O risco não está na modalidade. Está em dar lance sem ler o processo.',
  },
  {
    pergunta: 'O arrematante assume as dívidas do imóvel?',
    resposta:
      'Dívida de imposto, não. O STJ decidiu no Tema 1.134 que a arrematação é aquisição originária para fins tributários: o passivo antigo não vai junto. Condomínio é outra história e costuma acompanhar o imóvel. Levantamos tudo antes e somamos ao custo da operação, então você vê o total antes de decidir.',
    destaque: 'Levantamos tudo antes e somamos ao custo da operação',
  },
  {
    pergunta: 'Preciso de muito dinheiro à vista?',
    resposta:
      'Menos do que você imagina. No leilão judicial dá para entrar com 25% e parcelar o restante em até 30 vezes sem juros. No extrajudicial, alguns casos aceitam financiamento longo. O edital diz o que é possível em cada caso — e essa é uma das primeiras coisas que a gente confere.',
    destaque: 'O edital diz o que é possível em cada caso',
  },
  {
    pergunta: 'E se o imóvel estiver ocupado?',
    resposta:
      'Tem caminho previsto em lei. Acordo amigável costuma resolver em 30 a 60 dias. Pela via judicial, a imissão na posse leva de 3 a 12 meses. São faixas do mercado, não promessa. Conferimos a ocupação antes do lance e colocamos esse custo e esse tempo na conta. Se o desconto não paga a espera, a gente recomenda passar.',
    destaque: 'Conferimos a ocupação antes do lance',
  },
  {
    pergunta: 'A arrematação pode ser anulada?',
    resposta:
      'Pode, nas hipóteses que a lei prevê, e nesse caso o valor pago é devolvido. Ler o processo inteiro serve para isso: achar o problema antes do lance, não depois.',
    destaque: 'Ler o processo inteiro serve para isso:',
  },
  {
    pergunta: 'Achei um imóvel com 80% de desconto. É uma boa?',
    resposta:
      'Desconfie. Desconto muito acima da média quase sempre é a precificação de um risco que estão te transferindo — ocupante difícil, processo com vício, dívida grande. Sempre tem uma razão, e ela está no edital. Desconto grande sem explicação é o sinal mais claro de que ninguém leu o processo.',
    destaque: 'Sempre tem uma razão, e ela está no edital.',
  },
  {
    pergunta: 'Leilão serve para quem quer morar no imóvel?',
    resposta:
      'Serve, e não é só investidor grande que compra. Tem fundo imobiliário, tem família atrás da casa própria e tem investidor iniciante bem assessorado. O que muda é o critério: quem vai morar procura imóvel vazio e prazo curto, e costuma chegar em bairro que não caberia no financiamento. Quem investe olha margem e liquidez.',
    destaque: 'O que muda é o critério:',
  },
]

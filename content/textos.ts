// Fonte: referencia/index.html, trechos indicados em comentário em cada chave.
// `destaque` reproduz o trecho hoje marcado com <em class="mark"> dentro do título/manifesto,
// já incluído no texto completo de `titulo`/`manifesto` — não é conteúdo adicional.

export interface CtaTexto {
  rotulo: string
  destino: 'guia' | 'whatsapp'
  mensagem?: string
}

export interface Cabecalho {
  eyebrow: string
  titulo: string
  destaque: string
  lede?: string
}

export const textos = {
  // linhas 344–351 (.hero)
  hero: {
    eyebrow: 'Assessoria em leilão de imóveis e terrenos',
    titulo: 'Comprar bem começa antes do lance.',
    destaque: 'começa antes do lance.',
    lede: 'A MT Capital analisa o processo, calcula o custo real da operação e diz até quanto vale a pena pagar. Depois conduz tudo, do pregão ao registro.',
    ctaPrimario: {
      rotulo: 'Agendar reunião gratuita',
      destino: 'whatsapp',
      mensagem: 'Olá! Gostaria de agendar a reunião gratuita de diagnóstico.',
    } as CtaTexto,
    ctaSecundario: {
      rotulo: 'Baixar o guia',
      destino: 'guia',
    } as CtaTexto,
  },

  // linhas 403–409 (.split, seção #sobre-leilao)
  esclarecimentos: {
    eyebrow: 'Entenda o mercado',
    manifesto: 'O leilão popularizou. E foi aí que ficou perigoso.',
    destaque: 'E foi aí que ficou perigoso.',
    paragrafos: [
      'Hoje qualquer pessoa entra num leilão pelo celular. O resultado é que milhares de iniciantes disputam os mesmos imóveis fáceis, sobem o lance na emoção e pagam caro por um desconto que já evaporou.',
      'O retorno de verdade ficou onde exige análise técnica: processo complicado, imóvel ocupado, matrícula com pendência. É lá que o amador não vai — e é lá que a gente trabalha.',
      'No fim da análise você recebe um documento com os riscos listados um a um, o custo real da operação somado e um número: até quanto vale a pena pagar por aquele imóvel.',
    ],
  },

  // linhas 417–422 (.sec-head da seção de mitos)
  mitosCabecalho: {
    eyebrow: 'Esclarecimentos',
    titulo: 'O que se diz sobre leilão, e o que a prática mostra.',
    destaque: 'e o que a prática mostra.',
    lede: 'As dúvidas que mais afastam gente boa desse mercado.',
  } as Cabecalho,

  // linhas 458–463 (.sec-head da seção #especialidades)
  especialidadesCabecalho: {
    eyebrow: 'Especialidades',
    titulo: 'O que a gente faz por você.',
    destaque: 'faz por você.',
    lede: 'Escopo e prazo de cada frente ficam definidos em contrato.',
  } as Cabecalho,

  // linhas 512–517 (.sec-head da seção #como-contratar)
  esteiraCabecalho: {
    eyebrow: 'Como contratar',
    titulo: 'Quatro passos, e o primeiro é de graça.',
    destaque: 'e o primeiro é de graça.',
    lede: 'Você não precisa decidir nada hoje. Começa lendo, depois conversa, e só contrata quando fizer sentido.',
  } as Cabecalho,

  // linhas 561–566 (.sec-head da seção #processo)
  processoCabecalho: {
    eyebrow: 'Como funciona',
    titulo: 'Da busca à chave na mão.',
    destaque: 'à chave na mão.',
    lede: 'Nove etapas. A segunda é a que separa o bom negócio do prejuízo — e é onde a maioria pula.',
  } as Cabecalho,

  // linhas 583–588 (.sec-head da seção #oportunidades)
  oportunidadesCabecalho: {
    eyebrow: 'Oportunidades',
    titulo: 'Imóveis e terrenos em praça aberta.',
    destaque: 'em praça aberta.',
    lede: 'Imóveis que já passaram pela nossa análise. O percentual toma como base o valor de avaliação do processo.',
  } as Cabecalho,

  // linhas 596–601 (.sec-head da seção #casos)
  casosCabecalho: {
    eyebrow: 'Casos reais',
    titulo: 'O que já fizemos e quanto rendeu.',
    destaque: 'e quanto rendeu.',
    lede: 'Números que os clientes praticaram de verdade. Onde a revenda já aconteceu, o resultado está aí também.',
  } as Cabecalho,

  // linhas 619–622 (.sec-head da seção de depoimentos — sem lede)
  depoimentosCabecalho: {
    eyebrow: 'Depoimentos',
    titulo: 'Quem já passou por isso com a gente.',
    destaque: 'por isso com a gente.',
  } as Cabecalho,

  // linhas 646–651 (.sec-head da seção #equipe)
  equipeCabecalho: {
    eyebrow: 'Quem somos',
    titulo: 'Quem lê o processo e quem te atende.',
    destaque: 'e quem te atende.',
    lede: 'Além de assessorar, a gente compra, reforma e revende com o próprio dinheiro. O risco que a gente calcula pra você é o mesmo que a gente corre.',
  } as Cabecalho,

  // linhas 677–680 (seção #guia — texto de apoio, sem os campos do formulário)
  guia: {
    eyebrow: 'Material gratuito',
    titulo: 'Tudo sobre leilão de imóvel — inclusive os riscos.',
    destaque: 'inclusive os riscos.',
    lede: 'Fizemos o guia que a gente gostaria de ter tido no começo. O que é cada tipo de leilão, o que entra na conta além do lance, o que fazer com imóvel ocupado e os erros que mais custam dinheiro.',
    nota: 'Sem custo. Sem compromisso.',
  },

  // linhas 697–700 (.sec-head da seção #duvidas — sem lede)
  faqCabecalho: {
    eyebrow: 'Perguntas frequentes',
    titulo: 'O que todo mundo pergunta.',
    destaque: 'todo mundo pergunta.',
  } as Cabecalho,

  // linhas 708–711 (seção .cta)
  cta: {
    eyebrow: 'Fale com a gente',
    titulo: 'Converse antes de dar qualquer lance.',
    destaque: 'de dar qualquer lance.',
    lede: 'Reunião gratuita de diagnóstico: você traz seu objetivo, a gente diz com honestidade se faz sentido. Se já tiver um imóvel em vista, manda o link do edital junto.',
    botao: {
      rotulo: 'Agendar reunião gratuita',
      destino: 'whatsapp',
      mensagem: 'Olá! Gostaria de agendar a reunião gratuita de diagnóstico.',
    } as CtaTexto,
  },

  // linha 719 (texto de apoio abaixo da marca, no rodapé)
  rodape: 'Assessoria em arrematação de imóveis e terrenos em leilão judicial e extrajudicial.',
} as const

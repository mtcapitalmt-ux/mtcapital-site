// Fonte: referencia/index.html, linhas 521–549 (bloco .esteira)

export interface EsteiraCta {
  rotulo: string
  destino: 'guia' | 'whatsapp'
  mensagem?: string
}

export interface EsteiraPasso {
  numero: string
  etiqueta: string
  titulo: string
  texto: string
  cta?: EsteiraCta
  destaque?: boolean
}

export const esteira: EsteiraPasso[] = [
  {
    numero: '01',
    etiqueta: 'Gratuito',
    titulo: 'Baixe o guia',
    texto:
      'Tudo o que você precisa saber sobre leilão de imóvel — incluindo os riscos que ninguém conta. É o material que a gente gostaria de ter tido no começo.',
    cta: { rotulo: 'Baixar o guia', destino: 'guia' },
  },
  {
    numero: '02',
    etiqueta: 'Gratuito',
    titulo: 'Reunião de diagnóstico',
    texto:
      'Você traz seu objetivo e seu capital. A gente diz com honestidade se leilão faz sentido pra você — inclusive quando a resposta é não.',
    cta: {
      rotulo: 'Agendar reunião',
      destino: 'whatsapp',
      mensagem: 'Olá! Gostaria de agendar a reunião gratuita de diagnóstico.',
    },
  },
  {
    numero: '03',
    etiqueta: 'Taxa de assessoria',
    titulo: 'Contratação',
    texto:
      'A partir daqui o trabalho técnico começa: leitura de processo, matrícula, certidões, cálculo do investimento real. Se a arrematação sair conosco, essa taxa é descontada do valor final.',
  },
  {
    numero: '04',
    etiqueta: 'Só se der certo',
    titulo: 'Percentual sobre o desconto',
    texto:
      'Nosso ganho principal vem da diferença entre o valor de avaliação e o que você pagou de fato. Quanto melhor for o seu negócio, melhor é o nosso. Sem arremate, não há percentual.',
    destaque: true,
  },
]

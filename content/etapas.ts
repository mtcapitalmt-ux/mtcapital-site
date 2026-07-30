// Fonte: referencia/index.html, linhas 569–577 (bloco .etapas)

export interface Etapa {
  numero: string
  titulo: string
  texto: string
}

export const etapas: Etapa[] = [
  {
    numero: '01',
    titulo: 'Busca e seleção',
    texto:
      'Acompanhamos os editais de leilão judicial, extrajudicial, de bancos e da Caixa. Filtramos o que serve para o seu objetivo, sua região e o capital que você tem.',
  },
  {
    numero: '02',
    titulo: 'Due diligence',
    texto:
      'Lemos o processo e o edital do começo ao fim. Tiramos matrícula atualizada e certidões. Conferimos penhoras, IPTU, condomínio e se tem alguém morando. É aqui que o negócio se define.',
  },
  {
    numero: '03',
    titulo: 'Cálculo do investimento real',
    texto:
      'Somamos ao lance a comissão do leiloeiro, o ITBI, o cartório, os débitos que ficam, o custo de desocupação e a reforma. O número que importa é esse, não o do edital.',
  },
  {
    numero: '04',
    titulo: 'Teto de lance',
    texto:
      'Definimos com você o valor máximo que faz sentido pagar por aquele imóvel. A partir daí ele vira regra: não se ultrapassa na emoção do pregão.',
  },
  {
    numero: '05',
    titulo: 'Habilitação',
    texto:
      'Fazemos o cadastro na plataforma do leiloeiro, organizamos os documentos e depositamos a caução quando é exigida.',
  },
  {
    numero: '06',
    titulo: 'O pregão',
    texto:
      'Acompanhamos o leilão ao vivo, na primeira e na segunda praça, e damos o lance dentro do teto combinado.',
  },
  {
    numero: '07',
    titulo: 'Arrematação e pagamento',
    texto:
      'Assinamos o auto de arrematação e cuidamos do pagamento do lance e da comissão do leiloeiro, dentro dos prazos do edital.',
  },
  {
    numero: '08',
    titulo: 'Carta, ITBI e registro',
    texto:
      'Acompanhamos a expedição da carta de arrematação, recolhemos o ITBI e registramos o título no cartório competente.',
  },
  {
    numero: '09',
    titulo: 'Posse e chaves',
    texto:
      'Entramos com a imissão na posse, conduzimos a desocupação quando precisa e entregamos o imóvel com a matrícula no seu nome.',
  },
]

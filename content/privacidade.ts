// Conteúdo da política de privacidade (LGPD — Lei nº 13.709/2018).
//
// Os parágrafos que citam e-mail e telefone da empresa não ficam hardcoded
// aqui: a página (app/privacidade/page.tsx) monta esses trechos a partir de
// `config`, marcados pelo campo `contato` de cada seção — mesmo motivo pelo
// qual o resto do site nunca duplica esses valores fora de content/config.ts.
//
// Cobertura exigida (todas as seções abaixo, na ordem): (1) responsável,
// (2) o que se coleta, (3) para que serve, (4) com quem se compartilha,
// (5) por quanto tempo se guarda, (6) direitos do titular (art. 18 da Lei
// 13.709/2018), (7) cookies — descrito fiel ao que o site realmente faz
// hoje, sem ferramenta de medição instalada, e (8) data da última
// atualização, em `ultimaAtualizacao`, renderizada à parte no fim da página.

export interface SecaoPrivacidade {
  titulo: string
  paragrafos: string[]
  /** Quando presente, a página acrescenta um parágrafo com e-mail e/ou
   *  WhatsApp de `config` — o valor em si não é duplicado aqui. */
  contato?: 'responsavel' | 'direitos'
}

export interface Privacidade {
  eyebrow: string
  titulo: string
  lede: string
  ultimaAtualizacao: string
  secoes: SecaoPrivacidade[]
}

export const privacidade: Privacidade = {
  eyebrow: 'Privacidade',
  titulo: 'Política de privacidade',
  lede: 'Como a MT Capital coleta, usa e protege os dados de quem entra em contato pelo site. Sem juridiquês.',
  ultimaAtualizacao: '30 de julho de 2026',
  secoes: [
    {
      titulo: '1. Quem é o responsável',
      paragrafos: [
        'A MT Capital é a responsável pelo tratamento dos dados pessoais coletados neste site, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).',
      ],
      contato: 'responsavel',
    },
    {
      titulo: '2. O que a gente coleta',
      paragrafos: [
        'Nome, telefone e e-mail — só quando você preenche o formulário do guia gratuito, e só com o que você mesmo digita ali.',
        'Além disso, como qualquer site, registramos automaticamente alguns dados técnicos de navegação (endereço IP, tipo de navegador, data e hora de acesso). Servem só para o funcionamento e a segurança do site, como limitar envios repetidos do formulário.',
      ],
    },
    {
      titulo: '3. Para que serve',
      paragrafos: [
        'Usamos os dados do formulário para duas coisas: enviar o guia que você pediu e retomar contato para falar sobre assessoria em leilão. Nada além disso.',
        'Não usamos seus dados para publicidade direcionada, não os revendemos e não tomamos nenhuma decisão automatizada com eles.',
      ],
    },
    {
      titulo: '4. Com quem compartilhamos',
      paragrafos: [
        'Compartilhamos os dados do formulário só com prestadores de serviço que atuam como intermediários técnicos para o contato chegar até a nossa equipe: o serviço de e-mail que entrega a mensagem e, quando configurada, uma ferramenta de automação/CRM usada para organizar o contato comercial com quem pede o guia.',
        'Não vendemos, alugamos nem cedemos sua lista de contatos a mais ninguém, por nenhum motivo.',
      ],
    },
    {
      titulo: '5. Por quanto tempo guardamos',
      paragrafos: [
        'Guardamos seus dados enquanto durar a relação comercial ou até você pedir a exclusão — o que vier primeiro. Depois disso, apagamos.',
      ],
    },
    {
      titulo: '6. Seus direitos',
      paragrafos: [
        'Conforme o artigo 18 da Lei 13.709/2018, você pode confirmar se tratamos seus dados, acessá-los, corrigi-los, pedir a exclusão e revogar o consentimento a qualquer momento, sem custo.',
      ],
      contato: 'direitos',
    },
    {
      titulo: '7. Cookies',
      paragrafos: [
        'Hoje este site não instala cookies de rastreamento e não usa nenhuma ferramenta de medição de audiência — nada como Google Analytics ou pixel de rede social está em funcionamento. Dizemos isso com todas as letras porque é a realidade atual do site, não uma promessa genérica.',
        'Se isso mudar, esta política será atualizada antes da mudança entrar no ar, com a data de revisão no fim da página.',
      ],
    },
  ],
}

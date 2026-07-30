export const config = {
  marca: 'MT Capital',
  assinatura: 'Assessoria em Investimento e Negócios',

  // PENDENTE — número de teste temporário (não é o número real da empresa).
  // Ver docs/PENDENCIAS.md: precisa ser trocado pelo contato real antes do lançamento.
  whatsapp: '5511999999999',   // DDI+DDD+número, apenas dígitos
  telefone: '(11) 99999-9999',

  email: 'contato@mtcapital.com.br',
  endereco: {
    linha1: 'Av. Exemplo, 000 — Conj. 00',   // PENDENTE
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '00000-000',                        // PENDENTE
  },
  anosAtuacao: 10,
  redes: {
    instagram: 'https://instagram.com/',
    tiktok: 'https://www.tiktok.com/',
    youtube: 'https://www.youtube.com/',
    linkedin: 'https://www.linkedin.com/',
  },
} as const

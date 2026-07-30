import { z } from 'zod'

export const TIPOS_IMOVEL = ['Casa', 'Apartamento', 'Terreno', 'Galpão', 'Sala'] as const

export const CasoSchema = z.object({
  id: z.string().min(1),
  tipo: z.enum(TIPOS_IMOVEL),
  titulo: z.string().min(1),
  local: z.string().min(1),
  resumo: z.string().min(1),
  avaliacao: z.number().int().nonnegative(),
  arremate: z.number().int().nonnegative(),
  custos: z.number().int().nonnegative(),
  venda: z.number().int().positive().nullable(),
  parcelas: z.number().int().positive().nullable(),
  prazoMeses: z.number().int().positive().nullable(),
  imagem: z.string().url().nullable(),
  publicado: z.boolean(),
}).refine(
  (c) => !c.publicado || (c.avaliacao > 0 && c.arremate > 0),
  { message: 'Regra da marca: caso publicado exige avaliação e arremate preenchidos.' },
)

const LanceSchema = z.object({
  valor: z.number().int().positive(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data no formato AAAA-MM-DD'),
})

export const ImovelSchema = z.object({
  id: z.string().min(1),
  tipo: z.enum(TIPOS_IMOVEL),
  titulo: z.string().min(1),
  cidade: z.string().min(1),
  uf: z.string().length(2),
  bairro: z.string().nullable(),
  area: z.number().positive().nullable(),
  quartos: z.number().int().nonnegative().nullable(),
  vagas: z.number().int().nonnegative().nullable(),
  valorAvaliacao: z.number().int().positive(),
  lance1: LanceSchema.nullable(),
  lance2: LanceSchema.nullable(),
  imagem: z.string().url().nullable(),
  status: z.enum(['aberto', 'encerrado']),
})

// Toda mensagem de erro abaixo é em português de propósito — é o texto que
// volta em `{ erro, campos }` na resposta de POST /api/lead (ver
// app/api/lead/route.ts) e chega direto na tela de quem preenche o
// formulário (FormularioGuia.tsx). Cada campo string recebe `{ error }` já
// no `z.string(...)` de base (não só nos `.min()`/`.max()`/`.email()`
// encadeados), porque em zod v4 um campo ausente ou de tipo errado (ex.:
// `email` inteiro faltando no corpo do POST) falha na checagem de tipo da
// base, antes de qualquer checagem encadeada rodar — sem a mensagem na
// base, esse caminho especificamente devolveria o texto padrão em inglês do
// zod ("Invalid input: expected string, received undefined"), violando a
// exigência de que toda falha de validação deste schema responda em
// português, sem exceção.
export const LeadSchema = z.object({
  nome: z.string({ error: 'Informe seu nome completo.' })
    .trim()
    .min(2, { error: 'Informe seu nome completo.' })
    .max(120, { error: 'Nome muito longo.' }),
  telefone: z.string({ error: 'Informe um telefone válido, com DDD.' })
    .trim()
    .min(10, { error: 'Informe um telefone válido, com DDD.' })
    .max(20, { error: 'Telefone muito longo.' }),
  // Campo opcional no formulário (pode chegar como '') — por isso não é só
  // `.email()`: o `.refine()` aceita string vazia OU e-mail válido, e tanto
  // o tipo errado quanto o formato inválido caem na mesma mensagem em
  // português. Evita a união `.email().or(z.literal(''))` do desenho
  // anterior, cujo caminho de falha combinada (nenhum dos dois lados bate)
  // devolvia "Invalid input" sem tradução.
  email: z.string({ error: 'Informe um e-mail válido.' })
    .trim()
    .max(160, { error: 'E-mail muito longo.' })
    .refine((v) => v === '' || z.string().email().safeParse(v).success, {
      error: 'Informe um e-mail válido.',
    }),
  consentimento: z.literal(true, {
    error: 'É preciso aceitar o uso dos dados para receber o material.',
  }),
  origem: z.string({ error: 'Origem inválida.' }).max(60, { error: 'Origem inválida.' }).default('guia'),
  armadilha: z.string({ error: 'Campo inválido.' }).max(0, { error: 'Campo inválido.' }).optional(),
})

export type Caso = z.infer<typeof CasoSchema>
export type Imovel = z.infer<typeof ImovelSchema>
export type Lead = z.infer<typeof LeadSchema>

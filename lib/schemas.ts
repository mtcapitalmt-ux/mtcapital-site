import { z } from 'zod'

export const TIPOS_IMOVEL = ['Casa', 'Apartamento', 'Terreno', 'GalpÃ£o', 'Sala'] as const

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
  { message: 'Regra da marca: caso publicado exige avaliaÃ§Ã£o e arremate preenchidos.' },
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

export const LeadSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  telefone: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(160).or(z.literal('')),
  consentimento: z.literal(true, {
    error: 'É preciso aceitar o uso dos dados para receber o material.',
  }),
  origem: z.string().max(60).default('guia'),
  armadilha: z.string().max(0).optional(),
})

export type Caso = z.infer<typeof CasoSchema>
export type Imovel = z.infer<typeof ImovelSchema>
export type Lead = z.infer<typeof LeadSchema>


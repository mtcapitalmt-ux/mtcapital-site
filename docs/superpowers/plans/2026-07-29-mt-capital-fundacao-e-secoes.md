# MT Capital — Plano 1: Fundação e as 15 Seções

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir o site da MT Capital como projeto Next.js versionado, com as 15 seções idênticas ao modelo aprovado e todo o texto extraído para uma única pasta editável.

**Architecture:** App Router com renderização estática. Cada seção é um componente com o seu próprio arquivo de estilo, carregando as declarações CSS transportadas do `index.html` atual — não reescritas. Todo texto vive em `content/`. Todo cálculo de número vive em `lib/`, com teste.

**Tech Stack:** Next.js 15 (App Router), TypeScript, CSS Modules, zod, Vitest, Lenis, Vercel.

---

## Global Constraints

Estas regras valem para **todas** as tarefas deste plano e do Plano 2.

### Fidelidade visual — inegociável

- O layout e as cores do `index.html` na raiz do projeto foram **aprovados internamente pela empresa**. Eles são a referência normativa. Nenhuma tarefa altera espaçamento, cor, tamanho de fonte, ordem de seção ou texto visível.
- Ao portar CSS: **copie a declaração, não a reescreva**. Se a regra atual é `padding:26px 22px 30px 0`, ela continua sendo exatamente isso.
- Proibido introduzir Tailwind, CSS-in-JS ou biblioteca de componentes.

### Tokens da identidade — valores exatos

```
--navy:#192332   --navy-2:#1D2F44   --navy-3:#121A26
--steel:#2C5370  --steel-2:#224256
--gold:#A88458   --gold-lt:#C4A275
--cream:#F5F1EA  --cream-2:#E6DFD3
--line-d:rgba(245,241,234,.14)   --line-l:rgba(25,35,50,.16)
--serif:"Playfair Display",Georgia,serif
--sans:"Jost",system-ui,sans-serif
--pad:clamp(20px,5vw,76px)   --sec:clamp(88px,12vh,164px)
--ease:cubic-bezier(.22,.61,.36,1)
```

### As três regras travadas do negócio

1. **Nunca prometer desconto, rentabilidade ou prazo.** Nenhum texto novo pode conter "sem risco", "sem riscos", "garantido", "garantia de retorno", "rentabilidade", "lucro certo".
2. **Sempre a conta completa nos casos.** Um caso publicado exibe avaliação, arremate e investimento real (arremate + custos).
3. **Nenhum número inventado.** Todo número agregado deriva de `content/casos.ts`. Nenhum literal numérico de resultado no JSX.

### Convenções de código

- TypeScript estrito. `strict: true`, sem `any`.
- **Proibido `dangerouslySetInnerHTML`** em qualquer arquivo. Regra de lint no Plano 2 torna isso mecânico.
- Nomes de arquivo e de componente em português quando descrevem o domínio (`Esteira`, `Mitos`, `casos.ts`); em inglês quando são convenção do framework (`layout.tsx`, `page.tsx`).
- Um componente de seção por arquivo, com `NomeDaSecao.module.css` ao lado.
- Componentes são Server Components por padrão. `'use client'` só onde há estado, evento ou observador — hoje: `Nav`, `Reveal`, `SmoothScroll`, `ContadorAnimado`, `Faq`, `FiltrosCasos`, `MiniaturaFlutuante`, `FormularioGuia`.

### Receita de porte de seção — aplica-se a todas as tarefas de seção

Toda tarefa de seção segue estes seis passos. Este é o exemplo completo e trabalhado; as tarefas seguintes informam apenas o que muda.

1. Localizar o bloco no `index.html` (a tarefa dá o intervalo exato de linhas do HTML e do CSS).
2. Mover cada texto visível para o arquivo indicado em `content/`, tipado.
3. Criar `components/sections/Nome.tsx` que lê de `content/` e renderiza a mesma árvore de elementos, com as mesmas classes.
4. Criar `components/sections/Nome.module.css` colando as declarações CSS do intervalo indicado. Classes globais compartilhadas (`.h1`, `.h2`, `.h3`, `.h4`, `.eyebrow`, `.lede`, `.label`, `.btn`, `.band`, `.section`, `.sec-head`, `.rv`) **permanecem globais** em `styles/base.css` — não migram para módulos.
5. Incluir a seção em `app/page.tsx`, na mesma posição da ordem original.
6. Rodar `npm run build` e conferir a seção lado a lado com `referencia/index.html`.

**Exemplo trabalhado — a seção Pilares:**

`content/pilares.ts`
```ts
export type Pilar = { momento: string; titulo: string; itens: string[] }

export const pilares: Pilar[] = [
  {
    momento: 'Antes',
    titulo: 'Lemos o processo inteiro',
    itens: [
      'Descobrimos por que o imóvel foi parar em leilão',
      'Vemos quem mais tem direito sobre ele',
      'Conferimos o que o edital obriga você a pagar',
    ],
  },
]
```

`components/sections/Pilares.tsx`
```tsx
import { pilares } from '@/content/pilares'
import { Reveal } from '@/components/ui/Reveal'
import s from './Pilares.module.css'

export function Pilares() {
  return (
    <section className="section" style={{ paddingBlock: 0 }}>
      <Reveal stagger className={s.pilares}>
        {pilares.map((p) => (
          <div key={p.momento} className={s.pilar}>
            <p className="label">{p.momento}</p>
            <h3 className="h3">{p.titulo}</h3>
            <ul>
              {p.itens.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
```

`components/sections/Pilares.module.css` — colado de `index.html:112-119`, com os seletores adaptados ao módulo:
```css
.pilares{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line-d);border-block:1px solid var(--line-d)}
.pilar{background:var(--navy);padding:clamp(28px,3.4vw,44px);display:flex;flex-direction:column;gap:16px}
.pilar :global(.label){margin-bottom:2px}
.pilar p{font-size:.95rem;color:rgba(245,241,234,.66)}
.pilar ul{list-style:none;display:flex;flex-direction:column;gap:9px;margin-top:4px}
.pilar li{padding-left:20px;position:relative;font-size:.92rem;color:rgba(245,241,234,.66)}
.pilar li::before{content:"";position:absolute;left:0;top:.62em;width:9px;height:1px;background:var(--gold)}
@media(max-width:1080px){.pilares{grid-template-columns:1fr}}
```

### Mapa de origem — onde cada coisa está no `index.html`

| Bloco | HTML | CSS |
|---|---|---|
| Tokens | — | 18–30 |
| Reset / base | — | 31–38 |
| Tipografia global | — | 45–55 |
| Nav | 322–336 | 57–71 |
| Banda diagonal | — | 73–79 |
| Hero + faixa de números | 341–363 | 81–95 |
| Seções (base) | — | 97–110 |
| Pilares | 366–396 | 112–119 |
| Esclarecimentos | 399–412 | 121–126 |
| Mitos | 415–454 | 127–131 |
| Especialidades | 457–507 | 133–140 |
| Esteira | 510–557 | 142–154 |
| Processo | 560–579 | 169–174 |
| Oportunidades | 582–592 | 176–193 |
| Casos | 595–613 | 195–224 |
| Depoimentos | 616–641 | 226–233 |
| Equipe | 644–671 | 235–242 |
| Guia | 674–691 | 244–252 |
| FAQ | 694–703 | 254–263 |
| CTA + Rodapé | 706–750 | 265–280 |
| WhatsApp flutuante | 754–756 | 278–280 |
| Reveals | — | 282–288 |
| Responsivo | — | 290–316 |

**CSS morto — não portar:** o bloco `.planos` (`index.html:156-167`) é resto da precificação em dois planos que o planejamento substituiu pela esteira. Nenhum elemento usa essas classes. Descartar.

**Duplicata — não portar duas vezes:** `.caso-img{position:relative}` aparece em `index.html:198` e de novo em `223`. Manter uma.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `app/layout.tsx` | HTML raiz, fontes locais, metadata base, skip-link, SmoothScroll |
| `app/page.tsx` | Compõe as 15 seções na ordem aprovada |
| `content/config.ts` | WhatsApp, telefone, e-mail, endereço, redes, anos de atuação |
| `content/casos.ts` | Casos reais — única origem dos números agregados |
| `content/mitos.ts` `faq.ts` `etapas.ts` `especialidades.ts` `esteira.ts` `pilares.ts` `socios.ts` `depoimentos.ts` `textos.ts` | Todo o texto restante |
| `lib/schemas.ts` | Formato de Caso, Imóvel, Lead (zod) |
| `lib/formato.ts` | `brl`, `brlCompacto`, `dataBR`, `digitos` |
| `lib/metricas.ts` | Cálculo dos números agregados |
| `lib/whatsapp.ts` | Montagem dos links pré-preenchidos |
| `lib/config-guard.ts` | Derruba o build de produção com dado em placeholder |
| `components/ui/Reveal.tsx` | Revelação por scroll (`.rv`, `.rv-mask`, `data-stagger`) |
| `components/ui/SmoothScroll.tsx` | Lenis, respeitando toque e movimento reduzido |
| `components/ui/ContadorAnimado.tsx` | Contagem crescente dos números do topo |
| `components/brand/Monograma.tsx` | O MT vetorizado |
| `styles/tokens.css` `styles/base.css` | Variáveis e classes globais compartilhadas |

---

## Task 1: Repositório, projeto Next.js e primeiro deploy

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `vitest.config.ts`
- Create: `app/layout.tsx`, `app/page.tsx`
- Delete: `package-lock.json` (esqueleto órfão, sem `package.json` correspondente)
- Move: `index.html` → `referencia/index.html`

**Interfaces:**
- Produces: projeto que roda com `npm run dev`, publica com `npm run build` e testa com `npm run test`.

- [ ] **Step 1: Inicializar o repositório e preservar o modelo aprovado**

```bash
cd "C:/Users/drive/Documents/MT Capital"
git init
printf 'node_modules/\n.next/\n.vercel/\n.env*.local\n' > .gitignore
git add -A && git commit -m "chore: estado inicial — prévia aprovada em arquivo único"
mkdir -p referencia && git mv index.html referencia/index.html
git rm --cached package-lock.json && rm -f package-lock.json
git commit -m "chore: preserva a prévia aprovada como referência de conferência"
```

O `index.html` vira referência de conferência visual. Ele não é apagado em momento nenhum deste plano.

- [ ] **Step 2: Criar o projeto Next.js sobre a pasta existente**

```bash
npx create-next-app@latest . --ts --app --eslint --no-tailwind --no-src-dir --import-alias "@/*" --use-npm
```

Quando perguntar sobre prosseguir em diretório não vazio, aceitar. As pastas preservadas (`referencia/`, `docs/`), os três PNGs e o PDF não são tocados.

- [ ] **Step 3: Adicionar as dependências do projeto**

```bash
npm install zod lenis
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 4: Configurar o Vitest**

Criar `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
})
```

Acrescentar em `package.json`:
```json
"scripts": { "test": "vitest run", "test:watch": "vitest" }
```

- [ ] **Step 5: Verificar que o projeto sobe**

Run: `npm run build`
Expected: build conclui sem erro.

Run: `npm run test`
Expected: "No test files found" — ainda não há testes. Sem erro de configuração.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: projeto Next.js, dependências e Vitest"
```

- [ ] **Step 7: Publicar a primeira prévia**

```bash
npx vercel --yes
```

Anotar a URL. A partir daqui toda tarefa tem endereço para conferir.

---

## Task 2: Tokens, base CSS e fontes locais

**Files:**
- Create: `styles/tokens.css`, `styles/base.css`
- Create: `app/fonts/jost.woff2`, `app/fonts/playfair.woff2`, `app/fonts/playfair-italic.woff2`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: variáveis CSS em toda a árvore; classes globais `.h1 .h2 .h3 .h4 .eyebrow .lede .label .tab .btn .btn-ghost .band .section .sec-cream .sec-steel .sec-navy2 .sec-head .rv .rv-mask`; famílias `--serif` e `--sans` resolvendo para arquivo local.

- [ ] **Step 1: Baixar as três fontes variáveis**

O Google serve Playfair Display e Jost como fontes variáveis — três arquivos cobrem todos os pesos usados no site.

```bash
mkdir -p app/fonts
curl -sL "https://fonts.gstatic.com/s/jost/v20/92zatBhPNqw73oTd4g.woff2" -o app/fonts/jost.woff2
curl -sL "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd3vXDXbtM.woff2" -o app/fonts/playfair.woff2
curl -sL "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTXtHA-Q.woff2" -o app/fonts/playfair-italic.woff2
ls -l app/fonts
```

Expected: três arquivos entre 20 KB e 30 KB cada.

Se as URLs tiverem mudado de versão, obter as atuais com:
```bash
curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" \
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,400&family=Jost:wght@400;500"
```
e pegar as URLs dos blocos comentados `/* latin */`.

- [ ] **Step 2: Declarar as fontes em `app/layout.tsx`**

```tsx
import localFont from 'next/font/local'

const jost = localFont({
  src: './fonts/jost.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-sans',
})

const playfair = localFont({
  src: [
    { path: './fonts/playfair.woff2', weight: '400 900', style: 'normal' },
    { path: './fonts/playfair-italic.woff2', weight: '400 900', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-serif',
})
```

E no `<html>`: `className={`${jost.variable} ${playfair.variable}`}`.

- [ ] **Step 3: Criar `styles/tokens.css`**

Colar o bloco `:root` de `index.html:18-30` sem alteração de valor, trocando apenas as duas linhas de família:

```css
:root{
  --navy:#192332; --navy-2:#1D2F44; --navy-3:#121A26;
  --steel:#2C5370; --steel-2:#224256;
  --gold:#A88458; --gold-lt:#C4A275;
  --cream:#F5F1EA; --cream-2:#E6DFD3;
  --line-d:rgba(245,241,234,.14);
  --line-l:rgba(25,35,50,.16);
  --serif:var(--font-serif),Georgia,serif;
  --sans:var(--font-sans),system-ui,sans-serif;
  --pad:clamp(20px,5vw,76px);
  --sec:clamp(88px,12vh,164px);
  --ease:cubic-bezier(.22,.61,.36,1);
}
```

- [ ] **Step 4: Criar `styles/base.css`**

Colar, nesta ordem e sem alteração de valores, os intervalos de `index.html`: `31-38` (reset e body), `45-55` (tipografia), `67-71` (botões), `73-79` (banda diagonal), `97-110` (seções e cabeçalho de seção), `282-288` (reveals).

Do bloco responsivo `290-316`, trazer apenas as regras de classes globais (`body`, `.foot-grid`, `.etapa`). As regras de seção específica vão para o módulo da respectiva seção.

**Não portar** o bloco `40-43` (`#smooth-wrapper` / `#smooth-content`) — o Lenis da Task 8 substitui essa técnica.

Importar no topo de `app/layout.tsx`:
```tsx
import '@/styles/tokens.css'
import '@/styles/base.css'
```

- [ ] **Step 5: Verificar que nenhuma fonte vem de terceiro**

Run: `npm run dev` e abrir `http://localhost:3000`
Expected: fundo `#192332`, texto creme, Jost aplicada.

Na aba Network do navegador, filtrar por "font". Expected: as três fontes vêm do próprio domínio. **Nenhuma** requisição para `fonts.googleapis.com` ou `fonts.gstatic.com`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: tokens da identidade, base CSS e fontes hospedadas localmente"
```

---

## Task 3: Marca — monograma, ícone e cartão de compartilhamento

**Files:**
- Create: `components/brand/Monograma.tsx`
- Create: `app/icon.svg`
- Create: `app/opengraph-image.tsx`

**Interfaces:**
- Produces: `<Monograma className? corM? corT? title? />`; ícone de aba; cartão de compartilhamento 1200×630.

- [ ] **Step 1: Vetorizar o monograma**

O monograma MT está nos avatares em 4501×4500. Usar `avatares - wpp-03.png` como origem de traçado: nela o M está em navy e o T em azul aço, o que separa visualmente os dois caminhos.

Criar `components/brand/Monograma.tsx`:

```tsx
type Props = { className?: string; corM?: string; corT?: string; title?: string }

export function Monograma({
  className,
  corM = 'currentColor',
  corT = 'var(--gold-lt)',
  title = 'MT Capital',
}: Props) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={title}>
      {/* M — zigue-zague de traço uniforme com hastes verticais nas pontas */}
      <path fill={corM} d="…" />
      {/* T — haste vertical à direita, com a barra atravessando o vão do M na diagonal */}
      <path fill={corT} d="…" />
    </svg>
  )
}
```

Traçar os dois caminhos sobre a imagem em escala, preservando os ângulos originais. O M ocupa a metade esquerda e o centro; o T sobrepõe a metade direita.

- [ ] **Step 2: Conferir a fidelidade do traçado**

Renderizar o SVG a 500 px, sobrepor ao recorte do PNG na mesma escala e ajustar até os vértices coincidirem. **Passo visual, não automatizável.** Só seguir quando estiver igual.

- [ ] **Step 3: Gerar o ícone de aba**

Criar `app/icon.svg`: quadrado, fundo `#192332`, monograma em `#A88458`, margem interna de 12%.

- [ ] **Step 4: Gerar o cartão de compartilhamento**

Corrige o link do site aparecendo sem imagem no WhatsApp — que é o canal onde a conversão acontece.

`app/opengraph-image.tsx`:
```tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'MT Capital — Comprar bem começa antes do lance'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', background: '#192332',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: 80, color: '#F5F1EA',
      }}>
        <div style={{ fontSize: 22, letterSpacing: 6, color: '#C4A275', textTransform: 'uppercase' }}>
          Assessoria em leilão de imóveis e terrenos
        </div>
        <div style={{ fontSize: 76, marginTop: 28, lineHeight: 1.05 }}>
          Comprar bem começa antes do lance.
        </div>
        <div style={{ fontSize: 26, marginTop: 40, letterSpacing: 4, color: '#A88458', textTransform: 'uppercase' }}>
          MT Capital
        </div>
      </div>
    ),
    size,
  )
}
```

- [ ] **Step 5: Verificar**

Run: `npm run dev`, abrir `http://localhost:3000/opengraph-image`
Expected: imagem 1200×630, sem texto cortado.

Conferir o ícone na aba do navegador.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: monograma MT vetorizado, ícone e cartão de compartilhamento"
```

---

## Task 4: Contratos de dados e guarda de configuração

**Files:**
- Create: `lib/schemas.ts`, `lib/config-guard.ts`
- Test: `tests/schemas.test.ts`

**Interfaces:**
- Produces: `CasoSchema`, `ImovelSchema`, `LeadSchema`, `TIPOS_IMOVEL`, e os tipos `Caso`, `Imovel`, `Lead`. Produces `ehPlaceholder(valor: string): boolean` e `validarConfig(cfg: ConfigSite): void`.

- [ ] **Step 1: Escrever o teste que falha**

`tests/schemas.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { CasoSchema } from '@/lib/schemas'
import { ehPlaceholder } from '@/lib/config-guard'

const base = {
  id: 'ribeira', tipo: 'Casa' as const, titulo: 'Casa na Ribeira',
  local: 'Ribeira · RJ', resumo: 'Resumo do caso.',
  avaliacao: 400000, arremate: 250000, custos: 30000,
  venda: null, parcelas: null, prazoMeses: 8, imagem: null,
  publicado: true,
}

describe('CasoSchema', () => {
  it('aceita um caso com a conta completa', () => {
    expect(CasoSchema.parse(base)).toMatchObject({ id: 'ribeira' })
  })
  it('recusa caso publicado sem avaliação', () => {
    expect(() => CasoSchema.parse({ ...base, avaliacao: 0 })).toThrow()
  })
  it('recusa caso publicado sem arremate', () => {
    expect(() => CasoSchema.parse({ ...base, arremate: 0 })).toThrow()
  })
  it('aceita caso incompleto desde que não publicado', () => {
    expect(() => CasoSchema.parse({ ...base, avaliacao: 0, publicado: false })).not.toThrow()
  })
})

describe('ehPlaceholder', () => {
  it('reconhece os placeholders atuais do site', () => {
    expect(ehPlaceholder('5511000000000')).toBe(true)
    expect(ehPlaceholder('(11) 0000-0000')).toBe(true)
    expect(ehPlaceholder('')).toBe(true)
  })
  it('aceita dados reais', () => {
    expect(ehPlaceholder('5511987654321')).toBe(false)
    expect(ehPlaceholder('(11) 3456-7890')).toBe(false)
  })
})
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `npm run test -- tests/schemas.test.ts`
Expected: FAIL — "Cannot find module '@/lib/schemas'".

- [ ] **Step 3: Escrever os contratos**

`lib/schemas.ts`:
```ts
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

export const LeadSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  telefone: z.string().trim().min(10).max(20),
  email: z.string().trim().email().max(160).or(z.literal('')),
  consentimento: z.literal(true, {
    errorMap: () => ({ message: 'É preciso aceitar o uso dos dados para receber o material.' }),
  }),
  origem: z.string().max(60).default('guia'),
  armadilha: z.string().max(0).optional(),
})

export type Caso = z.infer<typeof CasoSchema>
export type Imovel = z.infer<typeof ImovelSchema>
export type Lead = z.infer<typeof LeadSchema>
```

- [ ] **Step 4: Escrever a guarda de configuração**

`lib/config-guard.ts`:
```ts
export type ConfigSite = { whatsapp: string; telefone: string }

const PLACEHOLDERS: RegExp[] = [
  /^55\d{2}0{7,}$/,           // 5511000000000
  /\(\d{2}\)\s*0{4}-?0{4}/,   // (11) 0000-0000
  /^$/,
]

export function ehPlaceholder(valor: string): boolean {
  return PLACEHOLDERS.some((r) => r.test(valor))
}

export function validarConfig(cfg: ConfigSite): void {
  const pendentes = (['whatsapp', 'telefone'] as const).filter((k) => ehPlaceholder(cfg[k]))
  if (pendentes.length === 0) return

  const aviso =
    `Dados de contato ainda em placeholder: ${pendentes.join(', ')}. ` +
    `Preencha em content/config.ts antes de publicar.`

  if (process.env.NODE_ENV === 'production') throw new Error(`[MT Capital] ${aviso}`)
  console.warn(`[MT Capital] ${aviso}`)
}
```

- [ ] **Step 5: Rodar e confirmar aprovação**

Run: `npm run test -- tests/schemas.test.ts`
Expected: PASS, 6 testes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: contratos de dados em zod e guarda de configuração"
```

---

## Task 5: Formatação de valores

**Files:**
- Create: `lib/formato.ts`
- Test: `tests/formato.test.ts`

**Interfaces:**
- Produces: `brl(valor: number): string`, `brlCompacto(valor: number): string`, `dataBR(iso: string | null): string`, `digitos(s: string): string`.

Corrige dois defeitos críticos: o literal `R$ 000.000` e o arredondamento que transforma R$ 500 mil em R$ 1 mi.

- [ ] **Step 1: Escrever o teste que falha**

`tests/formato.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { brl, brlCompacto, dataBR, digitos } from '@/lib/formato'

describe('brl', () => {
  it('formata em reais sem centavos', () => {
    expect(brl(1234567)).toBe('R$ 1.234.567')
    expect(brl(500000)).toBe('R$ 500.000')
  })
  it('nunca produz o placeholder R$ 000.000', () => {
    expect(brl(0)).toBe('R$ 0')
    expect(brl(0)).not.toContain('000.000')
  })
})

describe('brlCompacto', () => {
  it('não arredonda meio milhão para um milhão', () => {
    expect(brlCompacto(500000)).toBe('R$ 500 mil')
  })
  it('usa uma casa decimal com vírgula acima de um milhão', () => {
    expect(brlCompacto(1000000)).toBe('R$ 1 mi')
    expect(brlCompacto(1200000)).toBe('R$ 1,2 mi')
    expect(brlCompacto(12500000)).toBe('R$ 12,5 mi')
  })
  it('mostra o valor cheio abaixo de mil', () => {
    expect(brlCompacto(0)).toBe('R$ 0')
    expect(brlCompacto(850)).toBe('R$ 850')
  })
})

describe('dataBR', () => {
  it('converte AAAA-MM-DD para DD/MM/AAAA', () => {
    expect(dataBR('2026-08-14')).toBe('14/08/2026')
  })
  it('devolve travessão quando não há data', () => {
    expect(dataBR(null)).toBe('—')
  })
})

describe('digitos', () => {
  it('remove tudo que não é dígito', () => {
    expect(digitos('(11) 98765-4321')).toBe('11987654321')
  })
})
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `npm run test -- tests/formato.test.ts`
Expected: FAIL — "Cannot find module '@/lib/formato'".

- [ ] **Step 3: Implementar**

`lib/formato.ts`:
```ts
export function brl(valor: number): string {
  return 'R$ ' + Math.round(valor).toLocaleString('pt-BR')
}

export function brlCompacto(valor: number): string {
  const v = Math.round(valor)
  if (v < 1_000) return `R$ ${v.toLocaleString('pt-BR')}`
  if (v < 1_000_000) return `R$ ${Math.round(v / 1_000).toLocaleString('pt-BR')} mil`
  const mi = v / 1_000_000
  const texto = mi.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
  return `R$ ${texto} mi`
}

export function dataBR(iso: string | null): string {
  if (!iso) return '—'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

export function digitos(s: string): string {
  return s.replace(/\D/g, '')
}
```

- [ ] **Step 4: Rodar e confirmar aprovação**

Run: `npm run test -- tests/formato.test.ts`
Expected: PASS, 8 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: formatação de valores — corrige placeholder e arredondamento"
```

---

## Task 6: Números agregados

**Files:**
- Create: `lib/metricas.ts`
- Test: `tests/metricas.test.ts`

**Interfaces:**
- Consumes: `Caso` de `lib/schemas.ts`.
- Produces:
```ts
export type Metricas = {
  anosAtuacao: number
  operacoes: number
  volumeAvaliado: number
  maiorDesconto: number
  descontoMedio: number
  resultadoRevendas: number
}
export function calcularMetricas(casos: Caso[], anosAtuacao: number): Metricas
export function descontoDe(c: Caso): number | null
export function lucroDe(c: Caso): number | null
export function investimentoReal(c: Caso): number
```

Corrige a contradição entre a faixa do topo e a seção de casos, e impede que casos de exemplo entrem na contagem.

- [ ] **Step 1: Escrever o teste que falha**

`tests/metricas.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { calcularMetricas, descontoDe, lucroDe, investimentoReal } from '@/lib/metricas'
import type { Caso } from '@/lib/schemas'

const caso = (over: Partial<Caso>): Caso => ({
  id: 'x', tipo: 'Casa', titulo: 't', local: 'l', resumo: 'r',
  avaliacao: 0, arremate: 0, custos: 0,
  venda: null, parcelas: null, prazoMeses: null, imagem: null,
  publicado: true, ...over,
} as Caso)

describe('calcularMetricas', () => {
  it('ignora casos não publicados', () => {
    const m = calcularMetricas([
      caso({ id: 'a', avaliacao: 400000, arremate: 250000, publicado: true }),
      caso({ id: 'b', avaliacao: 900000, arremate: 500000, publicado: false }),
    ], 10)
    expect(m.operacoes).toBe(1)
    expect(m.volumeAvaliado).toBe(400000)
  })

  it('devolve zero em tudo quando não há caso publicado', () => {
    const m = calcularMetricas([caso({ publicado: false })], 10)
    expect(m).toMatchObject({
      operacoes: 0, volumeAvaliado: 0, maiorDesconto: 0,
      descontoMedio: 0, resultadoRevendas: 0, anosAtuacao: 10,
    })
  })

  it('preserva o valor exato do volume, sem arredondar para milhão', () => {
    const m = calcularMetricas([caso({ avaliacao: 500000, arremate: 300000 })], 10)
    expect(m.volumeAvaliado).toBe(500000)
  })

  it('calcula maior desconto e desconto médio', () => {
    const m = calcularMetricas([
      caso({ id: 'a', avaliacao: 1000000, arremate: 600000 }),
      caso({ id: 'b', avaliacao: 1000000, arremate: 800000 }),
    ], 10)
    expect(m.maiorDesconto).toBe(40)
    expect(m.descontoMedio).toBe(30)
  })

  it('só soma resultado de revenda concluída', () => {
    const m = calcularMetricas([
      caso({ id: 'a', avaliacao: 500000, arremate: 300000, custos: 50000, venda: 480000 }),
      caso({ id: 'b', avaliacao: 500000, arremate: 300000, custos: 50000, venda: null }),
    ], 10)
    expect(m.resultadoRevendas).toBe(130000)
  })
})

describe('auxiliares', () => {
  it('desconto é nulo sem avaliação', () => {
    expect(descontoDe(caso({ avaliacao: 0, arremate: 100 }))).toBeNull()
  })
  it('lucro é nulo sem revenda', () => {
    expect(lucroDe(caso({ arremate: 100, venda: null }))).toBeNull()
  })
  it('investimento real soma custos ao arremate', () => {
    expect(investimentoReal(caso({ arremate: 300000, custos: 45000 }))).toBe(345000)
  })
})
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `npm run test -- tests/metricas.test.ts`
Expected: FAIL — "Cannot find module '@/lib/metricas'".

- [ ] **Step 3: Implementar**

`lib/metricas.ts`:
```ts
import type { Caso } from '@/lib/schemas'

export type Metricas = {
  anosAtuacao: number
  operacoes: number
  volumeAvaliado: number
  maiorDesconto: number
  descontoMedio: number
  resultadoRevendas: number
}

export function descontoDe(c: Caso): number | null {
  if (c.avaliacao <= 0 || c.arremate <= 0) return null
  return Math.round((1 - c.arremate / c.avaliacao) * 100)
}

export function investimentoReal(c: Caso): number {
  return c.arremate + c.custos
}

export function lucroDe(c: Caso): number | null {
  if (c.venda === null) return null
  return c.venda - investimentoReal(c)
}

export function calcularMetricas(casos: Caso[], anosAtuacao: number): Metricas {
  const publicados = casos.filter((c) => c.publicado)
  const volumeAvaliado = publicados.reduce((s, c) => s + c.avaliacao, 0)

  const descontos = publicados
    .map(descontoDe)
    .filter((d): d is number => d !== null && d > 0)

  const lucros = publicados
    .map(lucroDe)
    .filter((v): v is number => v !== null)

  return {
    anosAtuacao,
    operacoes: publicados.length,
    volumeAvaliado,
    maiorDesconto: descontos.length ? Math.max(...descontos) : 0,
    descontoMedio: descontos.length
      ? Math.round(descontos.reduce((s, d) => s + d, 0) / descontos.length)
      : 0,
    resultadoRevendas: lucros.reduce((s, v) => s + v, 0),
  }
}
```

- [ ] **Step 4: Rodar e confirmar aprovação**

Run: `npm run test -- tests/metricas.test.ts`
Expected: PASS, 8 testes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: números agregados derivados dos casos publicados"
```

---

## Task 7: Extração de todo o texto para `content/`

**Files:**
- Create: `content/config.ts`, `textos.ts`, `pilares.ts`, `mitos.ts`, `especialidades.ts`, `esteira.ts`, `etapas.ts`, `casos.ts`, `depoimentos.ts`, `socios.ts`, `faq.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces: os arrays tipados que cada seção consome, com estes nomes exatos: `config`, `textos`, `pilares`, `mitos`, `especialidades`, `esteira`, `etapas`, `casos`, `depoimentos`, `socios`, `faq`.

- [ ] **Step 1: Criar `content/config.ts`**

```ts
export const config = {
  marca: 'MT Capital',
  assinatura: 'Assessoria em Investimento e Negócios',

  // PENDENTE — preencher antes de publicar. Placeholder derruba o build de produção.
  whatsapp: '5511000000000',   // DDI+DDD+número, apenas dígitos
  telefone: '(11) 0000-0000',

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
```

- [ ] **Step 2: Extrair os textos de seção**

Transcrever **literalmente** de `referencia/index.html`, sem reescrever nem corrigir. Origem de cada arquivo:

| Arquivo | Origem (linhas) | Formato |
|---|---|---|
| `textos.ts` | 344–351, 403–409, 417–422, 458–463, 512–517, 561–566, 583–588, 596–601, 619–622, 646–651, 677–680, 697–700, 708–711, 719 | Objeto com as chaves `hero`, `esclarecimentos`, `mitosCabecalho`, `especialidadesCabecalho`, `esteiraCabecalho`, `processoCabecalho`, `oportunidadesCabecalho`, `casosCabecalho`, `depoimentosCabecalho`, `equipeCabecalho`, `guia`, `faqCabecalho`, `cta`, `rodape` |
| `pilares.ts` | 368–394 | `Pilar[]` — ver exemplo nas Global Constraints |
| `mitos.ts` | 425–453 | `{ pergunta: string; resposta: string; destaque: string }[]` — 7 itens. `destaque` é o trecho hoje em `<b>` |
| `especialidades.ts` | 467–505 | `{ numero: string; titulo: string; chamada: string; itens: string[] }[]` — 3 itens |
| `esteira.ts` | 521–549 | `{ numero: string; etiqueta: string; titulo: string; texto: string; cta?: { rotulo: string; destino: 'guia' \| 'whatsapp'; mensagem?: string }; destaque?: boolean }[]` — 4 itens |
| `etapas.ts` | 569–577 | `{ numero: string; titulo: string; texto: string }[]` — 9 itens |
| `depoimentos.ts` | 625–639 | `{ texto: string; nome: string; qualificacao: string }[]` — 3 itens |
| `socios.ts` | 654–669 | `{ papel: string; nome: string; bio: string; foto: string \| null }[]` — 2 itens |
| `faq.ts` | 1083–1106 | `{ pergunta: string; resposta: string }[]` — 11 itens |

Em `depoimentos.ts` e `socios.ts`, marcar os textos de exemplo com o comentário `// PENDENTE: substituir por conteúdo real com autorização por escrito`.

- [ ] **Step 3: Criar `content/casos.ts` com os casos marcados como não publicados**

Os dois casos atuais são exemplos, não operações reais. Com `publicado: false`, a faixa do topo mostra zero — que é a verdade, e é o comportamento pretendido pela regra "nenhum número inventado".

```ts
import { CasoSchema, type Caso } from '@/lib/schemas'

const brutos = [
  {
    id: 'ribeira', tipo: 'Casa', titulo: 'Casa arrematada na Ribeira',
    local: 'Ribeira · RJ',
    resumo: 'PENDENTE — situação do imóvel, o entrave identificado no processo e como a equipe resolveu.',
    avaliacao: 0, arremate: 0, custos: 0,
    venda: null, parcelas: null, prazoMeses: null, imagem: null,
    publicado: false,
  },
  {
    id: 'ilha', tipo: 'Terreno', titulo: 'Terreno adquirido após leilão deserto',
    local: 'Ilha · RJ',
    resumo: 'O bem não recebeu lances em nenhuma das praças. A equipe negociou diretamente com o credor e fechou a aquisição parcelada, sem disputa de pregão.',
    avaliacao: 0, arremate: 500000, custos: 0,
    venda: null, parcelas: 18, prazoMeses: null, imagem: null,
    publicado: false,
  },
]

export const casos: Caso[] = brutos.map((c) => CasoSchema.parse(c))
```

- [ ] **Step 4: Escrever o teste do conteúdo**

`tests/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { casos } from '@/content/casos'
import { faq } from '@/content/faq'
import { etapas } from '@/content/etapas'
import { mitos } from '@/content/mitos'
import { especialidades } from '@/content/especialidades'
import { esteira } from '@/content/esteira'
import { pilares } from '@/content/pilares'

describe('conteúdo', () => {
  it('mantém a contagem aprovada de cada bloco', () => {
    expect(pilares).toHaveLength(3)
    expect(mitos).toHaveLength(7)
    expect(especialidades).toHaveLength(3)
    expect(esteira).toHaveLength(4)
    expect(etapas).toHaveLength(9)
    expect(faq).toHaveLength(11)
  })

  it('todo caso passa pelo contrato', () => {
    expect(casos.length).toBeGreaterThan(0)
  })

  it('nenhum caso de exemplo está publicado', () => {
    const exemplos = casos.filter((c) => c.resumo.includes('PENDENTE'))
    expect(exemplos.every((c) => !c.publicado)).toBe(true)
  })
})
```

- [ ] **Step 5: Rodar**

Run: `npm run test -- tests/content.test.ts`
Expected: PASS, 3 testes.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: todo o texto do site extraído para content/"
```

---

## Task 8: Componentes de comportamento

**Files:**
- Create: `lib/whatsapp.ts`
- Create: `components/ui/Reveal.tsx`, `components/ui/SmoothScroll.tsx`, `components/ui/ContadorAnimado.tsx`
- Test: `tests/whatsapp.test.ts`

**Interfaces:**
- Produces:
```ts
export function linkWhatsApp(mensagem: string): string
export function mensagemImovel(im: Imovel): string
export function Reveal(props: { children: React.ReactNode; className?: string; mask?: boolean; stagger?: boolean; as?: 'div' | 'section' }): JSX.Element
export function SmoothScroll(): null
export function ContadorAnimado(props: { valor: number; prefixo?: string; sufixo?: string }): JSX.Element
```

Substitui a rolagem customizada que sequestra a página.

- [ ] **Step 1: Escrever o teste do link de WhatsApp**

`tests/whatsapp.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/content/config', () => ({ config: { whatsapp: '5511987654321' } }))

const { linkWhatsApp } = await import('@/lib/whatsapp')

describe('linkWhatsApp', () => {
  it('monta o endereço com a mensagem codificada', () => {
    expect(linkWhatsApp('Olá! Tudo bem?'))
      .toBe('https://wa.me/5511987654321?text=Ol%C3%A1!%20Tudo%20bem%3F')
  })
  it('codifica quebra de linha', () => {
    expect(linkWhatsApp('a\nb')).toContain('%0A')
  })
})
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `npm run test -- tests/whatsapp.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar `lib/whatsapp.ts`**

```ts
import { config } from '@/content/config'
import { brl, dataBR } from '@/lib/formato'
import type { Imovel } from '@/lib/schemas'

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function mensagemImovel(im: Imovel): string {
  const lance = im.lance2?.valor ?? im.lance1?.valor ?? 0
  return [
    'Olá! Tenho interesse no seguinte imóvel:',
    '',
    im.titulo,
    `Avaliação: ${brl(im.valorAvaliacao)}`,
    `Lance mínimo: ${brl(lance)}`,
    im.lance2 ? `2ª praça: ${dataBR(im.lance2.data)}` : null,
    '',
    'Gostaria de receber a análise.',
  ].filter((l): l is string => l !== null).join('\n')
}
```

- [ ] **Step 4: Rodar e confirmar aprovação**

Run: `npm run test -- tests/whatsapp.test.ts`
Expected: PASS, 2 testes.

- [ ] **Step 5: Implementar `components/ui/Reveal.tsx`**

Porta o comportamento de `index.html:889-905`, com as mesmas classes e o mesmo atraso de 90 ms entre filhos.

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  mask?: boolean
  stagger?: boolean
  as?: 'div' | 'section'
}

export function Reveal({ children, className, mask, stagger, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setVisivel(true); return }

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue
          if (stagger) {
            Array.from(el.children).forEach((c, i) => {
              ;(c as HTMLElement).style.transitionDelay = `${i * 90}ms`
            })
          }
          setVisivel(true)
          io.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [stagger])

  const base = mask ? 'rv-mask' : 'rv'
  return (
    <Tag
      ref={ref}
      className={[base, visivel ? 'in' : '', className].filter(Boolean).join(' ')}
      {...(stagger ? { 'data-stagger': '' } : {})}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 6: Implementar `components/ui/SmoothScroll.tsx`**

Lenis anima a posição real de rolagem. Sem wrapper fixo, sem altura de corpo calculada, sem `setTimeout`.

```tsx
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScroll() {
  useEffect(() => {
    const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches
    const toque = matchMedia('(hover: none)').matches
    if (reduzido || toque || window.innerWidth <= 900) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let id = requestAnimationFrame(function raf(t: number) {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    })
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  return null
}
```

Acrescentar em `styles/base.css`:
```css
html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto!important}
```

- [ ] **Step 7: Implementar `components/ui/ContadorAnimado.tsx`**

Porta `index.html:907-917`, mantendo os 1500 ms e a curva `1-(1-p)³`.

```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export function ContadorAnimado({ valor, prefixo = '', sufixo = '' }: { valor: number; prefixo?: string; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [atual, setAtual] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setAtual(valor); return }

    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return
      io.unobserve(el)
      const t0 = performance.now()
      const passo = (t: number) => {
        const p = Math.min((t - t0) / 1500, 1)
        setAtual(Math.round(valor * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(passo)
      }
      requestAnimationFrame(passo)
    }, { threshold: 0.15 })

    io.observe(el)
    return () => io.disconnect()
  }, [valor])

  return <span ref={ref}>{prefixo}{atual.toLocaleString('pt-BR')}{sufixo}</span>
}
```

- [ ] **Step 8: Verificar**

Run: `npm run test && npm run build`
Expected: 19 testes passando, build sem erro.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: revelação por scroll, rolagem via Lenis e contador animado"
```

---

## Task 9: Layout base, navegação e atalho de acessibilidade

**Files:**
- Modify: `app/layout.tsx`, `app/page.tsx`
- Create: `components/sections/Nav.tsx`, `components/sections/Nav.module.css`
- Modify: `styles/base.css`

**Interfaces:**
- Consumes: `config`, `Monograma`, `SmoothScroll`, `validarConfig`.
- Produces: `<Nav />`; `app/page.tsx` com `<main id="conteudo">` pronto para receber as seções.

- [ ] **Step 1: Portar a navegação**

Origem HTML `322–336`, CSS `57–71`. Componente cliente por causa do `scroll` que aplica a classe `stuck` (`index.html:887`).

O `.brand` recebe o `<Monograma />` à esquerda do texto — hoje o cabeçalho é só texto e a marca não aparece em lugar nenhum do site.

Os seis links de navegação e o botão "Fale conosco" (WhatsApp) saem como estão hoje.

- [ ] **Step 2: Acrescentar o atalho de navegação**

Primeiro elemento dentro de `<body>` em `app/layout.tsx`:
```tsx
<a href="#conteudo" className="skip">Pular para o conteúdo</a>
```

Em `styles/base.css`:
```css
.skip{position:absolute;left:-9999px;top:0;z-index:200;background:var(--gold);color:var(--navy);padding:12px 20px;font-size:12px;letter-spacing:.16em;text-transform:uppercase}
.skip:focus{left:var(--pad);top:12px}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
```

Em `app/page.tsx`, envolver as seções em `<main id="conteudo">`.

- [ ] **Step 3: Chamar a guarda de configuração**

No topo de `app/layout.tsx`, fora do componente:
```tsx
import { config } from '@/content/config'
import { validarConfig } from '@/lib/config-guard'

validarConfig(config)
```

- [ ] **Step 4: Verificar a guarda**

Run: `npm run dev`
Expected: no console do servidor aparece `[MT Capital] Dados de contato ainda em placeholder: whatsapp, telefone.` — correto em desenvolvimento.

Run: `npm run build`
Expected: **FALHA** com a mesma mensagem. Este é o comportamento desejado: com placeholder não se publica.

Para prosseguir com o plano antes de ter os números reais, exportar temporariamente `MT_PERMITIR_PLACEHOLDER=1` **não** é opção — em vez disso, preencher `content/config.ts` com um número de teste válido (por exemplo `5511999999999` e `(11) 99999-9999`) e registrar em `docs/PENDENCIAS.md` que ele precisa ser trocado antes do lançamento.

- [ ] **Step 5: Conferir o atalho pelo teclado**

Abrir a página e pressionar Tab uma vez.
Expected: "Pular para o conteúdo" aparece no canto superior esquerdo com contorno visível; Enter leva ao `<main>`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: layout base, navegação com monograma e atalho de conteúdo"
```

---

## Tasks 10–21: As seções

Cada tarefa abaixo segue a **Receita de porte de seção** das Global Constraints e termina com `npm run build`, conferência lado a lado com `referencia/index.html` e commit próprio.

### Task 10: Hero e faixa de números

**Files:** Create `components/sections/Hero.tsx`, `Hero.module.css` · Modify `app/page.tsx`
**Origem:** HTML 341–363 · CSS 81–95
**Consome:** `textos.hero`, `casos`, `config.anosAtuacao`, `calcularMetricas`, `brlCompacto`, `ContadorAnimado`, `linkWhatsApp`

- [ ] **Step 1:** Portar a estrutura — banda diagonal, eyebrow, `<h1>` com `<em className="mark">`, lede e os dois botões: "Agendar reunião gratuita" (WhatsApp, mensagem `Olá! Gostaria de agendar a reunião gratuita de diagnóstico.`) e "Baixar o guia" (âncora `#guia`).

- [ ] **Step 2:** Montar a faixa de números a partir de `calcularMetricas`. **O volume usa `brlCompacto`, nunca divisão por milhão.**

```tsx
const m = calcularMetricas(casos, config.anosAtuacao)

const celulas = [
  { valor: m.anosAtuacao, sufixo: ' anos', rotulo: 'De atuação em leilões' },
  { valor: m.operacoes, rotulo: 'Operações concluídas' },
  { texto: brlCompacto(m.volumeAvaliado), rotulo: 'Em negócios acompanhados' },
  { valor: m.maiorDesconto, sufixo: '%', rotulo: 'Maior desconto já entregue' },
]
```

Células com `valor` usam `<ContadorAnimado>`; a de volume renderiza o texto pronto.

Com os casos atuais não publicados, as quatro células mostram zero — comportamento correto e pretendido.

- [ ] **Step 3:** `npm run build`, comparar com `referencia/index.html` em 1440 px e 390 px.
- [ ] **Step 4:** Commit — `feat: seção hero com faixa de números derivada dos casos`

### Task 11: Pilares — Antes, Durante, Depois

**Files:** Create `components/sections/Pilares.tsx`, `Pilares.module.css` · Modify `app/page.tsx`
**Origem:** HTML 366–396 · CSS 112–119
**Consome:** `pilares`

O código completo desta seção está nas Global Constraints, como exemplo trabalhado da receita.

- [ ] **Step 1:** Criar os dois arquivos conforme o exemplo.
- [ ] **Step 2:** Incluir em `app/page.tsx` logo após o Hero.
- [ ] **Step 3:** `npm run build` e conferência visual.
- [ ] **Step 4:** Commit — `feat: seção antes/durante/depois`

### Task 12: Esclarecimentos e Mitos

**Files:** Create `components/sections/Esclarecimentos.tsx` + `.module.css`, `components/sections/Mitos.tsx` + `.module.css`
**Origem:** HTML 399–412 e 415–454 · CSS 121–126 e 127–131
**Consome:** `textos.esclarecimentos`, `textos.mitosCabecalho`, `mitos`

- [ ] **Step 1:** Esclarecimentos — grade `.split`, manifesto em `<Reveal mask>` ("O leilão popularizou. *E foi aí que ficou perigoso.*") e os três parágrafos laterais.

- [ ] **Step 2:** Mitos — seção `sec-cream`, sete itens em grade `1fr 1.3fr`. O trecho hoje em `<b>` vira o campo `destaque`, renderizado como `<strong>` ao fim da resposta, na mesma posição de hoje. **Sem `dangerouslySetInnerHTML`:**

```tsx
<p className={s.mitoA}>{m.resposta} <strong>{m.destaque}</strong></p>
```

- [ ] **Step 3:** `npm run build`, conferir os sete itens.
- [ ] **Step 4:** Commit — `feat: seções esclarecimentos e mitos`

### Task 13: Especialidades

**Files:** Create `components/sections/Especialidades.tsx` + `.module.css`
**Origem:** HTML 457–507 · CSS 133–140
**Consome:** `textos.especialidadesCabecalho`, `especialidades`

- [ ] **Step 1:** Três cartões em `sec-cream`, cada um com número em itálico dourado, título, chamada e lista de itens separada por régua superior.
- [ ] **Step 2:** `npm run build` e conferência visual.
- [ ] **Step 3:** Commit — `feat: seção especialidades`

### Task 14: Esteira comercial

**Files:** Create `components/sections/Esteira.tsx` + `.module.css`
**Origem:** HTML 510–557 · CSS 142–154
**Consome:** `textos.esteiraCabecalho`, `esteira`, `linkWhatsApp`

- [ ] **Step 1:** Quatro passos em grade; o quarto com a classe de destaque (fundo `--navy-2`, borda superior dourada). Os botões dos passos 1 e 2 saem de `esteira[n].cta`.
- [ ] **Step 2:** A nota "Por que existe uma taxa antes do resultado", incluindo a linha final sobre valores definidos em contrato. **Manter o texto exato** — é a defesa da cobrança.
- [ ] **Step 3:** `npm run build` e conferência visual.
- [ ] **Step 4:** Commit — `feat: seção esteira comercial`

### Task 15: Processo em nove etapas

**Files:** Create `components/sections/Processo.tsx` + `.module.css`
**Origem:** HTML 560–579 · CSS 169–174
**Consome:** `textos.processoCabecalho`, `etapas`

- [ ] **Step 1:** Seção `sec-steel`, nove etapas em grade `64px 1fr 1.35fr`, colapsando para `48px 1fr` abaixo de 1080 px.
- [ ] **Step 2:** Conferir que o cabeçalho continua dizendo "Nove etapas" e há exatamente nove itens — o teste de `content.test.ts` já garante a contagem.
- [ ] **Step 3:** `npm run build` e conferência visual.
- [ ] **Step 4:** Commit — `feat: seção processo em nove etapas`

### Task 16: Oportunidades

**Files:** Create `components/sections/Oportunidades.tsx` + `.module.css`, `components/ui/MiniaturaFlutuante.tsx`
**Origem:** HTML 582–592 · CSS 176–193
**Consome:** `textos.oportunidadesCabecalho`, `mensagemImovel`, `linkWhatsApp`, `brl`, `dataBR`

Nesta tarefa a lista vem vazia. A ligação com a fonte de dados real é a Task 4 do Plano 2.

- [ ] **Step 1:** Renderizar o estado vazio (`.ops-empty`) — o bloco "Estamos analisando os editais da próxima praça" com o botão "Receber oportunidades". É o que fica no ar até o painel existir.

- [ ] **Step 2:** Escrever o componente de lista para quando houver imóveis: linha hover-reveal com barra dourada, meta em maiúsculas, preço à direita e o percentual abaixo da avaliação.

- [ ] **Step 3:** `MiniaturaFlutuante` é cliente, registra `mousemove` em `useEffect` e **remove o ouvinte no cleanup** — corrige o vazamento de `index.html:957`:

```tsx
'use client'
useEffect(() => {
  const mover = (e: MouseEvent) => {
    if (!ref.current) return
    ref.current.style.top = `${e.clientY}px`
    ref.current.style.left = `${e.clientX}px`
  }
  document.addEventListener('mousemove', mover)
  return () => document.removeEventListener('mousemove', mover)
}, [])
```

- [ ] **Step 4:** `npm run build`, conferir o estado vazio.
- [ ] **Step 5:** Commit — `feat: seção oportunidades com estado vazio e miniatura sem vazamento`

### Task 17: Casos reais e filtros

**Files:** Create `components/sections/Casos.tsx` + `.module.css`, `components/ui/FiltrosCasos.tsx`
**Origem:** HTML 595–613 · CSS 195–224
**Consome:** `textos.casosCabecalho`, `casos`, `calcularMetricas`, `descontoDe`, `lucroDe`, `investimentoReal`, `brl`
**Test:** `tests/casos-render.test.tsx`

Esta tarefa elimina o `R$ 000.000`.

- [ ] **Step 1:** Faixa de resumo (`.res-strip`) com quatro células vindas de `calcularMetricas`: operações concluídas, volume total avaliado, desconto médio, resultado nas revendas. **Valor zero exibe `—`, nunca um número falso.**

- [ ] **Step 2:** Cartões de caso. **Regra: campo sem valor não é renderizado.**

```tsx
const linhas = [
  caso.avaliacao > 0 && { rotulo: 'Avaliação', valor: brl(caso.avaliacao) },
  caso.arremate > 0 && { rotulo: 'Arrematação', valor: brl(caso.arremate) },
  caso.arremate > 0 && { rotulo: 'Investimento real', valor: brl(investimentoReal(caso)), destaque: true },
  caso.parcelas && { rotulo: 'Parcelamento', valor: `${caso.parcelas}×` },
  caso.prazoMeses && { rotulo: 'Até a posse', valor: `${caso.prazoMeses} meses` },
].filter(Boolean) as { rotulo: string; valor: string; destaque?: boolean }[]
```

O selo de desconto só aparece quando `descontoDe(caso)` não é nulo. O bloco de resultado na revenda só aparece quando `lucroDe(caso)` não é nulo.

- [ ] **Step 3:** Filtros por tipo — componente cliente com estado. Ocultar a barra quando houver menos de dois tipos publicados, como hoje.

- [ ] **Step 4:** Estado vazio: sem caso publicado, exibir `.casos-vazio`. Manter o aviso legal de `index.html:612` palavra por palavra.

- [ ] **Step 5:** Escrever o teste de regressão:

`tests/casos-render.test.tsx`
```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Casos } from '@/components/sections/Casos'

describe('seção de casos', () => {
  it('nunca imprime o placeholder de dinheiro', () => {
    const { container } = render(<Casos />)
    expect(container.textContent).not.toContain('000.000')
  })
})
```

- [ ] **Step 6:** Run: `npm run test && npm run build`. Expected: PASS e build limpo. Conferência visual.
- [ ] **Step 7:** Commit — `feat: seção de casos sem placeholder de dinheiro`

### Task 18: Depoimentos e Equipe

**Files:** Create `components/sections/Depoimentos.tsx` + `.module.css`, `components/sections/Equipe.tsx` + `.module.css`
**Origem:** HTML 616–641 e 644–671 · CSS 226–233 e 235–242
**Consome:** `textos.depoimentosCabecalho`, `depoimentos`, `textos.equipeCabecalho`, `socios`

- [ ] **Step 1:** Depoimentos — três blocos em `sec-cream` com aspas em Playfair, citação e rodapé com nome e qualificação.
- [ ] **Step 2:** Equipe — dois sócios, foto em `aspect-ratio:3/4` com o marcador "Foto do sócio" enquanto `foto` for `null`.
- [ ] **Step 3:** `npm run build` e conferência visual.
- [ ] **Step 4:** Commit — `feat: seções depoimentos e equipe`

### Task 19: Guia — formulário de captura (interface)

**Files:** Create `components/sections/Guia.tsx` + `.module.css`, `components/ui/FormularioGuia.tsx`
**Origem:** HTML 674–691 · CSS 244–252
**Consome:** `textos.guia`

Aqui apenas interface e acessibilidade. O envio real e o consentimento são as Tasks 1 e 2 do Plano 2.

- [ ] **Step 1:** Seção `sec-steel`, grade de duas colunas: texto à esquerda, formulário à direita.

- [ ] **Step 2:** **Cada campo ganha `<label>` de verdade** — corrige a barreira de leitor de tela. O rótulo fica visualmente oculto com `.sr-only` (já criada na Task 9); o texto de exemplo continua aparecendo como hoje.

```tsx
<label htmlFor="nome" className="sr-only">Nome completo</label>
<input id="nome" name="nome" type="text" placeholder="Nome completo" autoComplete="name" required />
```

Repetir para `telefone` (`type="tel"`, `autoComplete="tel"`) e `email` (`type="email"`, `autoComplete="email"`).

- [ ] **Step 3:** Mensagem de validação em `<p aria-live="polite">`, no lugar do `.cap-msg` de hoje.

- [ ] **Step 4:** `npm run build`. Conferir com o teclado que Tab percorre os três campos e o botão, e que cada rótulo é anunciado.

- [ ] **Step 5:** Commit — `feat: seção do guia com formulário acessível`

### Task 20: FAQ

**Files:** Create `components/sections/Faq.tsx` + `.module.css`
**Origem:** HTML 694–703 · CSS 254–263
**Consome:** `textos.faqCabecalho`, `faq`

Elimina os `setTimeout` de 520 ms e o corte da resposta ao girar o celular.

- [ ] **Step 1:** Componente cliente com estado `aberto: number | null`. Um item aberto por vez, como hoje.

- [ ] **Step 2:** Trocar a animação de `max-height` medida por `scrollHeight` por **grid animado**, que não desatualiza no redimensionamento:

```css
.faqA{display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s var(--ease)}
.faqItem.open .faqA{grid-template-rows:1fr}
.faqA > div{overflow:hidden}
```

- [ ] **Step 3:** Acessibilidade: botão com `aria-expanded` e `aria-controls`; a resposta com `id`, `role="region"` e `aria-labelledby` apontando para o botão — o que falta hoje.

- [ ] **Step 4:** `npm run build`. Abrir uma resposta longa, girar para paisagem e conferir que o texto **não** fica cortado.

- [ ] **Step 5:** Commit — `feat: FAQ com animação estável e região anunciada`

### Task 21: CTA, rodapé e WhatsApp flutuante

**Files:** Create `components/sections/Cta.tsx` + `.module.css`, `components/sections/Rodape.tsx` + `.module.css`, `components/ui/WhatsAppFlutuante.tsx`
**Origem:** HTML 706–712, 715–750, 754–756 · CSS 265–280
**Consome:** `textos.cta`, `textos.rodape`, `config`, `digitos`, `Monograma`, `linkWhatsApp`

- [ ] **Step 1:** CTA em `sec-steel` com banda diagonal e o botão de agendamento.

- [ ] **Step 2:** Rodapé em quatro colunas: marca com `<Monograma />`, mapa do site, contato e escritório.

**Corrigir o telefone.** Hoje `index.html:853` exibe `config.telefone` mas disca `config.whatsapp`:

```tsx
<a href={`tel:${digitos(config.telefone)}`}>{config.telefone}</a>
```

- [ ] **Step 3:** O "Política de privacidade" hoje é um `<span>` sem destino. Trocar por `<Link href="/privacidade">`. A página é a Task 3 do Plano 2 — até lá o link leva a 404, e a Task 3 fecha isso antes de qualquer publicação.

- [ ] **Step 4:** Ano do rodapé no servidor: `{new Date().getFullYear()}`.

- [ ] **Step 5:** Manter o aviso legal de `index.html:749` **palavra por palavra**.

- [ ] **Step 6:** Botão flutuante de WhatsApp com `aria-label`, como hoje.

- [ ] **Step 7:** `npm run build` e conferência visual.

- [ ] **Step 8:** Commit — `feat: CTA, rodapé com telefone corrigido e botão flutuante`

---

## Task 22: Conferência visual e fechamento

**Files:**
- Modify: `app/page.tsx` (ordem final)
- Create: `docs/CONFERENCIA.md`, `docs/PENDENCIAS.md`

- [ ] **Step 1: Conferir a ordem das 15 seções**

`app/page.tsx` deve conter, nesta ordem: `Hero`, `Pilares`, `Esclarecimentos`, `Mitos`, `Especialidades`, `Esteira`, `Processo`, `Oportunidades`, `Casos`, `Depoimentos`, `Equipe`, `Guia`, `Faq`, `Cta`, `Rodape`.

- [ ] **Step 2: Comparação lado a lado**

Abrir `referencia/index.html` e a versão nova em duas janelas, nas larguras 1440, 1080, 760 e 390. Percorrer as 15 seções.

Registrar em `docs/CONFERENCIA.md` uma linha por seção: nome, larguras conferidas e "idêntico" ou a diferença encontrada. Qualquer diferença que não esteja na tabela do Step 3 é defeito e volta para a tarefa de origem.

- [ ] **Step 3: Conferir o que mudou de propósito**

Estas diferenças em relação ao modelo aprovado são intencionais e autorizadas:

| Onde | Mudança |
|---|---|
| Cabeçalho e rodapé | Monograma MT passa a aparecer ao lado do nome |
| Faixa do topo | Volume mostra o valor real, não arredondado ao milhão |
| Casos | Campo sem valor não é renderizado; some o `R$ 000.000` |
| Casos | Nenhum caso de exemplo entra na contagem |
| Rodapé | Telefone disca o telefone; privacidade vira link |
| Formulário | Campos ganham rótulo |
| FAQ | Resposta anunciada como região; animação estável |
| Rolagem | Lenis no lugar do wrapper fixo |

- [ ] **Step 4: Registrar as pendências**

Criar `docs/PENDENCIAS.md` com as três listas do relatório: o que bloqueia o lançamento (WhatsApp e telefone reais, endereço do coworking, números de casos reais, domínio), as definições comerciais (fórmula do percentual, valor da taxa, formato da reunião, praças, destino dos leads) e as importantes não bloqueantes (PDF do guia, fotos, depoimentos com autorização, INPI).

- [ ] **Step 5: Rodar tudo**

Run: `npm run test`
Expected: PASS em todos os testes.

Run: `npm run build`
Expected: build conclui.

Run: `npx next lint`
Expected: sem erro.

- [ ] **Step 6: Publicar a prévia e conferir no celular**

```bash
npx vercel
```

Abrir a URL num telefone real. Conferir rolagem, abertura do FAQ e o formulário.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs: conferência visual das 15 seções e lista de pendências"
```

---

## Self-Review

**Cobertura do desenho aprovado:**

| Requisito | Tarefa |
|---|---|
| Todo texto em `content/` | 7 |
| Identidade transportada, não reescrita | 2, 10–21, 22 |
| Monograma vetorizado | 3 |
| Fonte hospedada localmente | 2 |
| Cartão de compartilhamento com a marca | 3 |
| Encaixe do painel de imóveis | 16 (interface) + Plano 2 Task 4 (dados) |
| Corrige `R$ 000.000` | 5, 17 |
| Corrige arredondamento do volume | 5, 6, 10 |
| Casos de exemplo fora da contagem | 4, 6, 7 |
| Corrige telefone do rodapé | 21 |
| Placeholder derruba o build | 4, 9 |
| Substitui a rolagem customizada | 8 |
| Remove vazamento de `mousemove` | 16 |
| Corrige FAQ no redimensionamento | 20 |
| Rótulos no formulário e atalho de conteúdo | 9, 19 |
| Remove CSS morto e duplicata | Global Constraints, aplicadas em 2 e 17 |
| Git desde o início | 1 |

**Coberto pelo Plano 2, fora deste:** captura de lead, consentimento e página de privacidade, fonte de dados dos imóveis e bloqueio de `/admin`, cabeçalhos de segurança e CSP, SEO e dados estruturados, contraste de texto, teste das três regras de marca, README e checklist de lançamento.

**Consistência de tipos conferida:** `Caso`, `Imovel` e `Lead` definidos na Task 4 e consumidos com o mesmo nome nas Tasks 6, 7, 8, 16 e 17. `calcularMetricas(casos, anosAtuacao)` definida na Task 6 e chamada com a mesma assinatura nas Tasks 10 e 17. `brlCompacto` definida na Task 5 e usada na Task 10. `digitos` definida na Task 5 e usada na Task 21. `linkWhatsApp` e `mensagemImovel` definidas na Task 8 e usadas nas Tasks 9, 10, 14, 16 e 21. `Reveal`, `SmoothScroll` e `ContadorAnimado` definidos na Task 8 e usados de 9 a 21. `Monograma` definido na Task 3 e usado nas Tasks 9 e 21. `.sr-only` criada na Task 9 e usada na Task 19.

# MT Capital — Plano 2: Funcionalidade, Segurança e Conformidade

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer o site capturar lead de verdade, ficar em conformidade com a LGPD, servir imóveis por uma fonte trocável, e fechar as barreiras de segurança, busca e acessibilidade.

**Architecture:** Route Handlers do App Router para lead e imóveis, com validação zod em toda fronteira. `middleware.ts` injeta os cabeçalhos de segurança e bloqueia a área administrativa até haver autenticação. As três regras de marca viram teste automatizado.

**Tech Stack:** Next.js 15 (App Router), TypeScript, zod, Vitest, Vercel.

**Pré-requisito:** o Plano 1 concluído até a Task 22.

---

## Global Constraints

Valem todas as Global Constraints do Plano 1 — fidelidade visual, tokens exatos, as três regras travadas e as convenções de código. Acrescentam-se:

### Fronteiras

- **Todo dado que entra é validado com zod antes de qualquer uso.** Sem exceção: corpo de requisição, resposta de API externa, arquivo de dados lido do disco.
- **Nenhum dado pessoal em log.** Nem em `console.log`, nem em mensagem de erro devolvida ao cliente. Ao registrar falha de lead, registrar o motivo e o campo, nunca o valor.
- **Segredo nenhum no repositório.** Chaves vivem em variável de ambiente, documentadas em `.env.example` com valor de exemplo, nunca real.

### Comportamento de erro

- Falha de validação devolve `400` com a lista de campos inválidos, em português, sem devolver o que foi enviado.
- Falha interna devolve `500` com mensagem genérica. O detalhe fica no log do servidor, sem dado pessoal.
- **Nada de falha silenciosa.** Se a notificação do lead não sair, isso é registrado e a resposta diz ao visitante o que fazer.

### Variáveis de ambiente

| Nome | Uso | Obrigatória |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Endereço canônico, sitemap, dados estruturados | sim |
| `RESEND_API_KEY` | Envio do aviso de lead por e-mail | se `LEAD_EMAIL_DESTINO` existir |
| `LEAD_EMAIL_DESTINO` | Caixa que recebe o aviso de lead | uma das duas |
| `LEAD_WEBHOOK_URL` | Encaixe para planilha, CRM ou automação | uma das duas |

Pelo menos um destino de lead precisa estar configurado — mesmo princípio da guarda de configuração do Plano 1: não se publica um formulário que descarta contato.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `app/api/lead/route.ts` | Recebe, valida, limita e encaminha o lead |
| `lib/lead-destinos.ts` | Envio por e-mail e por webhook, com falha explícita |
| `lib/rate-limit.ts` | Limite de envios por IP |
| `app/privacidade/page.tsx` | Política de privacidade |
| `lib/imoveis.ts` | Fonte de imóveis trocável — arquivo hoje, banco depois |
| `content/imoveis.ts` | Lista de imóveis enquanto não houver painel |
| `app/api/imoveis/route.ts` | Expõe a lista no contrato que o painel vai usar |
| `middleware.ts` | Cabeçalhos de segurança, CSP com nonce, bloqueio de `/admin` |
| `app/sitemap.ts` `app/robots.ts` | Mapa do site e instruções para robôs |
| `components/seo/DadosEstruturados.tsx` | JSON-LD de empresa e de perguntas frequentes |
| `tests/regras-de-marca.test.ts` | As três regras travadas, automatizadas |
| `README.md` `CONTRIBUTING.md` `.env.example` | Entrada para dev novo |

---

## Task 1: Recebimento de lead

**Files:**
- Create: `lib/rate-limit.ts`, `lib/lead-destinos.ts`, `app/api/lead/route.ts`
- Test: `tests/lead-api.test.ts`

**Interfaces:**
- Consumes: `LeadSchema`, `Lead` de `lib/schemas.ts` (Plano 1, Task 4).
- Produces:
```ts
export function permitir(chave: string, limite?: number, janelaMs?: number): boolean
export function registrarLead(lead: Lead): Promise<{ ok: boolean; destinos: string[]; erros: string[] }>
```

Corrige o defeito crítico do formulário que descarta o contato.

- [ ] **Step 1: Escrever o teste que falha**

`tests/lead-api.test.ts`:
```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { permitir } from '@/lib/rate-limit'

describe('permitir', () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date('2026-07-29T13:00:00Z')) })

  it('libera os primeiros envios e barra o excedente', () => {
    const ip = '203.0.113.10'
    expect(permitir(ip, 3, 60_000)).toBe(true)
    expect(permitir(ip, 3, 60_000)).toBe(true)
    expect(permitir(ip, 3, 60_000)).toBe(true)
    expect(permitir(ip, 3, 60_000)).toBe(false)
  })

  it('libera de novo depois que a janela passa', () => {
    const ip = '203.0.113.11'
    expect(permitir(ip, 1, 60_000)).toBe(true)
    expect(permitir(ip, 1, 60_000)).toBe(false)
    vi.advanceTimersByTime(61_000)
    expect(permitir(ip, 1, 60_000)).toBe(true)
  })

  it('conta cada IP separadamente', () => {
    expect(permitir('203.0.113.20', 1, 60_000)).toBe(true)
    expect(permitir('203.0.113.21', 1, 60_000)).toBe(true)
  })
})
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `npm run test -- tests/lead-api.test.ts`
Expected: FAIL — "Cannot find module '@/lib/rate-limit'".

- [ ] **Step 3: Implementar o limite**

`lib/rate-limit.ts`:
```ts
type Registro = { contagem: number; expiraEm: number }

const memoria = new Map<string, Registro>()

export function permitir(chave: string, limite = 5, janelaMs = 60_000): boolean {
  const agora = Date.now()
  const atual = memoria.get(chave)

  if (!atual || agora > atual.expiraEm) {
    memoria.set(chave, { contagem: 1, expiraEm: agora + janelaMs })
    return true
  }
  if (atual.contagem >= limite) return false

  atual.contagem += 1
  return true
}
```

**Limitação conhecida e aceita:** a contagem vive na memória da instância. Em ambiente sem servidor, instâncias diferentes contam separado. É proteção contra envio repetido e robô simples, não contra ataque distribuído. Trocar por armazenamento compartilhado quando o volume justificar.

- [ ] **Step 4: Implementar os destinos do lead**

`lib/lead-destinos.ts`:
```ts
import type { Lead } from '@/lib/schemas'

type Resultado = { ok: boolean; destinos: string[]; erros: string[] }

function corpoTexto(lead: Lead, quando: string): string {
  return [
    'Novo pedido do guia pelo site.',
    '',
    `Nome: ${lead.nome}`,
    `Telefone: ${lead.telefone}`,
    lead.email ? `E-mail: ${lead.email}` : 'E-mail: não informado',
    `Origem: ${lead.origem}`,
    `Recebido em: ${quando}`,
  ].join('\n')
}

async function porEmail(lead: Lead, quando: string): Promise<void> {
  const chave = process.env.RESEND_API_KEY
  const destino = process.env.LEAD_EMAIL_DESTINO
  if (!chave || !destino) throw new Error('E-mail não configurado')

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Site MT Capital <site@mtcapital.com.br>',
      to: [destino],
      subject: `Novo lead do guia — ${lead.nome}`,
      text: corpoTexto(lead, quando),
    }),
  })
  if (!r.ok) throw new Error(`Resend respondeu ${r.status}`)
}

async function porWebhook(lead: Lead, quando: string): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL
  if (!url) throw new Error('Webhook não configurado')

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lead, armadilha: undefined, recebidoEm: quando }),
  })
  if (!r.ok) throw new Error(`Webhook respondeu ${r.status}`)
}

export async function registrarLead(lead: Lead): Promise<Resultado> {
  const quando = new Date().toISOString()
  const destinos: string[] = []
  const erros: string[] = []

  const tentativas: [string, Promise<void>][] = []
  if (process.env.LEAD_EMAIL_DESTINO) tentativas.push(['email', porEmail(lead, quando)])
  if (process.env.LEAD_WEBHOOK_URL) tentativas.push(['webhook', porWebhook(lead, quando)])

  for (const [nome, promessa] of tentativas) {
    try { await promessa; destinos.push(nome) }
    catch (e) { erros.push(`${nome}: ${(e as Error).message}`) }
  }

  return { ok: destinos.length > 0, destinos, erros }
}
```

Nenhuma mensagem de erro carrega dado do visitante — só o nome do destino e o código de resposta.

- [ ] **Step 5: Implementar a rota**

`app/api/lead/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { LeadSchema } from '@/lib/schemas'
import { permitir } from '@/lib/rate-limit'
import { registrarLead } from '@/lib/lead-destinos'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'desconhecido'

  if (!permitir(ip)) {
    return NextResponse.json(
      { erro: 'Muitos envios seguidos. Tente de novo em um minuto.' },
      { status: 429 },
    )
  }

  let bruto: unknown
  try { bruto = await req.json() }
  catch { return NextResponse.json({ erro: 'Envio inválido.' }, { status: 400 }) }

  const analise = LeadSchema.safeParse(bruto)
  if (!analise.success) {
    const campos = analise.error.issues.map((i) => ({
      campo: String(i.path[0] ?? ''),
      mensagem: i.message,
    }))
    return NextResponse.json({ erro: 'Confira os campos.', campos }, { status: 400 })
  }

  // Campo-armadilha preenchido: robô. Responde como sucesso e descarta.
  if (analise.data.armadilha) return NextResponse.json({ ok: true })

  const resultado = await registrarLead(analise.data)

  if (!resultado.ok) {
    console.error('[lead] nenhum destino aceitou:', resultado.erros.join(' | '))
    return NextResponse.json(
      { erro: 'Não conseguimos registrar seu contato agora. Fale com a gente no WhatsApp que enviamos o guia na hora.' },
      { status: 500 },
    )
  }

  if (resultado.erros.length) console.warn('[lead] destino falhou:', resultado.erros.join(' | '))

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 6: Rodar e confirmar aprovação**

Run: `npm run test -- tests/lead-api.test.ts`
Expected: PASS, 3 testes.

- [ ] **Step 7: Exercitar a rota**

Run: `npm run dev` e, em outro terminal:
```bash
curl -s -X POST http://localhost:3000/api/lead -H 'Content-Type: application/json' \
  -d '{"nome":"Teste Silva","telefone":"11999990000","email":"","consentimento":true,"origem":"guia"}'
```
Expected sem destino configurado: `500` com a mensagem orientando o WhatsApp — falha explícita, como projetado.

```bash
curl -s -X POST http://localhost:3000/api/lead -H 'Content-Type: application/json' \
  -d '{"nome":"T","telefone":"1","consentimento":false}'
```
Expected: `400` com a lista de campos, sem devolver o que foi enviado.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: recebimento de lead com validação, limite e destino explícito"
```

---

## Task 2: Consentimento e envio no formulário

**Files:**
- Modify: `components/ui/FormularioGuia.tsx` (Plano 1, Task 19), `components/sections/Guia.module.css`, `content/textos.ts`

**Interfaces:**
- Consumes: `POST /api/lead`, `linkWhatsApp` (Plano 1, Task 8).

- [ ] **Step 1: Acrescentar o campo-armadilha**

Invisível a quem enxerga, preenchido por robô:
```tsx
<div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
  <label htmlFor="armadilha">Não preencha este campo</label>
  <input id="armadilha" name="armadilha" type="text" tabIndex={-1} autoComplete="off" />
</div>
```

- [ ] **Step 2: Acrescentar a caixa de consentimento**

Não pré-marcada. O texto nomeia o que é coletado e para quê — é a base legal da coleta.

```tsx
<label className={s.consentimento}>
  <input type="checkbox" name="consentimento" required />
  <span>
    Autorizo a MT Capital a usar meu nome, telefone e e-mail para enviar o guia e
    entrar em contato sobre assessoria em leilão. Posso pedir a exclusão quando quiser.
    Veja a <Link href="/privacidade">política de privacidade</Link>.
  </span>
</label>
```

Estilo em `Guia.module.css`, nos tokens do site: caixa em `--gold`, texto no tamanho do `.cap-note` (11 px, `line-height:1.7`, cor `rgba(245,241,234,.56)` — já no valor corrigido da Task 7).

- [ ] **Step 3: Registrar primeiro, abrir o WhatsApp depois**

A ordem importa: assim o contato existe mesmo se a pessoa não enviar a mensagem.

```tsx
async function enviar(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  setEstado('enviando')
  setMensagem('Registrando seu contato…')

  const dados = Object.fromEntries(new FormData(e.currentTarget))
  const corpo = { ...dados, consentimento: dados.consentimento === 'on', origem: 'guia' }

  try {
    const r = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    })
    const json = await r.json()

    if (!r.ok) { setEstado('erro'); setMensagem(json.erro ?? 'Não foi possível enviar.'); return }

    setEstado('ok')
    setMensagem('Pronto. Abrindo o WhatsApp para enviarmos o guia.')
    window.open(linkWhatsApp(mensagemGuia(String(dados.nome))), '_blank', 'noopener,noreferrer')
  } catch {
    setEstado('erro')
    setMensagem('Falha de conexão. Fale com a gente no WhatsApp que enviamos o guia.')
  }
}

function mensagemGuia(nome: string): string {
  return `Olá! Sou ${nome} e acabei de pedir o guia gratuito sobre leilão de imóveis pelo site.`
}
```

- [ ] **Step 4: Ajustar o texto de apoio**

Em `content/textos.ts`, o `guia.nota` hoje diz que o WhatsApp abre com os dados preenchidos. Atualizar para o que passa a acontecer, mantendo a promessa de não mandar mensagem não pedida:

> "Ao enviar, registramos seu contato e abrimos o WhatsApp para mandar o PDF. Não mandamos mensagem que você não pediu."

- [ ] **Step 5: Verificar**

Run: `npm run dev`. Preencher e enviar sem marcar a caixa.
Expected: o navegador barra pelo `required`. Forçando por API, a rota devolve `400` com "É preciso aceitar o uso dos dados para receber o material."

Marcar a caixa e enviar. Expected: mensagem de registro, depois abertura do WhatsApp.

Conferir que a mensagem de estado é anunciada pelo `aria-live="polite"` da Task 19 do Plano 1.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: consentimento LGPD e registro do lead antes do WhatsApp"
```

---

## Task 3: Página de privacidade

**Files:**
- Create: `app/privacidade/page.tsx`, `app/privacidade/privacidade.module.css`, `content/privacidade.ts`

**Interfaces:**
- Consumes: `config`.

Fecha o defeito crítico do rodapé, que anuncia uma política inexistente.

- [ ] **Step 1: Escrever o conteúdo**

`content/privacidade.ts`, com as seções exigidas pela LGPD, na voz do site — frase curta, sem jargão desnecessário:

1. **Quem é o responsável** — MT Capital, com o e-mail de `config.email`.
2. **O que a gente coleta** — nome, telefone e e-mail, só quando você preenche o formulário do guia. Mais os dados de navegação que qualquer site registra.
3. **Para que serve** — enviar o material pedido e retomar o contato sobre assessoria em leilão. Nada além disso.
4. **Com quem compartilhamos** — com o serviço de e-mail que entrega a mensagem, e com mais ninguém. Não vendemos nem cedemos lista.
5. **Por quanto tempo guardamos** — enquanto houver relação comercial ou até você pedir a exclusão.
6. **Seus direitos** — confirmar, acessar, corrigir, apagar e revogar o consentimento, conforme o artigo 18 da Lei 13.709/2018. Como pedir: pelo e-mail ou pelo WhatsApp.
7. **Cookies** — quais existem e para quê. Enquanto não houver ferramenta de medição instalada, dizer isso com todas as letras.
8. **Data da última atualização.**

- [ ] **Step 2: Montar a página**

Usar as classes globais do site (`.section`, `.h2`, `.lede`, `.eyebrow`) para a página nascer na identidade aprovada, sem CSS novo além da medida de leitura (`max-width:68ch`).

```tsx
export const metadata = {
  title: 'Política de privacidade',
  description: 'Como a MT Capital coleta, usa e protege os dados de quem entra em contato pelo site.',
  robots: { index: true, follow: true },
}
```

- [ ] **Step 3: Verificar o link do rodapé**

O rodapé (Plano 1, Task 21) já aponta para `/privacidade`.

Run: `npm run dev`, clicar no link do rodapé.
Expected: a página abre. **Nenhum 404 permanece no site.**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: política de privacidade e fechamento do link do rodapé"
```

---

## Task 4: Fonte de imóveis e reserva da área administrativa

**Files:**
- Create: `content/imoveis.ts`, `lib/imoveis.ts`, `app/api/imoveis/route.ts`
- Modify: `components/sections/Oportunidades.tsx`
- Test: `tests/imoveis.test.ts`

**Interfaces:**
- Consumes: `ImovelSchema`, `Imovel` (Plano 1, Task 4).
- Produces:
```ts
export async function listarImoveis(): Promise<Imovel[]>
export async function listarImoveisAbertos(): Promise<Imovel[]>
```

Este é o encaixe do painel futuro. Quando ele nascer, muda **o corpo de uma função** — nenhuma seção é tocada.

- [ ] **Step 1: Escrever o teste que falha**

`tests/imoveis.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/content/imoveis', () => ({
  imoveisBrutos: [
    {
      id: 'lote-001', tipo: 'Terreno', titulo: 'Terreno 1.240 m² — Praia Grande',
      cidade: 'Angra dos Reis', uf: 'RJ', bairro: 'Praia Grande',
      area: 1240, quartos: null, vagas: null,
      valorAvaliacao: 1000000,
      lance1: { valor: 1000000, data: '2026-08-14' },
      lance2: { valor: 250000, data: '2026-08-21' },
      imagem: null, status: 'aberto',
    },
    {
      id: 'lote-002', tipo: 'Casa', titulo: 'Casa encerrada',
      cidade: 'Niterói', uf: 'RJ', bairro: null,
      area: null, quartos: 3, vagas: 1,
      valorAvaliacao: 800000, lance1: null, lance2: null,
      imagem: null, status: 'encerrado',
    },
  ],
}))

const { listarImoveis, listarImoveisAbertos } = await import('@/lib/imoveis')

describe('listarImoveis', () => {
  it('devolve os imóveis validados', async () => {
    expect(await listarImoveis()).toHaveLength(2)
  })
  it('esconde os encerrados na lista pública', async () => {
    const abertos = await listarImoveisAbertos()
    expect(abertos).toHaveLength(1)
    expect(abertos[0].id).toBe('lote-001')
  })
})
```

- [ ] **Step 2: Rodar e confirmar a falha**

Run: `npm run test -- tests/imoveis.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Criar a lista de conteúdo**

`content/imoveis.ts`:
```ts
// Enquanto o painel administrativo não existir, os imóveis vivem aqui.
// Quando ele nascer, esta lista deixa de ser lida — muda só lib/imoveis.ts.
export const imoveisBrutos: unknown[] = []
```

- [ ] **Step 4: Implementar a fonte trocável**

`lib/imoveis.ts`:
```ts
import { ImovelSchema, type Imovel } from '@/lib/schemas'
import { imoveisBrutos } from '@/content/imoveis'

/**
 * Ponto único de leitura de imóveis.
 *
 * Hoje: lê a lista versionada em content/imoveis.ts.
 * Quando o painel administrativo existir: trocar o corpo desta função pela
 * consulta ao banco. A validação com ImovelSchema permanece — é ela que
 * garante que nada malformado chegue à página.
 */
export async function listarImoveis(): Promise<Imovel[]> {
  const analise = ImovelSchema.array().safeParse(imoveisBrutos)

  if (!analise.success) {
    const campos = analise.error.issues.map((i) => i.path.join('.')).join(', ')
    console.error('[imoveis] registro inválido descartado. Campos:', campos)
    return []
  }
  return analise.data
}

export async function listarImoveisAbertos(): Promise<Imovel[]> {
  const todos = await listarImoveis()
  return todos.filter((i) => i.status !== 'encerrado')
}
```

- [ ] **Step 5: Expor a API no contrato do painel**

`app/api/imoveis/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { listarImoveisAbertos } from '@/lib/imoveis'

export async function GET() {
  const imoveis = await listarImoveisAbertos()
  return NextResponse.json(imoveis, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
```

Métodos de escrita não existem. Quando o painel chegar, eles nascem **atrás de autenticação**, nunca antes.

- [ ] **Step 6: Ligar a seção Oportunidades**

`Oportunidades` passa a ser Server Component assíncrono:
```tsx
import { listarImoveisAbertos } from '@/lib/imoveis'

export async function Oportunidades() {
  const imoveis = await listarImoveisAbertos()
  // lista vazia → o bloco .ops-empty da Task 16 do Plano 1
}
```

Com `imoveisBrutos` vazio, a seção segue mostrando o estado vazio — sem mudança visível, mas agora ligada à fonte real.

**Aqui morre a injeção de código:** título, resumo e URL de imagem passam pelo React, que escapa por padrão. Nenhum `innerHTML` em lugar nenhum.

- [ ] **Step 7: Rodar e confirmar aprovação**

Run: `npm run test -- tests/imoveis.test.ts`
Expected: PASS, 2 testes.

Run: `npm run dev` e `curl -s http://localhost:3000/api/imoveis`
Expected: `[]`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: fonte de imóveis trocável e API no contrato do painel futuro"
```

---

## Task 5: Cabeçalhos de segurança, CSP e bloqueio de `/admin`

**Files:**
- Create: `middleware.ts`
- Modify: `next.config.ts`, `app/layout.tsx`, `.eslintrc.json`

**Interfaces:**
- Produces: todas as respostas com o conjunto de cabeçalhos; `/admin/*` respondendo 404.

- [ ] **Step 1: Escrever o middleware**

`middleware.ts`:
```ts
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // A área administrativa ainda não existe. Responder 404 em vez de 403
  // para não anunciar que há algo ali.
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 })
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ')

  const cabecalhos = new Headers(req.headers)
  cabecalhos.set('x-nonce', nonce)

  const res = NextResponse.next({ request: { headers: cabecalhos } })
  res.headers.set('Content-Security-Policy', csp)
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

`style-src 'unsafe-inline'` é necessário porque o Next injeta estilo em linha para os CSS Modules. As demais diretivas ficam fechadas. `img-src https:` fica aberto para as fotos dos imóveis, que virão de origem externa quando o painel existir.

- [ ] **Step 2: Cabeçalhos fixos em `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const cabecalhos = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
]

const config: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: cabecalhos }]
  },
}

export default config
```

- [ ] **Step 3: Aplicar o nonce no layout**

```tsx
import { headers } from 'next/headers'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined
  // repassar `nonce` ao <DadosEstruturados> da Task 6 e a qualquer <Script> futuro
}
```

- [ ] **Step 4: Proibir `dangerouslySetInnerHTML` por lint**

`.eslintrc.json`:
```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "react/no-danger": "error"
  }
}
```

Torna mecânica a regra que hoje depende de disciplina. **Exceção única e explícita:** o JSON-LD da Task 6, que precisa injetar `<script type="application/ld+json">`. Ele leva desativação na linha, com justificativa, e o conteúdo vem de `JSON.stringify` de objeto montado no servidor a partir de `content/`, nunca de entrada de usuário.

- [ ] **Step 5: Verificar os cabeçalhos**

Run: `npm run build && npm run start`, e em outro terminal:
```bash
curl -sI http://localhost:3000 | grep -iE 'content-security|strict-transport|x-content-type|referrer|permissions|x-frame'
```
Expected: os seis cabeçalhos presentes.

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/admin
```
Expected: `404`.

- [ ] **Step 6: Conferir que o site continua funcionando sob CSP**

Abrir a página no navegador e olhar o console.
Expected: **nenhuma** violação de CSP. Rolagem, FAQ, filtros de caso e formulário funcionando.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: CSP com nonce, cabeçalhos de segurança e bloqueio da área administrativa"
```

---

## Task 6: Busca, redes sociais e dados estruturados

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/sitemap.ts`, `app/robots.ts`, `components/seo/DadosEstruturados.tsx`

**Interfaces:**
- Consumes: `config`, `faq`, `NEXT_PUBLIC_SITE_URL`.

- [ ] **Step 1: Metadata completa no layout**

```tsx
import type { Metadata } from 'next'

const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mtcapital.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: 'MT Capital — Assessoria em Leilão de Imóveis e Terrenos',
    template: '%s — MT Capital',
  },
  description:
    'Assessoria em leilão de imóveis e terrenos. Lemos o processo, calculamos o custo real da operação e dizemos até quanto vale a pena pagar. Do edital ao registro da matrícula.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'MT Capital',
    title: 'MT Capital — Comprar bem começa antes do lance',
    description:
      'Comprar bem começa antes do lance. Analisamos o processo, calculamos o custo real e conduzimos tudo, do pregão ao registro.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}
```

O `opengraph-image.tsx` da Task 3 do Plano 1 é encontrado automaticamente — corrige o link sem imagem no WhatsApp.

- [ ] **Step 2: Mapa do site e robôs**

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mtcapital.com.br'
  return [
    { url: site, changeFrequency: 'weekly', priority: 1 },
    { url: `${site}/privacidade`, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
```

`app/robots.ts`:
```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mtcapital.com.br'
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${site}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Dados estruturados**

As 11 perguntas do FAQ podem aparecer direto no resultado do Google.

`components/seo/DadosEstruturados.tsx`:
```tsx
import { faq } from '@/content/faq'
import { config } from '@/content/config'

export function DadosEstruturados({ nonce }: { nonce?: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mtcapital.com.br'

  const dados = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'MT Capital',
      description: 'Assessoria em arrematação de imóveis e terrenos em leilão judicial e extrajudicial.',
      url: site,
      email: config.email,
      telephone: config.telefone,
      areaServed: 'BR',
      address: {
        '@type': 'PostalAddress',
        streetAddress: config.endereco.linha1,
        addressLocality: config.endereco.cidade,
        addressRegion: config.endereco.uf,
        postalCode: config.endereco.cep,
        addressCountry: 'BR',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((p) => ({
        '@type': 'Question',
        name: p.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: p.resposta },
      })),
    },
  ]

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // eslint-disable-next-line react/no-danger -- JSON-LD montado no servidor a partir de content/, sem entrada de usuário
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  )
}
```

- [ ] **Step 4: Verificar**

Run: `npm run build && npm run start`

```bash
curl -s http://localhost:3000/sitemap.xml | head -20
curl -s http://localhost:3000/robots.txt
```
Expected: XML válido com as duas URLs; robots liberando a raiz e bloqueando `/admin` e `/api`.

Colar o HTML da home no validador de resultados enriquecidos do Google. Expected: `ProfessionalService` e `FAQPage` reconhecidos, sem erro.

Colar a URL da Vercel numa conversa de teste do WhatsApp. Expected: cartão com a imagem da marca.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: metadata canônica, sitemap, robots e dados estruturados"
```

---

## Task 7: Contraste e fechamento de acessibilidade

**Files:**
- Modify: `styles/base.css` e os módulos das seções afetadas

**Atenção:** este é o único ponto do projeto que altera visualmente o modelo aprovado. Os valores abaixo foram medidos. **Confirmar com a empresa antes de aplicar.**

- [ ] **Step 1: Conhecer o que está fora**

Sete trechos usam `rgba(245,241,234,.42)` ou `.45` sobre `--navy #192332`. Medido:

| Opacidade | Contraste | WCAG AA (4,5:1) |
|---|---|---|
| `.42` | 3,6:1 | reprova |
| `.45` | 4,0:1 | reprova |
| `.52` | 4,8:1 | aprova |
| `.56` | 5,4:1 | aprova com folga |

Ocorrências em `referencia/index.html`: linha 93 (`.scroll-cue`), 185 (`.op-meta`), 205 (`.caso-nums span`), 221 (`.caso-lucro span`), 240 (`.socio-foto span`), 252 (`.cap-note`), 277 (`.disclaimer`, em `.3` — mais baixo ainda).

- [ ] **Step 2: Aplicar `.56` nas sete ocorrências**

Trocar `.42` e `.45` por `.56` nos módulos correspondentes. O `.disclaimer` em `.3` sobe para `.5` — texto legal precisa ser legível, e 10,5 px em `.3` não é.

- [ ] **Step 3: Conferir que a hierarquia visual se manteve**

Abrir lado a lado com `referencia/index.html`. O texto secundário continua secundário, só que legível. Se a diferença incomodar a empresa, o mínimo aceitável é `.52`.

- [ ] **Step 4: Percorrer o site inteiro pelo teclado**

Tab do topo ao rodapé. Expected: o atalho de conteúdo aparece primeiro; todo elemento focável tem contorno visível (`--gold-lt`, já em `:focus-visible`); a ordem segue a leitura; o FAQ abre com Enter e Espaço; o formulário é preenchível sem mouse.

- [ ] **Step 5: Rodar auditoria automática**

Lighthouse na aba Acessibilidade, em desktop e celular.
Expected: nota 100, ou toda falha restante registrada em `docs/CONFERENCIA.md` com justificativa.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: contraste de texto secundário acima de 4,5:1"
```

---

## Task 8: As três regras de marca, automatizadas

**Files:**
- Test: `tests/regras-de-marca.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: todo o conteúdo de `content/`, `calcularMetricas` (Plano 1, Task 6).

Aqui as regras deixam de depender de alguém lembrar.

- [ ] **Step 1: Escrever o teste**

`tests/regras-de-marca.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { casos } from '@/content/casos'
import { calcularMetricas } from '@/lib/metricas'

const PASTA = join(process.cwd(), 'content')

const PROIBIDAS = [
  /sem\s+riscos?\b/i,
  /\bgarantid[oa]s?\b/i,
  /garantia\s+de\s+(retorno|rentabilidade|lucro)/i,
  /\brentabilidade\b/i,
  /lucro\s+cert[oa]/i,
  /retorno\s+cert[oa]/i,
]

// Trechos onde a palavra aparece dentro de uma NEGAÇÃO — o oposto de uma promessa.
// Cada exceção é literal e justificada. Nunca afrouxar a regra inteira.
const EXCECOES = [
  'não constituem garantia de rentabilidade',
  'não representa garantia de resultado futuro',
]

function semExcecoes(texto: string): string {
  return EXCECOES.reduce((t, e) => t.split(e).join(''), texto)
}

describe('Regra 1 — nunca prometer resultado', () => {
  it('nenhum texto de content/ contém promessa proibida', () => {
    const achados: string[] = []

    for (const arquivo of readdirSync(PASTA).filter((f) => f.endsWith('.ts'))) {
      const texto = semExcecoes(readFileSync(join(PASTA, arquivo), 'utf8'))
      for (const regra of PROIBIDAS) {
        const m = texto.match(regra)
        if (m) achados.push(`${arquivo}: "${m[0]}"`)
      }
    }

    expect(achados, `Promessa proibida encontrada:\n${achados.join('\n')}`).toEqual([])
  })
})

describe('Regra 2 — sempre a conta completa', () => {
  it('todo caso publicado tem avaliação, arremate e custos definidos', () => {
    for (const c of casos.filter((x) => x.publicado)) {
      expect(c.avaliacao, `caso ${c.id}`).toBeGreaterThan(0)
      expect(c.arremate, `caso ${c.id}`).toBeGreaterThan(0)
      expect(typeof c.custos, `caso ${c.id}`).toBe('number')
    }
  })
})

describe('Regra 3 — nenhum número inventado', () => {
  it('a faixa do topo deriva dos casos, não de literal no componente', () => {
    const fonte = readFileSync(join(process.cwd(), 'components/sections/Hero.tsx'), 'utf8')
    expect(fonte).toContain('calcularMetricas')
    expect(fonte).not.toMatch(/\b\d{3,}\b/)
  })

  it('sem caso publicado, todo agregado é zero', () => {
    const m = calcularMetricas([], 10)
    expect(m.operacoes).toBe(0)
    expect(m.volumeAvaliado).toBe(0)
    expect(m.maiorDesconto).toBe(0)
    expect(m.descontoMedio).toBe(0)
    expect(m.resultadoRevendas).toBe(0)
  })
})
```

> A exceção da Regra 1 é necessária porque o aviso legal do rodapé (`referencia/index.html:749`) contém "não constituem garantia de rentabilidade" — uma negação, que é o oposto de uma promessa. Se esse texto migrar para `content/textos.ts`, a exceção o cobre.

- [ ] **Step 2: Rodar**

Run: `npm run test -- tests/regras-de-marca.test.ts`
Expected: PASS, 4 testes.

Se a Regra 1 falhar, **não desativar o teste.** Ler o achado: ou o texto quebra a regra e precisa mudar, ou é uma negação legítima — nesse caso acrescentar a frase exata em `EXCECOES`, com comentário.

- [ ] **Step 3: Ligar tudo num comando só**

Em `package.json`:
```json
"scripts": {
  "verificar": "vitest run && next lint && next build"
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test: as três regras de marca viram verificação automática"
```

---

## Task 9: Documentação de entrada para dev novo

**Files:**
- Create: `README.md`, `CONTRIBUTING.md`, `.env.example`
- Modify: `docs/PENDENCIAS.md`

- [ ] **Step 1: `.env.example`**

```
# Endereço público do site — usado em canonical, sitemap e dados estruturados
NEXT_PUBLIC_SITE_URL=https://mtcapital.com.br

# Destino dos leads — configurar ao menos um dos dois
RESEND_API_KEY=re_exemplo_nao_use_este_valor
LEAD_EMAIL_DESTINO=comercial@mtcapital.com.br
LEAD_WEBHOOK_URL=
```

Nenhum valor real. Conferir que `.env*.local` está no `.gitignore` (Plano 1, Task 1).

- [ ] **Step 2: `README.md`**

Nesta ordem:

1. **O que é** — site institucional e de captação da MT Capital; a conversão acontece no WhatsApp.
2. **Rodar na sua máquina** — `npm install`, copiar `.env.example` para `.env.local`, `npm run dev`.
3. **Onde mexer em cada coisa** — a tabela que economiza a primeira semana de um dev novo:

| Quero mudar… | Arquivo |
|---|---|
| Número de WhatsApp, telefone, endereço, redes | `content/config.ts` |
| Qualquer texto de qualquer seção | `content/` — um arquivo por assunto |
| Um caso real | `content/casos.ts` |
| Um imóvel em praça | `content/imoveis.ts` |
| Cores e tipografia | `styles/tokens.css` |
| Layout de uma seção | `components/sections/<Nome>.tsx` e o `.module.css` ao lado |
| Destino dos leads | variável de ambiente, sem tocar em código |

4. **As três regras que o build cobra** — as travas, por que existem, e `npm run verificar`.
5. **Publicar** — `npm run verificar` e depois `vercel --prod`.
6. **Por que o build pode falhar de propósito** — dado de contato em placeholder e caso publicado sem conta completa não são bugs, são as travas funcionando.
7. **O modelo aprovado** — `referencia/index.html` é a prévia aprovada internamente pela empresa. Layout e cores saem dela. Consultar antes de mudar qualquer coisa visual.

- [ ] **Step 3: `CONTRIBUTING.md`**

- Um componente de seção por arquivo, com o `.module.css` ao lado.
- Server Component por padrão; `'use client'` só com estado, evento ou observador.
- Proibido `dangerouslySetInnerHTML` (o lint cobra). Exceção única: o JSON-LD, já documentada.
- Toda entrada validada com zod na fronteira.
- Nenhum dado pessoal em log.
- Antes de abrir alteração: `npm run verificar`.
- Alteração visual exige comparação lado a lado com `referencia/index.html` e registro em `docs/CONFERENCIA.md`.

- [ ] **Step 4: Verificar com olhos de quem chega agora**

Ler o README fingindo nunca ter visto o projeto. Toda pergunta que ele não responde vira uma linha nova.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: README, guia de contribuição e exemplo de variáveis de ambiente"
```

---

## Task 10: Lançamento

**Files:**
- Modify: `content/config.ts`, `content/casos.ts`, `docs/PENDENCIAS.md`

Só executar quando os dados pendentes existirem.

- [ ] **Step 1: Preencher os dados reais**

Em `content/config.ts`: WhatsApp e telefone com DDD 11 ou 21, endereço do coworking, e-mail e redes.

Em `content/casos.ts`: os números dos casos reais, com `publicado: true` **somente** onde houver avaliação, arremate e custos, e autorização do cliente.

- [ ] **Step 2: Configurar as variáveis na Vercel**

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add LEAD_EMAIL_DESTINO production
vercel env add RESEND_API_KEY production
```

- [ ] **Step 3: Rodar a verificação completa**

Run: `npm run verificar`
Expected: testes passando, lint limpo, build concluído. Se a guarda de configuração reclamar, algum dado ainda é placeholder.

- [ ] **Step 4: Percorrer a lista antes de publicar**

- [ ] Os quatro números do topo batem com os casos reais
- [ ] Nenhum `R$ 000.000` em lugar nenhum
- [ ] Todo botão de WhatsApp abre com a mensagem certa
- [ ] O telefone do rodapé disca o telefone
- [ ] `/privacidade` abre e o link do rodapé leva até lá
- [ ] Formulário registra o lead e depois abre o WhatsApp
- [ ] Lead de teste chegou ao destino configurado
- [ ] Link colado no WhatsApp mostra o cartão com a marca
- [ ] `/admin` responde 404
- [ ] Console sem violação de CSP
- [ ] Lighthouse acima de 90 nas quatro categorias
- [ ] Site percorrido inteiro pelo teclado
- [ ] Conferido em celular real, iOS e Android

- [ ] **Step 5: Publicar**

```bash
vercel --prod
```

- [ ] **Step 6: Apontar o domínio e confirmar HTTPS**

```bash
vercel domains add mtcapital.com.br
curl -sI https://mtcapital.com.br | grep -i strict-transport
```
Expected: HSTS presente.

- [ ] **Step 7: Atualizar as pendências**

Em `docs/PENDENCIAS.md`, riscar o resolvido e manter o que segue aberto — PDF do guia, fotos dos sócios e dos imóveis, depoimentos com autorização por escrito, busca do nome MT no INPI, fórmula do percentual e valor da taxa.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: dados de lançamento e checklist concluído"
```

---

## Self-Review

**Cobertura dos 21 achados do diagnóstico:**

| Achado | Gravidade | Onde é resolvido |
|---|---|---|
| Injeção de código no render de imóveis e casos | Crítico | Task 4 (React escapa) + Task 5 (lint proíbe a exceção) |
| Coleta de dados sem base legal | Crítico | Task 2 (consentimento) + Task 3 (política) |
| Formulário não captura lead | Crítico | Tasks 1 e 2 |
| `R$ 000.000` na tela | Crítico | Plano 1, Tasks 5 e 17 |
| Nenhum cabeçalho de segurança | Importante | Task 5 |
| Fonte carregada do Google | Importante | Plano 1, Task 2 |
| Números que se contradizem | Importante | Plano 1, Tasks 5, 6 e 10 |
| Casos de exemplo na contagem | Importante | Plano 1, Tasks 4, 6 e 7 |
| Rolagem customizada frágil | Importante | Plano 1, Task 8 |
| Link sem imagem no WhatsApp | Importante | Plano 1, Task 3 + Task 6 aqui |
| Site invisível para a busca | Importante | Task 6 |
| Barreiras de acessibilidade | Importante | Task 7 + Plano 1, Tasks 9 e 19 |
| Conteúdo metade em HTML, metade em array | Importante | Plano 1, Task 7 |
| Sem controle de versão | Importante | Plano 1, Task 1 |
| Telefone do rodapé disca o WhatsApp | Menor | Plano 1, Task 21 |
| `setTimeout` cronometrados no chute | Menor | Plano 1, Tasks 8 e 20 |
| `mousemove` nunca removido | Menor | Plano 1, Task 16 |
| FAQ corta ao girar o celular | Menor | Plano 1, Task 20 |
| Sem instruções de instalação | Menor | Task 9 |
| Arquivo órfão e CSS duplicado | Menor | Plano 1, Task 1 e Global Constraints |
| Avatares de marca não usados | Menor | Plano 1, Task 3 |

**Todos os 21 achados do relatório têm tarefa.**

**Consistência de tipos conferida:** `Lead` e `LeadSchema` definidos no Plano 1 Task 4, consumidos nas Tasks 1 e 2. `Imovel` e `ImovelSchema` definidos no Plano 1 Task 4, consumidos na Task 4. `permitir(chave, limite?, janelaMs?)` definida na Task 1 e chamada com a mesma assinatura na rota da mesma tarefa. `registrarLead(lead)` definida na Task 1 e chamada na rota. `listarImoveisAbertos()` definida na Task 4 e consumida pela seção `Oportunidades` do Plano 1 Task 16. `linkWhatsApp` definida no Plano 1 Task 8 e usada na Task 2. `calcularMetricas` definida no Plano 1 Task 6 e usada na Task 8. `config` e `faq` de `content/` (Plano 1, Task 7), usados nas Tasks 3 e 6. `nonce` produzido pelo middleware da Task 5 e consumido pelo `DadosEstruturados` da Task 6.

**Pendências que este plano não resolve e não pode resolver sozinho:** o painel administrativo em si (a Task 4 entrega o encaixe, não o painel), o PDF do guia, as fotos, os depoimentos autorizados, o registro do nome MT no INPI, e as definições comerciais de taxa e percentual.

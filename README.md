# MT Capital

## O que é

Site institucional e de captação de leads da MT Capital, assessoria em arrematação de
imóveis e terrenos em leilão judicial e extrajudicial. O site não vende nem fecha negócio
sozinho — ele explica o serviço, mostra prova (casos, depoimentos, números reais) e leva o
visitante a duas conversões: abrir uma conversa no WhatsApp ou preencher o formulário do
Guia (que também termina em contato humano). Toda a persuasão para "falar com alguém"
aponta para o WhatsApp configurado em `content/config.ts`.

Construído em Next.js (App Router), React Server Components por padrão, sem banco de
dados — todo o conteúdo público é código versionado em `content/`.

## Rodar na sua máquina

```bash
npm install
cp .env.example .env.local   # preencha os valores reais — veja o próprio arquivo
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000). `.env.example` já documenta cada
variável (URL pública do site e os dois destinos possíveis para o lead do formulário do
Guia) — não há nada a duplicar aqui, só a completar o `.env.local` com valores reais antes
de testar o envio do formulário.

## Onde mexer em cada coisa

Esta tabela existe para poupar a primeira semana de quem chega agora no projeto.

| Quero mudar… | Arquivo |
|---|---|
| Número de WhatsApp, telefone, endereço, redes | `content/config.ts` |
| Qualquer texto de qualquer seção | `content/` — um arquivo por assunto |
| Um caso real | `content/casos.ts` |
| Um imóvel em praça | `content/imoveis.ts` |
| Cores e tipografia | `styles/tokens.css` |
| Layout de uma seção | `components/sections/<Nome>.tsx` e o `.module.css` ao lado |
| Destino dos leads | variável de ambiente, sem tocar em código |

Cada arquivo de `content/` é um único assunto (ex.: `content/faq.ts` só tem as perguntas do
FAQ, `content/depoimentos.ts` só os depoimentos). Se você está procurando um texto e não
achou o assunto na tabela acima, o nome do arquivo em `content/` costuma ser autoexplicativo.

## As três regras que o build cobra

`tests/regras-de-marca.test.ts` mecaniza três regras de marca da MT Capital — elas rodam a
cada `npm test`/`npm run verificar` e derrubam o build se forem violadas, para que nenhuma
dependa de alguém lembrar de revisar manualmente:

1. **Nunca prometer resultado.** Nenhum texto em `content/`, `components/` ou `app/` pode
   conter frases como "sem risco", "garantido", "rentabilidade", "lucro certo" ou "retorno
   certo" (ver a lista `PROIBIDAS` no teste). As duas únicas ocorrências legítimas hoje são
   negações no aviso legal (`components/sections/Casos.tsx` e
   `components/sections/Rodape.tsx`, ex.: "não representa garantia de resultado futuro") e
   estão registradas como exceções explícitas no próprio teste — o teste também prova que
   essas exceções existem de fato no código, para não virarem muleta morta.
2. **Sempre a conta completa nos casos.** Um caso em `content/casos.ts` só pode ir ao ar
   (`publicado: true`) se tiver avaliação e arremate maiores que zero — `CasoSchema` (em
   `lib/schemas.ts`) recusa com `.refine()` qualquer caso publicado sem os dois. Hoje os dois
   casos de exemplo estão com `publicado: false` justamente porque são fictícios.
3. **Nenhum número inventado.** A faixa de números do Hero (`components/sections/Hero.tsx`)
   é sempre calculada a partir de `content/casos.ts` via `calcularMetricas()` — nunca um
   valor literal digitado à mão no componente. Sem caso publicado, todo agregado mostra zero,
   e isso é o comportamento correto, não um bug.

Comando que verifica as três (e mais lint e build): `npm run verificar`.

## Publicar

```bash
npm run verificar
vercel --prod
```

`npm run verificar` roda, nesta ordem, `vitest run` (testes, incluindo as três regras
acima), `eslint .` (lint) e `next build` (build de produção). Só depois de tudo verde faz
sentido publicar.

## Por que o build pode falhar de propósito

Duas travas do projeto derrubam `next build` em produção de forma intencional — não são
bugs a contornar:

- **Contato em placeholder.** `lib/config-guard.ts` reconhece os placeholders originais de
  WhatsApp/telefone (`5511000000000`, `(11) 0000-0000`) e lança erro em
  `NODE_ENV=production` se algum dos dois ainda estiver em `content/config.ts`. Fora de
  produção, só avisa no console. Ver `docs/PENDENCIAS.md` para o estado atual desses
  campos — os valores de teste usados hoje em desenvolvimento não são reconhecidos por essa
  guarda (ela não é uma proteção contra qualquer número de teste, só contra os placeholders
  originais), então a troca pelos números reais antes do lançamento exige conferência manual.
- **Caso publicado sem conta completa.** `CasoSchema.refine()` (em `lib/schemas.ts`) recusa
  em tempo de parse qualquer caso com `publicado: true` e avaliação ou arremate zerados —
  ver Regra 2 acima.

Se o build falhar num desses dois pontos, o problema está no dado (`content/config.ts` ou
`content/casos.ts`), não no código.

## O modelo aprovado

`referencia/index.html` é a prévia estática aprovada internamente pela MT Capital antes da
reconstrução em Next.js. Layout, cores e comportamento visual do site partem dela — qualquer
mudança visual deve ser conferida contra esse arquivo antes de ir para produção (ver
`CONTRIBUTING.md` e o precedente em `docs/CONFERENCIA.md`, que documenta como essa
comparação foi feita seção por seção na reconstrução original).

# Contribuindo

Guia curto para quem vai alterar código neste projeto. Para visão geral do projeto,
comandos e onde mexer em cada texto/dado, comece pelo `README.md`.

## Componentes de seção

Um componente de seção por arquivo, com o `.module.css` correspondente ao lado (ex.:
`components/sections/Hero.tsx` + `components/sections/Hero.module.css`). Não juntar duas
seções no mesmo arquivo nem deixar CSS de seção fora de `components/sections/`.

## Server Component por padrão

Todo componente novo começa como Server Component. Só adicione `'use client'` quando o
componente realmente precisar de:

- estado (`useState`, `useReducer`);
- um manipulador de evento do navegador (`onClick`, `onChange`, etc.);
- um observer do navegador (`IntersectionObserver`, `ResizeObserver`, e afins).

Se a necessidade é só ler um valor de `content/` ou montar HTML a partir de props, isso é
Server Component.

## `dangerouslySetInnerHTML` é proibido

A regra `react/no-danger` está configurada como erro em `eslint.config.mjs` — `npm run
verificar` falha se qualquer componente usar `dangerouslySetInnerHTML`. A única exceção
sancionada no projeto é o JSON-LD de dados estruturados em
`components/seo/DadosEstruturados.tsx`, que desativa a regra pontualmente na linha com
`eslint-disable-next-line react/no-danger` e um comentário justificando (HTML montado no
servidor a partir de `content/`, sem entrada de usuário). Use esse componente como o
exemplo de como pedir e justificar uma exceção — não abra uma segunda exceção sem o mesmo
nível de justificativa, e prefira sempre renderização normal do React.

## Toda entrada validada com zod

Qualquer dado que cruze uma fronteira de confiança — corpo de requisição de API, conteúdo
de `content/` antes de virar UI, resposta de serviço externo — passa por um schema `zod`
(ver `lib/schemas.ts`) antes de ser usado. Não confiar em tipagem TypeScript sozinha nesses
pontos: tipos são apagados em tempo de execução, o `zod` não.

## Nenhum dado pessoal em log

Não usar `console.log`/`console.error` (nem qualquer outro mecanismo de log) para registrar
nome, telefone, e-mail ou qualquer outro dado pessoal recebido de formulário ou lead. Erros
de validação e falhas de integração podem e devem ser logados — sem incluir o payload
pessoal que os causou.

## Antes de abrir uma alteração

```bash
npm run verificar
```

Roda testes (`vitest run`, incluindo as três regras de marca em
`tests/regras-de-marca.test.ts`), lint (`eslint .`) e build de produção (`next build`),
nessa ordem. Alteração só está pronta para revisão com esse comando limpo.

## Alteração visual exige comparação com o modelo aprovado

Qualquer mudança que afete layout, cor, espaçamento ou tipografia precisa de comparação
lado a lado contra `referencia/index.html` — o modelo aprovado internamente pela MT
Capital — nas larguras relevantes (o projeto usa 1440, 1080, 760 e 390 px como referência).
Documente o resultado da comparação em `docs/CONFERENCIA.md`, seguindo o mesmo formato já
usado ali (uma linha por seção, com o que foi conferido e o que diverge — e por quê, quando
divergir). `docs/CONFERENCIA.md` é o precedente: leia-o antes de fazer sua própria
comparação para seguir o mesmo padrão de registro.

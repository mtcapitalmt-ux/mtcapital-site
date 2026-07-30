# Pendências antes do lançamento

Itens que precisam ser resolvidos com dados reais antes de publicar o site em produção.

## Contato — WhatsApp e telefone (Task 9)

`content/config.ts` está com números de **teste**, não os números reais da MT Capital:

- `whatsapp: '5511999999999'`
- `telefone: '(11) 99999-9999'`

Esses valores existem só para permitir que `npm run build` complete com sucesso durante o
desenvolvimento do site (a guarda em `lib/config-guard.ts` derruba o build de produção quando
detecta os placeholders originais `5511000000000` / `(11) 0000-0000`, e um número de teste válido
era necessário para as tarefas seguintes do plano poderem rodar `npm run build`).

**Antes de publicar**: substituir `whatsapp` e `telefone` em `content/config.ts` pelos números
reais da empresa.

## Endereço (marcado em `content/config.ts`)

`endereco.linha1` e `endereco.cep` também estão com valores de exemplo (`'Av. Exemplo, 000 — Conj. 00'`
e `'00000-000'`) e precisam ser preenchidos com o endereço real antes do lançamento.

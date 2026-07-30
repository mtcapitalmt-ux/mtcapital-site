# Pendências antes do lançamento

Itens que precisam ser resolvidos com dados e decisões reais antes de publicar o site em
produção. Organizados em três grupos: o que bloqueia o lançamento, o que depende de
definição comercial, e o que é importante mas não impede publicar.

## Bloqueiam o lançamento

Sem isso o site vai ao ar com dados de teste visíveis ao público.

- **WhatsApp e telefone reais, com DDD 11 ou 21** — `content/config.ts` está com números de
  teste (`whatsapp: '5511999999999'`, `telefone: '(11) 99999-9999'`). Esses valores só
  existem para permitir que `npm run build` complete durante o desenvolvimento (a guarda em
  `lib/config-guard.ts` derruba o build de produção quando detecta os placeholders originais
  `5511000000000` / `(11) 0000-0000`, então um número de teste válido era necessário para as
  tarefas do plano poderem rodar `npm run build`). Substituir pelos números reais da MT
  Capital antes de publicar.
- **Endereço do coworking** — `content/config.ts` tem `endereco.linha1` e `endereco.cep` com
  valores de exemplo (`'Av. Exemplo, 000 — Conj. 00'` e `'00000-000'`). Precisam do endereço
  real do escritório/coworking usado pela empresa.
- **Números de 2 a 3 casos reais** — `content/casos.ts` hoje só tem dois casos de exemplo,
  ambos marcados `publicado:false` (não aparecem no site). Antes do lançamento é preciso
  pelo menos 2 a 3 casos reais, com autorização por escrito dos clientes envolvidos para usar
  os números da operação (avaliação, arremate, prazo, resultado da revenda quando houver).
  Sem isso a seção "Casos reais" fica com a mensagem "Nenhum caso publicado nessa categoria
  ainda." — o que é honesto, mas não é o efeito de prova social que a seção deveria ter.
- **Domínio registrado** — confirmar que o domínio final (mtcapital.com.br ou equivalente)
  está registrado e configurado para apontar para o deploy de produção. O e-mail de contato
  em `content/config.ts` já assume `contato@mtcapital.com.br`.

## Definições comerciais

Decisões de negócio que faltam antes de o texto do site poder afirmar valores ou processos
com segurança.

- **Fórmula do percentual sobre o desconto** — o texto da Esteira e do FAQ já explica o
  conceito ("percentual sobre a diferença entre o valor de avaliação e o que você pagou de
  fato"), mas o número exato do percentual não está definido em lugar nenhum do conteúdo
  (nem deveria estar público — é definido em contrato). Confirmar se a intenção é mesmo nunca
  publicar o percentual, ou se em algum momento futuro ele deve aparecer como faixa
  indicativa.
- **Valor da taxa de assessoria** — mesma situação: o site explica que existe uma taxa cobrada
  na contratação, descontada do valor final se a arrematação sair, mas não publica valor nem
  faixa. Confirmar se a intenção de negócio é manter isso sempre sob consulta.
- **Formato da reunião de diagnóstico** — o site convida para "agendar reunião gratuita de
  diagnóstico" em vários pontos (Hero, Esteira, CTA), mas não há hoje nenhuma integração de
  agenda: o botão abre o WhatsApp com uma mensagem pronta. Confirmar se isso é suficiente para
  o lançamento ou se a intenção é plugar uma ferramenta de agendamento (Calendly ou
  equivalente) antes de ir ao ar.
- **Praças de atuação** — o FAQ responde "Em leilões de todo o Brasil" quando perguntado onde
  a empresa atua. Confirmar se isso reflete a realidade atual da operação ou se deveria ser
  restrito a praças/estados específicos.
- **Destino dos leads do formulário do Guia** — `components/ui/FormularioGuia.tsx` hoje é um
  stub: o botão "QUERO O GUIA" não envia os dados a lugar nenhum (não é chamada de rede, não
  grava nada). Antes do lançamento é preciso decidir o destino real dos leads capturados
  (e-mail, planilha, CRM) e implementar a submissão de fato — isso é trabalho de código, não
  cabe nesta tarefa de conferência, mas fica registrado aqui como bloqueio funcional do
  formulário. (O Plano 2 deste projeto cobre captura de lead e consentimento.)

## Importantes, não bloqueantes

Não impedem o lançamento, mas deveriam ser resolvidos logo depois.

- **PDF do guia** — o texto promete "baixar o guia" e "mandamos o PDF pelo WhatsApp", mas o
  arquivo em si (o guia gratuito sobre leilão de imóveis) ainda não existe.
- **Fotos dos sócios e dos imóveis** — `content/socios.ts` tem `foto: null` para os dois
  sócios (Tiago Aragão e Marco Lourenço), e os casos de exemplo em `content/casos.ts` têm
  `imagem: null`. As seções mostram hoje o texto "FOTO DO SÓCIO" / "FOTO DO IMÓVEL" como
  placeholder visual.
- **Depoimentos reais com autorização por escrito** — `content/depoimentos.ts` está com três
  depoimentos de exemplo (texto genérico "Substituir pelo depoimento real do cliente...").
  Precisam de depoimentos reais de clientes, com autorização por escrito para publicar nome e
  qualificação (ou anonimizados, se a autorização não cobrir o nome completo).
- **Busca do nome MT no INPI** — confirmar que "MT Capital" (nome e o monograma vetorizado
  criado na Task 3) não colide com marca registrada de terceiros antes de investir em
  material de marca mais permanente.

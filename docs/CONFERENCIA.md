# Conferência visual — Task 22

Comparação lado a lado entre a versão Next.js (http://localhost:3000, dev server) e o
modelo aprovado (referencia/index.html, servido estaticamente) nas larguras 1440, 1080,
760 e 390 px. As duas versões foram carregadas em iframes de largura fixa (o resize_window
do ambiente de automação não altera o viewport real neste setup, então o iframe com largura
fixa foi o jeito confiável de forçar cada breakpoint), com uma folha de estilo injetada para
igualar as classes de revelação por scroll a opacidade 1 — o mesmo efeito que a regra
prefers-reduced-motion do próprio site já produz — porque animações dirigidas por
IntersectionObserver/requestAnimationFrame não disparam de forma confiável em abas em
segundo plano durante automação. Isso não altera o comportamento real do site para o
usuário, que sempre vê a aba em primeiro plano.

Uma linha por seção. Idêntico quer dizer nenhuma diferença visual além do texto placeholder
já esperado. Larguras conferidas: todas as quatro, salvo indicação contrária.

| # | Seção | Larguras | Resultado |
|---|---|---|---|
| 1 | Hero | 1440, 1080, 760, 390 | Idêntico ao layout do modelo (título, parágrafo, botões, faixa de números, diagonais decorativas, breakpoints de empilhamento dos botões e da faixa 4 para 2x2). Diferenças são as autorizadas: monograma no cabeçalho; volume mostrado em valor cheio (R$ 0) em vez de arredondado a milhão (R$ 0 mi); as 4 métricas ficam em zero porque os dois casos de exemplo têm publicado:false — o modelo, sem esse filtro, soma os exemplos e mostra números fictícios (2 operações, R$ 1 mi). |
| 2 | Pilares (Antes/Durante/Depois) | 1440, 1080, 760, 390 | Idêntico. Texto, ordem dos 3 blocos e estilo conferem exatamente. |
| 3 | Esclarecimentos | 1440, 1080, 760, 390 | Idêntico. Título, subtítulo e as 7 perguntas e respostas (incluindo o texto em negrito embutido) conferem palavra por palavra. Layout de duas colunas em 1440/1080 e empilhado em 760/390, igual nos dois. |
| 4 | Mitos | 1440, 1080, 760, 390 | Idêntico. |
| 5 | Especialidades | 1440, 1080, 760, 390 | Idêntico. Cartões 01/02/03 lado a lado em 1440, empilhados em 1080/760/390 — mesmo breakpoint (max-width:1080) nos dois lados. |
| 6 | Esteira (Como contratar) | 1440, 1080, 760, 390 | Idêntico. Os 4 cartões (Baixe o guia / Reunião de diagnóstico / Contratação / Percentual sobre desconto) e a nota de rodapé da seção conferem. |
| 7 | Processo | 1440, 1080, 760, 390 | Idêntico. As 9 etapas (Busca e seleção até Posse e chaves) conferem em texto e ordem. |
| 8 | Oportunidades | 1440, 1080, 760, 390 | Idêntico, inclusive o estado vazio. O modelo aprovado já define esse estado (NADA PUBLICADO AGORA / Estamos analisando os editais da próxima praça. + botão RECEBER OPORTUNIDADES) como o padrão da seção; a versão nova reproduz o mesmo texto e estilo. A miniatura flutuante ao passar o mouse não pôde ser testada aqui porque não há imóveis publicados em nenhum dos dois lados — o comportamento e a correção do vazamento de mousemove foram conferidos por leitura de código na Task 16, não neste passo visual. |
| 9 | Casos | 1440, 1080, 760, 390 | Ver detalhamento abaixo — bate com a tabela de mudanças autorizadas, de forma mais estrita do que o mínimo descrito. |
| 10 | Depoimentos | 1440, 1080, 760, 390 | Idêntico. Os 3 cartões de depoimento (texto: Substituir pelo depoimento real do cliente...) são iguais nos dois lados — não é uma divergência de código, é o mesmo placeholder herdado do modelo aprovado, marcado como PENDENTE em content/depoimentos.ts. |
| 11 | Equipe | 1440, 1080, 760, 390 | Idêntico. Tiago Aragão e Marco Lourenço, mesmas bios placeholder, mesmo layout de 2 cartões. |
| 12 | Guia | 1440, 1080, 760, 390 | Idêntico visualmente (título, texto, formulário com 3 campos, botão QUERO O GUIA, nota de envio). O rótulo (label) visualmente oculto em cada campo — autorizado pela tabela — não aparece numa captura de tela; foi conferido por inspeção do DOM (cada input tem um label associado com classe sr-only). |
| 13 | Faq | 1440, 1080, 760, 390 | Idêntico — as 11 perguntas conferem uma a uma nos dois lados. Testada a interação de abrir e fechar (clique real, não só .click() programático) em 1440 e em 390: expande com transição em grid, ícone + vira -, as outras perguntas continuam fechadas, sem nenhum erro. |
| 14 | Cta | 1440, 1080, 760, 390 | Idêntico. |
| 15 | Rodape | 1440, 1080, 760, 390 | Idêntico visualmente (monograma, colunas do mapa do site, contato, escritório, disclaimer legal), com as diferenças autorizadas conferidas nos links: o telefone (tel:11999999999) disca o número exibido — no modelo aprovado o link de telefone (tel:+5511000000000) na verdade disca o número de WhatsApp, que é o bug que esta tarefa corrige; Política de privacidade é um link real (/privacidade) na versão nova — o modelo aprovado não tem esse link. Em 1080/760/390 as colunas do rodapé empilham da mesma forma nos dois lados. |

## Detalhe da seção Casos (a de maior risco do plano)

Na largura 1440 (padrão reproduzido nas demais), com os dois casos de exemplo em
publicado:false:

- Faixa de resumo — o modelo aprovado mostra 2 operações concluídas e R$ 500.000 de volume
  total avaliado (conta os dois exemplos, porque a lógica original não filtra por
  publicação) e um travessão para desconto médio e resultado nas revendas (esses dois já
  eram travessão no modelo porque os campos de origem são 0 ou nulos). A versão nova mostra
  travessão nas 4 métricas, porque os exemplos não publicados não entram em nenhum agregado.
- Listagem de casos — o modelo aprovado renderiza os dois cartões de exemplo com os campos
  vazios preenchidos como R$ 000.000 (avaliação e arrematação zeradas do caso Ribeira, e
  avaliação zerada do caso Ilha). A versão nova não lista nenhum cartão — mostra a mensagem
  Nenhum caso publicado nessa categoria ainda. no lugar da grade de cartões, porque casos com
  publicado:false são removidos da listagem antes mesmo de renderizar campo por campo. Isso é
  mais rigoroso do que o mínimo da tabela (campo sem valor não é renderizado), mas satisfaz
  plenamente a intenção documentada (nenhum número inventado, casos de exemplo fora da
  contagem) sem contradizer nada nela.

## O que não foi possível verificar aqui

- Celular real: não há dispositivo físico disponível neste ambiente. A verificação de
  rolagem, abertura do FAQ e formulário foi feita via emulação de largura (390 px) com
  clique real disparado por automação de navegador, não por toque em tela física. Vale um
  teste rápido num celular real antes do lançamento, focado em: rolagem suave (Lenis), abrir
  e fechar perguntas do FAQ, e o foco visual ao tabular pelos campos do formulário do Guia.
- Miniatura ao passar o mouse em Oportunidades: não há imóveis publicados em nenhum dos dois
  lados agora, então o hover de miniatura não pôde ser exercitado visualmente. A ausência de
  vazamento do listener de mousemove foi confirmada por leitura de código na Task 16
  (review-9ac08a9..3b675fa.diff), não neste passo.
- Envio real do formulário do Guia: o botão QUERO O GUIA é hoje um stub sem efeito colateral
  (não navega, não envia rede) — confirmado no código da Task 19, não testado por clique
  aqui para não mascarar um erro real de submissão que ainda não existe.

## Achados novos (fora da tabela de mudanças autorizadas)

Nenhum. Toda diferença encontrada nesta conferência está coberta pela tabela de mudanças
autorizadas do brief da Task 22, ou é texto placeholder idêntico herdado do modelo aprovado
(Depoimentos, Equipe, valores de contato de teste em content/config.ts).

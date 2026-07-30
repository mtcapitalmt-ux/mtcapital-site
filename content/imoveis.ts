// Enquanto o painel administrativo não existir, os imóveis vivem aqui.
// Quando ele nascer, esta lista deixa de ser lida — muda só lib/imoveis.ts.
// Tipado como unknown[] de propósito: é lib/imoveis.ts que valida cada
// registro contra ImovelSchema antes de qualquer seção usar o dado.
export const imoveisBrutos: unknown[] = []

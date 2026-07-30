// Fonte: referencia/index.html, linhas 654–669 (bloco .socios)
// PENDENTE: substituir por conteúdo real com autorização por escrito

export interface Socio {
  papel: string
  nome: string
  bio: string
  foto: string | null
}

export const socios: Socio[] = [
  {
    papel: 'Sócio-fundador',
    nome: 'Tiago Aragão',
    bio:
      'Dez anos de mercado analisando edital, calculando risco e arrematando de verdade. Substituir por biografia completa: formação, número de operações conduzidas e áreas de especialização.',
    foto: null,
  },
  {
    papel: 'Sócio',
    nome: 'Marco Lourenço',
    bio:
      'Substituir por biografia. Se houver advogado na equipe, informar a inscrição na OAB e a especialização em direito imobiliário.',
    foto: null,
  },
]

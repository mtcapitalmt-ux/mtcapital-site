// Fonte: referencia/index.html:682-688 (.cap-form, dentro da seção #guia) —
// o texto de apoio da coluna esquerda (eyebrow/título/lede/primeira nota)
// vem de content/textos.ts (guia) e é renderizado por Guia.tsx; este
// componente cobre só os campos do formulário e as duas mensagens que
// dependem deles.
//
// Bug de acessibilidade corrigido aqui (o motivo real desta tarefa): no
// original os três <input> só tinham placeholder, sem nenhum <label> — o
// texto de exemplo some assim que a pessoa começa a digitar, e quem usa
// leitor de tela nunca ficava sabendo o nome do campo. Cada input abaixo
// ganha um <label htmlFor> associado ao id correspondente, oculto
// visualmente com .sr-only (styles/base.css, Task 9) — o placeholder
// continua visível e a aparência não muda.
//
// Sem 'use client': não há nenhum estado ou handler de verdade ainda. O
// envio real (abrir o WhatsApp com os dados preenchidos, referencia/
// index.html:1067-1077) e o consentimento são as Tasks 1 e 2 do Plano 2 —
// construir aqui um estado ou validação que seria descartado depois
// contradiz a instrução de manter isto mínimo. O botão fica como
// type="button" sem handler, e o parágrafo de mensagem (.cap-msg) fica como
// um espaço reservado estático, com aria-live="polite" já pronto para
// quando a lógica real existir. Reveal (Client Component) pode ser
// renderizado por este Server Component sem problema — só o próprio Reveal
// precisa de 'use client', não quem o usa.
import { Reveal } from '@/components/ui/Reveal'
import s from '@/components/sections/Guia.module.css'

export function FormularioGuia() {
  return (
    <Reveal className={s['cap-form']}>
      <label htmlFor="nome" className="sr-only">Nome completo</label>
      <input id="nome" name="nome" type="text" placeholder="Nome completo" autoComplete="name" required />

      <label htmlFor="telefone" className="sr-only">Telefone com DDD</label>
      <input id="telefone" name="telefone" type="tel" placeholder="Telefone com DDD" autoComplete="tel" required />

      <label htmlFor="email" className="sr-only">E-mail</label>
      <input id="email" name="email" type="email" placeholder="E-mail" autoComplete="email" />

      <button type="button" className="btn">Quero o guia</button>

      {/* Espaço reservado para a mensagem de validação (index.html:687,
          #cap-msg) — vazio até a Task 1 do Plano 2 implementar o envio de
          verdade; aria-live já garante que, quando houver texto, ele seja
          anunciado a quem usa leitor de tela. */}
      <p className={s['cap-msg']} aria-live="polite"></p>

      <p className={s['cap-note']}>Ao enviar, o WhatsApp abre com seus dados preenchidos e a gente manda o PDF. Não mandamos mensagem que você não pediu.</p>
    </Reveal>
  )
}

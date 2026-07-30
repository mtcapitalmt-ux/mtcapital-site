// Fonte: referencia/index.html:594-613 (seção #casos) e o trecho do <script>
// em 977-1000 (numerosAgregados) e 1002-1064 (renderCasos/montarFiltros).
//
// Regra de negócio mais importante desta tarefa: o original tinha
// `const fmt = v => v ? brl(v) : 'R$ 000.000'` — sempre que avaliação ou
// arremate vinham zerados (como os dois casos de exemplo ainda são hoje, ver
// content/casos.ts), a tela mostrava a string literal "R$ 000.000" como se
// fosse dinheiro de verdade. Aqui um campo sem valor real simplesmente não é
// renderizado — nunca um placeholder, nunca "R$ 0" fingindo ser dado real.
// Ver a mesma regra aplicada em components/ui/FiltrosCasos.tsx (linhasDoCaso).
//
// Divisão servidor/cliente: só a barra de filtros + os cartões (que mudam
// com o clique no filtro) precisam de estado, por isso só eles viraram um
// componente cliente (FiltrosCasos). O cabeçalho, a faixa de resumo
// (calculada uma vez, sem interação) e o aviso legal continuam renderizados
// no servidor — mesmo padrão de Oportunidades.tsx (Oportunidades server +
// MiniaturaFlutuante client).
import { textos } from '@/content/textos'
import { casos } from '@/content/casos'
import { config } from '@/content/config'
import { calcularMetricas } from '@/lib/metricas'
import { brl } from '@/lib/formato'
import { partesComDestaque } from '@/lib/destaque'
import { Reveal } from '@/components/ui/Reveal'
import { FiltrosCasos } from '@/components/ui/FiltrosCasos'
import s from './Casos.module.css'

export function Casos() {
  const { casosCabecalho: cab } = textos

  // `destaque` já está contido em `titulo` (ver comentário em content/textos.ts)
  // — dividimos a string pela ocorrência do trecho em vez de concatenar,
  // senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(cab.titulo, cab.destaque)

  const publicados = casos.filter((c) => c.publicado)
  const m = calcularMetricas(casos, config.anosAtuacao)

  // Mesma regra do res-strip do original (numerosAgregados): valor zero
  // mostra "—", nunca um número falso. Ao contrário do original — que só
  // aplicava o fallback a volume/descontoMedio/lucroTotal, deixando
  // "operações concluídas" como um "0" nu — aqui as quatro células seguem a
  // mesma regra, para não misturar um "0" de verdade ao lado de três "—".
  const celulas: { valor: string; rotulo: string }[] = [
    { valor: m.operacoes ? String(m.operacoes) : '—', rotulo: 'Operações concluídas' },
    { valor: m.volumeAvaliado ? brl(m.volumeAvaliado) : '—', rotulo: 'Volume total avaliado' },
    { valor: m.descontoMedio ? `${m.descontoMedio}%` : '—', rotulo: 'Desconto médio' },
    { valor: m.resultadoRevendas ? brl(m.resultadoRevendas) : '—', rotulo: 'Resultado nas revendas' },
  ]

  return (
    <section className="section sec-navy2" id="casos">
      <div className="sec-head">
        <div>
          <Reveal className="eyebrow">{cab.eyebrow}</Reveal>
          <Reveal>
            <h2 className="h2">
              {antes}<em className="mark">{destaque}</em>{depois}
            </h2>
          </Reveal>
        </div>
        <Reveal className="lede">{cab.lede}</Reveal>
      </div>

      <Reveal className={s['res-strip']}>
        {celulas.map((c) => (
          <div key={c.rotulo}>
            <div className={s.k}>{c.valor}</div>
            <div className={s.v}>{c.rotulo}</div>
          </div>
        ))}
      </Reveal>

      <FiltrosCasos casos={publicados} />

      <Reveal className={`disclaimer ${s.aviso}`}>
        Resultados obtidos em operações já concluídas, com autorização dos respectivos clientes. Desempenho passado não representa garantia de resultado futuro. Cada operação possui condições, prazos e riscos próprios, apurados individualmente na análise prévia.
      </Reveal>
    </section>
  )
}

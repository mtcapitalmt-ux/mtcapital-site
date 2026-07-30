'use client'
// Fonte: referencia/index.html, trecho do <script> em 1052-1064 (montarFiltros)
// e 1002-1049 (renderCasos). No original, um clique no filtro chamava de
// novo renderCasos(), que reconstruía TODO o HTML dos cartões — inclusive o
// `fmt = v => v ? brl(v) : 'R$ 000.000'` responsável pelo bug que esta
// tarefa existe para eliminar (ver comentário em Casos.tsx). Aqui o filtro e
// os cartões vivem no mesmo componente cliente porque o clique precisa
// recalcular a lista renderizada — o mesmo acoplamento que montarFiltros/
// renderCasos já tinham no original, só que via estado do React, sem
// manipulação de innerHTML.
import { useState } from 'react'
import type { Caso } from '@/lib/schemas'
import { brl } from '@/lib/formato'
import { descontoDe, investimentoReal, lucroDe } from '@/lib/metricas'
import { Reveal } from '@/components/ui/Reveal'
import s from '@/components/sections/Casos.module.css'

export type LinhaCaso = { rotulo: string; valor: string; destaque?: boolean }

// Regra de negócio central desta tarefa: um campo sem valor real simplesmente
// não entra na lista — nunca um placeholder como o "R$ 000.000" do original,
// nunca "R$ 0" fingindo ser um dado de verdade. `investimentoReal`,
// `descontoDe` e `lucroDe` vêm de lib/metricas.ts (não reimplementados aqui).
export function linhasDoCaso(caso: Caso): LinhaCaso[] {
  const candidatas: (LinhaCaso | false)[] = [
    caso.avaliacao > 0 && { rotulo: 'Avaliação', valor: brl(caso.avaliacao) },
    caso.arremate > 0 && { rotulo: 'Arrematação', valor: brl(caso.arremate) },
    caso.arremate > 0 && {
      rotulo: 'Investimento real',
      valor: brl(investimentoReal(caso)),
      destaque: true,
    },
    caso.parcelas !== null && { rotulo: 'Parcelamento', valor: `${caso.parcelas}×` },
    caso.prazoMeses !== null && { rotulo: 'Até a posse', valor: `${caso.prazoMeses} meses` },
  ]
  return candidatas.filter((linha): linha is LinhaCaso => linha !== false)
}

type Props = {
  // Já filtrado para publicado === true por quem chama (components/sections/Casos.tsx).
  casos: Caso[]
}

export function FiltrosCasos({ casos }: Props) {
  const tipos = [...new Set(casos.map((c) => c.tipo))]
  const [filtro, setFiltro] = useState('todos')

  // Como no original (montarFiltros): a barra de filtros só aparece quando
  // há pelo menos dois tipos distintos entre os casos publicados.
  const mostrarFiltros = tipos.length >= 2
  const lista = filtro !== 'todos' ? casos.filter((c) => c.tipo === filtro) : casos

  return (
    <>
      {mostrarFiltros && (
        <Reveal className={s['res-filtros']}>
          {['todos', ...tipos].map((tipo) => (
            <button
              key={tipo}
              type="button"
              className={tipo === filtro ? s.on : undefined}
              aria-pressed={tipo === filtro}
              onClick={() => setFiltro(tipo)}
            >
              {tipo === 'todos' ? 'Todos' : tipo}
            </button>
          ))}
        </Reveal>
      )}

      {lista.length === 0 ? (
        <div className={s['casos-vazio']}>Nenhum caso publicado nessa categoria ainda.</div>
      ) : (
        <Reveal stagger className={s.casos}>
          {lista.map((caso) => {
            const desconto = descontoDe(caso)
            const lucro = lucroDe(caso)
            const linhas = linhasDoCaso(caso)
            return (
              <article key={caso.id} className={s.caso}>
                <div className={s['caso-img']}>
                  {desconto !== null && desconto > 0 && (
                    <span className={s['caso-badge']}>{desconto}% abaixo</span>
                  )}
                  {caso.imagem ? (
                    // Imagem vem de uma URL externa arbitrária por caso (ver
                    // CasoSchema.imagem em lib/schemas.ts); sem um domínio
                    // fixo para configurar em next.config.ts, next/image não
                    // se aplica aqui — mesmo tradeoff de MiniaturaFlutuante.tsx.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={caso.imagem} alt={caso.titulo} loading="lazy" />
                  ) : (
                    <span className={s['caso-ph']}>Foto do imóvel</span>
                  )}
                </div>
                <div className={s['caso-body']}>
                  <p className="label">{caso.tipo} · {caso.local}</p>
                  <h3 className="h3">{caso.titulo}</h3>
                  <p>{caso.resumo}</p>
                  <div className={s['caso-nums']}>
                    {linhas.map((linha) => (
                      <div key={linha.rotulo} className={linha.destaque ? s.up : undefined}>
                        <span>{linha.rotulo}</span>
                        <b>{linha.valor}</b>
                      </div>
                    ))}
                  </div>
                  {lucro !== null && (
                    <div className={s['caso-lucro']}>
                      <b>{brl(lucro)}</b>
                      <span>Resultado na revenda</span>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </Reveal>
      )}
    </>
  )
}

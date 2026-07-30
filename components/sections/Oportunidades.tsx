// Fonte: referencia/index.html, linhas 582-592 (seção #oportunidades) e o
// trecho do <script> em 920-967 (função renderOps + carregarImoveis).
import { textos } from '@/content/textos'
import { linkWhatsApp } from '@/lib/whatsapp'
import type { Imovel } from '@/lib/schemas'
import { Reveal } from '@/components/ui/Reveal'
import { MiniaturaFlutuante } from '@/components/ui/MiniaturaFlutuante'
import { partesComDestaque } from '@/lib/destaque'
import s from './Oportunidades.module.css'

const MENSAGEM_RECEBER = 'Olá! Gostaria de receber as oportunidades de leilão da MT Capital.'

type Props = {
  // Ainda não existe fonte real de imóveis: `lib/imoveis.ts` é a Task 4 de um
  // plano futuro e separado (Plano 2), que vai ler de uma fonte de dados de
  // verdade e passar o resultado para cá. Até lá, ninguém preenche esta prop
  // e a seção sempre renderiza o estado vazio abaixo (`.ops-empty`) — que é o
  // comportamento correto e definitivo enquanto o painel não existe, não um
  // placeholder provisório. Quando a Task 4 existir, ela só precisa passar
  // `imoveis` com dados reais; nada aqui precisa mudar de forma.
  imoveis?: Imovel[]
}

export function Oportunidades({ imoveis = [] }: Props) {
  const { oportunidadesCabecalho: cab } = textos

  // `destaque` já está contido em `titulo` (ver comentário em content/textos.ts)
  // — dividimos a string pela ocorrência do trecho em vez de concatenar,
  // senão o trecho em destaque apareceria duas vezes.
  const [antes, destaque, depois] = partesComDestaque(cab.titulo, cab.destaque)

  return (
    <section className="section" id="oportunidades">
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

      {imoveis.length > 0 ? (
        <MiniaturaFlutuante imoveis={imoveis} />
      ) : (
        <Reveal className={s['ops-empty']}>
          <p className="label">Nada publicado agora</p>
          <h3 className="h3">Estamos analisando os editais da próxima praça.</h3>
          <p>Entre na lista e receba as oportunidades assim que a gente terminar de analisar, com o parecer preliminar pronto.</p>
          <a className="btn" href={linkWhatsApp(MENSAGEM_RECEBER)} target="_blank" rel="noopener noreferrer">
            Receber oportunidades
          </a>
        </Reveal>
      )}
    </section>
  )
}

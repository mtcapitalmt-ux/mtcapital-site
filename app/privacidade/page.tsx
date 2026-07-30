// Fecha o defeito crítico do rodapé (Plano 1, Task 21) e do formulário do
// guia (Plano 2, Task 2): os dois já linkam para /privacidade, e até esta
// task a rota não existia — todo clique resultava em 404. O texto de cada
// seção vem de content/privacidade.ts; esta página só monta o layout com as
// classes globais do site (.section/.h2/.lede/.eyebrow, styles/base.css) e
// interpola o e-mail/telefone de `config` nas seções marcadas com `contato`
// (ver comentário em content/privacidade.ts sobre por que esses valores não
// ficam duplicados no arquivo de conteúdo).
import type { Metadata } from 'next'
import { config } from '@/content/config'
import { privacidade } from '@/content/privacidade'
import { linkWhatsApp } from '@/lib/whatsapp'
import { Reveal } from '@/components/ui/Reveal'
import { Rodape } from '@/components/sections/Rodape'
import s from './privacidade.module.css'

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description: 'Como a MT Capital coleta, usa e protege os dados de quem entra em contato pelo site.',
  // Sem isto, a página herdava `alternates.canonical: "/"` de app/layout.tsx
  // (o layout raiz define um canonical global para a home) e declarava a
  // própria home como sua URL canônica — uma autocontradição frente ao
  // sitemap (app/sitemap.ts, que lista /privacidade como URL indexável
  // própria) e ao `robots: {index: true}` logo abaixo, que faria o Google
  // tender a descartar a página do índice.
  alternates: { canonical: '/privacidade' },
  robots: { index: true, follow: true },
}

const MENSAGEM_WHATSAPP = 'Olá! Quero falar sobre meus dados, conforme a política de privacidade.'

export default function PaginaPrivacidade() {
  return (
    <>
      <main id="conteudo">
        <section className="section" id="privacidade">
          <Reveal className="eyebrow">{privacidade.eyebrow}</Reveal>
          {/* Único <h1> da página (o <h1> global do site mora só na Hero da
              home, referencia/index.html) — className="h2" reaproveita a
              tipografia já aprovada em vez de introduzir um novo tamanho. */}
          <Reveal>
            <h1 className="h2">{privacidade.titulo}</h1>
          </Reveal>
          <Reveal className="lede">{privacidade.lede}</Reveal>

          <div className={s.secoes}>
            {privacidade.secoes.map((secao) => (
              <div key={secao.titulo} className={s.secao}>
                <h3 className="h3">{secao.titulo}</h3>
                {secao.paragrafos.map((paragrafo) => (
                  <p key={paragrafo}>{paragrafo}</p>
                ))}
                {secao.contato === 'responsavel' && (
                  <p>
                    Dúvidas sobre esta política podem ser enviadas para{' '}
                    <a href={`mailto:${config.email}`}>{config.email}</a>.
                  </p>
                )}
                {secao.contato === 'direitos' && (
                  <p>
                    Para exercer qualquer um desses direitos, fale com a gente pelo e-mail{' '}
                    <a href={`mailto:${config.email}`}>{config.email}</a> ou pelo WhatsApp{' '}
                    <a href={linkWhatsApp(MENSAGEM_WHATSAPP)} target="_blank" rel="noopener noreferrer">
                      {config.telefone}
                    </a>.
                  </p>
                )}
              </div>
            ))}
          </div>

          <p className={s.atualizado}>Última atualização: {privacidade.ultimaAtualizacao}.</p>
        </section>
      </main>
      <Rodape />
    </>
  )
}

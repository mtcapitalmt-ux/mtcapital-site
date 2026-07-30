// Fonte: referencia/index.html:715-750 (footer.site — quatro colunas, faixa
// inferior com copyright + link de privacidade, e o aviso legal).
import Link from 'next/link'
import { textos } from '@/content/textos'
import { config } from '@/content/config'
import { digitos } from '@/lib/formato'
import { linkWhatsApp } from '@/lib/whatsapp'
import { Monograma } from '@/components/brand/Monograma'
import s from './Rodape.module.css'

const MENSAGEM_WHATSAPP = 'Olá! Vim pelo site da MT Capital.'

// Mapa do site: mesmos destinos do Nav (components/sections/Nav.tsx),
// navegação interna por âncora — não vem de content/, é só espelho da
// estrutura de seções já definida ali.
const MAPA_DO_SITE: { href: string; rotulo: string }[] = [
  { href: '#especialidades', rotulo: 'Especialidades' },
  { href: '#processo', rotulo: 'Como funciona' },
  { href: '#oportunidades', rotulo: 'Oportunidades' },
  { href: '#casos', rotulo: 'Casos reais' },
  { href: '#equipe', rotulo: 'Quem somos' },
  { href: '#duvidas', rotulo: 'Perguntas frequentes' },
]

export function Rodape() {
  // Ano calculado no servidor a cada render — nunca hardcoded (o original
  // tinha <span id="ano">2026</span> preenchido em runtime por JS).
  const ano = new Date().getFullYear()

  return (
    <footer className={s.site}>
      <div className={s['foot-grid']}>
        <div>
          <div className="brand" style={{ marginBottom: 18 }}>
            <span className="brand-row">
              <Monograma className="brand-mark" />
              <b>{config.marca.toUpperCase()}</b>
            </span>
            <small>{config.assinatura}</small>
          </div>
          <p style={{ maxWidth: '36ch' }}>{textos.rodape}</p>
        </div>

        <div>
          <h4>Mapa do site</h4>
          {MAPA_DO_SITE.map((link) => (
            <a key={link.href} href={link.href}>{link.rotulo}</a>
          ))}
        </div>

        <div>
          <h4>Contato</h4>
          <a href={linkWhatsApp(MENSAGEM_WHATSAPP)} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          {/* Correção deliberada (bug real do original, ver brief da Task 21):
              o <a id="tel-link"> do original exibia config.telefone mas seu
              href era montado em runtime como 'tel:+' + CONFIG.whatsapp — se
              telefone e whatsapp algum dia divergirem, o número mostrado na
              tela e o número realmente discado passam a ser diferentes.
              Aqui o href sempre deriva do mesmo valor exibido. */}
          <a href={`tel:${digitos(config.telefone)}`}>{config.telefone}</a>
          <a href={`mailto:${config.email}`}>{config.email}</a>
          <a href={config.redes.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={config.redes.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
          <a href={config.redes.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href={config.redes.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>

        <div>
          <h4>Escritório</h4>
          <p>
            {config.endereco.linha1}<br />
            {config.endereco.cidade} — {config.endereco.uf}<br />
            CEP {config.endereco.cep}
          </p>
        </div>
      </div>

      <div className={s['foot-bot']}>
        <span>© {ano} {config.marca}. Todos os direitos reservados.</span>
        {/* Correção deliberada (bug real do original, ver brief da Task 21):
            o original era um <span>Política de privacidade</span> sem
            destino nenhum. A página /privacidade é tarefa de um plano
            futuro separado (Plano 2) — até lá este link resulta em 404, o
            que já é progresso real sobre uma promessa que antes não levava
            a lugar nenhum. */}
        <Link href="/privacidade">Política de privacidade</Link>
      </div>

      <p className="disclaimer">
        Os valores apresentados correspondem a avaliações constantes dos respectivos editais e não constituem garantia de rentabilidade, de arrematação ou de valorização futura. A arrematação em leilão envolve riscos, custos adicionais e prazos processuais próprios. Toda operação é precedida de análise individual e de contrato escrito. A MT Capital presta serviços de assessoria em investimento e negócios; atos privativos de advogado são conduzidos por profissionais regularmente inscritos na Ordem dos Advogados do Brasil.
      </p>
    </footer>
  )
}

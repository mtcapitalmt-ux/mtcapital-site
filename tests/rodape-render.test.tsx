import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Rodape } from '@/components/sections/Rodape'
import { config } from '@/content/config'
import { digitos } from '@/lib/formato'

describe('rodapé', () => {
  it('bug corrigido: o link de telefone disca o número derivado de config.telefone, nunca de config.whatsapp', () => {
    const { container } = render(<Rodape />)
    const links = Array.from(container.querySelectorAll('a'))
    const telLink = links.find((a) => a.getAttribute('href')?.startsWith('tel:'))

    expect(telLink).toBeTruthy()
    expect(telLink?.getAttribute('href')).toBe(`tel:${digitos(config.telefone)}`)
    expect(telLink?.getAttribute('href')).not.toBe(`tel:${config.whatsapp}`)
    expect(telLink?.getAttribute('href')).not.toBe(`tel:+${config.whatsapp}`)
    expect(telLink?.textContent).toBe(config.telefone)
  })

  it('bug corrigido: "Política de privacidade" é um link real para /privacidade, não mais um <span> sem destino', () => {
    const { getByText } = render(<Rodape />)
    const link = getByText('Política de privacidade')

    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/privacidade')
  })

  it('mostra o ano corrente, calculado no servidor (não hardcoded)', () => {
    const { container } = render(<Rodape />)
    expect(container.textContent).toContain(String(new Date().getFullYear()))
  })

  it('inclui o aviso legal verbatim (referencia/index.html:749)', () => {
    const { container } = render(<Rodape />)
    expect(container.textContent).toContain(
      'Os valores apresentados correspondem a avaliações constantes dos respectivos editais e não constituem garantia de rentabilidade, de arrematação ou de valorização futura. A arrematação em leilão envolve riscos, custos adicionais e prazos processuais próprios. Toda operação é precedida de análise individual e de contrato escrito. A MT Capital presta serviços de assessoria em investimento e negócios; atos privativos de advogado são conduzidos por profissionais regularmente inscritos na Ordem dos Advogados do Brasil.',
    )
  })

  it('mapa do site tem os 6 links de âncora esperados', () => {
    const { container } = render(<Rodape />)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    for (const ancora of ['#especialidades', '#processo', '#oportunidades', '#casos', '#equipe', '#duvidas']) {
      expect(hrefs).toContain(ancora)
    }
  })

  it('email e redes sociais apontam para os destinos corretos', () => {
    const { container } = render(<Rodape />)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    expect(hrefs).toContain(`mailto:${config.email}`)
    expect(hrefs).toContain(config.redes.instagram)
    expect(hrefs).toContain(config.redes.tiktok)
    expect(hrefs).toContain(config.redes.youtube)
    expect(hrefs).toContain(config.redes.linkedin)
  })
})

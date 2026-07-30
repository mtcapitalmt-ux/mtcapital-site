import { config } from '@/content/config'
import { brl, dataBR } from '@/lib/formato'
import type { Imovel } from '@/lib/schemas'

export function linkWhatsApp(mensagem: string): string {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function mensagemImovel(im: Imovel): string {
  const lance = im.lance2?.valor ?? im.lance1?.valor ?? 0
  return [
    'Olá! Tenho interesse no seguinte imóvel:',
    '',
    im.titulo,
    `Avaliação: ${brl(im.valorAvaliacao)}`,
    `Lance mínimo: ${brl(lance)}`,
    im.lance2 ? `2ª praça: ${dataBR(im.lance2.data)}` : null,
    '',
    'Gostaria de receber a análise.',
  ].filter((l): l is string => l !== null).join('\n')
}

import { NextResponse } from 'next/server'
import { listarImoveisAbertos } from '@/lib/imoveis'

// Somente leitura, sem autenticação: expõe a mesma lista pública (validada,
// sem os encerrados) já mostrada em #oportunidades. Métodos de escrita não
// existem — quando o painel administrativo chegar, eles nascem atrás de
// autenticação, nunca antes.
export async function GET() {
  const imoveis = await listarImoveisAbertos()
  return NextResponse.json(imoveis, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}

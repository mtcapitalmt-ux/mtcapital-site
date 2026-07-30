import { NextResponse, type NextRequest } from "next/server";

// A área administrativa ainda não existe (é responsabilidade de um esforço
// futuro e separado). Responder 404 em vez de 403 para não anunciar que há
// algo ali — um 403 confirmaria a existência da rota para quem estiver
// sondando; um 404 se mistura com qualquer outra URL inexistente.
function bloqueado(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

// Next.js 16 renomeou o arquivo `middleware.ts`/função `middleware` para
// `proxy.ts`/função `proxy` (mesma API, mesmo comportamento) — usar
// `middleware.ts` aqui emitiria aviso de depreciação a cada build.
export function proxy(req: NextRequest) {
  if (bloqueado(req.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  // Nonce novo a cada requisição — não pode ser um valor fixo, senão um
  // invasor que descobrisse o valor poderia reutilizá-lo para injetar
  // scripts que a CSP deveria bloquear.
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https:`,
    `font-src 'self'`,
    `connect-src 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  // O nonce é repassado como cabeçalho de requisição para que Server
  // Components (app/layout.tsx) consigam lê-lo via `headers()` e usá-lo em
  // qualquer <script> que precise (ex.: JSON-LD da Task 6).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

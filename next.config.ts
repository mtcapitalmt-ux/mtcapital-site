import type { NextConfig } from "next";

// Cabeçalhos fixos aplicados a toda resposta. A Content-Security-Policy fica
// de fora daqui de propósito: ela depende do nonce por requisição gerado em
// `middleware.ts` e é anexada lá, não aqui.
const cabecalhosFixos = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: cabecalhosFixos }];
  },
};

export default nextConfig;

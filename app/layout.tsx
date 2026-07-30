import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "@/styles/tokens.css";
import "@/styles/base.css";
import { config } from "@/content/config";
import { validarConfig } from "@/lib/config-guard";
import { Nav } from "@/components/sections/Nav";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { WhatsAppFlutuante } from "@/components/ui/WhatsAppFlutuante";
import { DadosEstruturados } from "@/components/seo/DadosEstruturados";

validarConfig(config);

const jost = localFont({
  src: "./fonts/jost.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-sans",
});

const playfair = localFont({
  src: [
    { path: "./fonts/playfair.woff2", weight: "400 900", style: "normal" },
    { path: "./fonts/playfair-italic.woff2", weight: "400 900", style: "italic" },
  ],
  display: "swap",
  variable: "--font-serif",
});

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mtcapital.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "MT Capital — Assessoria em Leilão de Imóveis e Terrenos",
    template: "%s — MT Capital",
  },
  description:
    "Assessoria em leilão de imóveis e terrenos. Lemos o processo, calculamos o custo real da operação e dizemos até quanto vale a pena pagar. Do edital ao registro da matrícula.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "MT Capital",
    title: "MT Capital — Comprar bem começa antes do lance",
    description:
      "Comprar bem começa antes do lance. Analisamos o processo, calculamos o custo real e conduzimos tudo, do pregão ao registro.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Nonce por requisição, gerado em `proxy.ts` e repassado via cabeçalho
  // `x-nonce`. Usado abaixo no <script> de dados estruturados (JSON-LD) para
  // que a CSP (`script-src 'nonce-...'`) não bloqueie o script.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="pt-BR" className={`${jost.variable} ${playfair.variable}`}>
      <body>
        <a href="#conteudo" className="skip">Pular para o conteúdo</a>
        <SmoothScroll />
        <Nav />
        {children}
        {/* Botão flutuante de WhatsApp: elemento de posição fixa, presente em
            toda a página (como o <Nav /> acima), fora do fluxo de scroll do
            conteúdo — por isso mora aqui e não em app/page.tsx. No HTML de
            origem ele também é irmão do wrapper de scroll suave, não filho
            dele (referencia/index.html:754-756, logo após o </footer>). */}
        <WhatsAppFlutuante />
        <DadosEstruturados nonce={nonce} />
      </body>
    </html>
  );
}

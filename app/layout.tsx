import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/tokens.css";
import "@/styles/base.css";
import { config } from "@/content/config";
import { validarConfig } from "@/lib/config-guard";
import { Nav } from "@/components/sections/Nav";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { WhatsAppFlutuante } from "@/components/ui/WhatsAppFlutuante";

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mtcapital.com.br"),
  title: "MT Capital — Assessoria em Leilão de Imóveis e Terrenos",
  description:
    "Assessoria em leilão de imóveis e terrenos. Lemos o processo, calculamos o custo real da operação e dizemos até quanto vale a pena pagar. Do edital ao registro da matrícula.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      </body>
    </html>
  );
}

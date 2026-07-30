import { Hero } from "@/components/sections/Hero";
import { Pilares } from "@/components/sections/Pilares";
import { Esclarecimentos } from "@/components/sections/Esclarecimentos";
import { Mitos } from "@/components/sections/Mitos";
import { Especialidades } from "@/components/sections/Especialidades";
import { Esteira } from "@/components/sections/Esteira";
import { Processo } from "@/components/sections/Processo";
import { Oportunidades } from "@/components/sections/Oportunidades";
import { Casos } from "@/components/sections/Casos";
import { Depoimentos } from "@/components/sections/Depoimentos";
import { Equipe } from "@/components/sections/Equipe";
import { Guia } from "@/components/sections/Guia";
import { Faq } from "@/components/sections/Faq";
import { Cta } from "@/components/sections/Cta";
import { Rodape } from "@/components/sections/Rodape";
import { listarImoveisAbertos } from "@/lib/imoveis";

// Server Component assíncrono: busca os imóveis publicados no ponto único de
// leitura (lib/imoveis.ts) e repassa via prop para Oportunidades, que
// continua um componente simples e testável — sem saber de onde os dados
// vêm. Quando o painel administrativo existir, só o corpo de
// listarImoveisAbertos muda; nem aqui, nem em Oportunidades.tsx.
export default async function Home() {
  const imoveis = await listarImoveisAbertos();

  return (
    <>
      <main id="conteudo">
        <Hero />
        <Pilares />
        <Esclarecimentos />
        <Mitos />
        <Especialidades />
        <Esteira />
        <Processo />
        <Oportunidades imoveis={imoveis} />
        <Casos />
        <Depoimentos />
        <Equipe />
        <Guia />
        <Faq />
        <Cta />
      </main>
      <Rodape />
    </>
  );
}

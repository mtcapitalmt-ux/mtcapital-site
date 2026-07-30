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

export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <Pilares />
      <Esclarecimentos />
      <Mitos />
      <Especialidades />
      <Esteira />
      <Processo />
      <Oportunidades />
      <Casos />
      <Depoimentos />
      <Equipe />
      <Guia />
      <Faq />
      {/* Demais seções (Cta, Rodape)
          entram aqui, na ordem aprovada, pela Task 21. */}
    </main>
  );
}

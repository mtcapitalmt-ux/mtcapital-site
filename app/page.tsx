import { Hero } from "@/components/sections/Hero";
import { Pilares } from "@/components/sections/Pilares";
import { Esclarecimentos } from "@/components/sections/Esclarecimentos";
import { Mitos } from "@/components/sections/Mitos";
import { Especialidades } from "@/components/sections/Especialidades";
import { Esteira } from "@/components/sections/Esteira";
import { Processo } from "@/components/sections/Processo";
import { Oportunidades } from "@/components/sections/Oportunidades";

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
      {/* Demais seções (Casos, Depoimentos, Equipe, Guia, Faq, Cta, Rodape)
          entram aqui, na ordem aprovada, pelas Tasks 17-21. */}
    </main>
  );
}

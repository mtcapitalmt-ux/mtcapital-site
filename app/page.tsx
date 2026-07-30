import { Hero } from "@/components/sections/Hero";
import { Pilares } from "@/components/sections/Pilares";
import { Esclarecimentos } from "@/components/sections/Esclarecimentos";
import { Mitos } from "@/components/sections/Mitos";
import { Especialidades } from "@/components/sections/Especialidades";

export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <Pilares />
      <Esclarecimentos />
      <Mitos />
      <Especialidades />
      {/* Demais seções (Esteira, Processo, Oportunidades,
          Casos, Depoimentos, Equipe, Guia, Faq, Cta, Rodape) entram aqui,
          na ordem aprovada, pelas Tasks 14-21. */}
    </main>
  );
}

import { Hero } from "@/components/sections/Hero";
import { Pilares } from "@/components/sections/Pilares";
import { Esclarecimentos } from "@/components/sections/Esclarecimentos";
import { Mitos } from "@/components/sections/Mitos";

export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <Pilares />
      <Esclarecimentos />
      <Mitos />
      {/* Demais seções (Especialidades, Esteira, Processo, Oportunidades,
          Casos, Depoimentos, Equipe, Guia, Faq, Cta, Rodape) entram aqui,
          na ordem aprovada, pelas Tasks 13-21. */}
    </main>
  );
}

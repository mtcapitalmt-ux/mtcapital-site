import { Hero } from "@/components/sections/Hero";
import { Pilares } from "@/components/sections/Pilares";

export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <Pilares />
      {/* Demais seções (Esclarecimentos, Mitos, Especialidades,
          Esteira, Processo, Oportunidades, Casos, Depoimentos, Equipe, Guia,
          Faq, Cta, Rodape) entram aqui, na ordem aprovada, pelas Tasks 12-21. */}
    </main>
  );
}

import { faq } from "@/content/faq";
import { config } from "@/content/config";

// Dados estruturados (JSON-LD) para SEO: um único <script type="application/ld+json">
// carregando um array de dois objetos @graph-like (ProfessionalService + FAQPage),
// seguindo a convenção comum de "múltiplos grafos" com um array na raiz em vez de
// dois <script> separados — o Google aceita ambas as formas.
export function DadosEstruturados({ nonce }: { nonce?: string }) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mtcapital.com.br";

  const dados = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "MT Capital",
      description:
        "Assessoria em arrematação de imóveis e terrenos em leilão judicial e extrajudicial.",
      url: site,
      email: config.email,
      telephone: config.telefone,
      areaServed: "BR",
      address: {
        "@type": "PostalAddress",
        streetAddress: config.endereco.linha1,
        addressLocality: config.endereco.cidade,
        addressRegion: config.endereco.uf,
        postalCode: config.endereco.cep,
        addressCountry: "BR",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((p) => ({
        "@type": "Question",
        name: p.pergunta,
        acceptedAnswer: { "@type": "Answer", text: p.resposta },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // eslint-disable-next-line react/no-danger -- JSON-LD montado no servidor a partir de content/, sem entrada de usuário
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}

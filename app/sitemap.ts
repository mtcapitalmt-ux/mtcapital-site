import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mtcapital.com.br";
  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/privacidade`, changeFrequency: "yearly", priority: 0.3 },
  ];
}

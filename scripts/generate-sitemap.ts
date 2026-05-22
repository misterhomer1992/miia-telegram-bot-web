import { writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE_URL = process.env.VITE_SITE_URL ?? "https://miia.example.com";
const routes: { path: string; locale: "en" | "uk" | "pl" }[] = [
  { path: "/", locale: "en" },
  { path: "/uk/", locale: "uk" },
  { path: "/pl/", locale: "pl" },
];

const now = new Date().toISOString().slice(0, 10);

function urlEntry(path: string): string {
  const url = `${SITE_URL}${path}`;
  const alternates = routes
    .map(
      (r) =>
        `    <xhtml:link rel="alternate" hreflang="${r.locale}" href="${SITE_URL}${r.path}"/>`,
    )
    .join("\n");
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>
  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes.map((r) => urlEntry(r.path)).join("\n")}
</urlset>
`;

const out = join(process.cwd(), "build", "client", "sitemap.xml");
writeFileSync(out, xml, "utf-8");
console.log(`Wrote ${out}`);

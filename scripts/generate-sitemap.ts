import { config as loadEnv } from "dotenv";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Load .env.production (if it exists) then .env (fallback). NOOP if neither exists.
if (existsSync(".env.production")) loadEnv({ path: ".env.production" });
else if (existsSync(".env")) loadEnv({ path: ".env" });

const SITE_URL = process.env.VITE_SITE_URL ?? "https://miia.example.com";
const routes: { path: string; locale: "en" | "uk" | "pl" }[] = [
  { path: "/", locale: "en" },
  { path: "/uk", locale: "uk" },
  { path: "/pl", locale: "pl" },
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

const sitemapOut = join(process.cwd(), "build", "client", "sitemap.xml");
writeFileSync(sitemapOut, xml, "utf-8");
console.log(`Wrote ${sitemapOut}`);

const robotsXml = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
const robotsOut = join(process.cwd(), "build", "client", "robots.txt");
writeFileSync(robotsOut, robotsXml, "utf-8");
console.log(`Wrote ${robotsOut}`);

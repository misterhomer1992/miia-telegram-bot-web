import { config as loadEnv } from "dotenv";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Load .env.production (if it exists) then .env (fallback). NOOP if neither exists.
if (existsSync(".env.production")) loadEnv({ path: ".env.production" });
else if (existsSync(".env")) loadEnv({ path: ".env" });

const SITE_URL = process.env.VITE_SITE_URL ?? "https://miia.example.com";

const LOCALES = ["en", "uk", "pl"] as const;
type Locale = (typeof LOCALES)[number];

const PAGES = ["contact", "changelog", "privacy", "terms", "data-security"];

function homePath(locale: Locale): string {
  return locale === "en" ? "/" : `/${locale}`;
}

function pagePath(locale: Locale, slug: string): string {
  return locale === "en" ? `/${slug}` : `/${locale}/${slug}`;
}

type Group = { paths: { locale: Locale; path: string }[] };

const groups: Group[] = [
  { paths: LOCALES.map((locale) => ({ locale, path: homePath(locale) })) },
  ...PAGES.map((slug) => ({
    paths: LOCALES.map((locale) => ({ locale, path: pagePath(locale, slug) })),
  })),
];

const now = new Date().toISOString().slice(0, 10);

function urlEntry(group: Group, path: string): string {
  const url = `${SITE_URL}${path}`;
  const alternates = group.paths
    .map(
      (r) =>
        `    <xhtml:link rel="alternate" hreflang="${r.locale}" href="${SITE_URL}${r.path}"/>`,
    )
    .join("\n");
  const enPath = group.paths.find((p) => p.locale === "en")?.path ?? "/";
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${enPath}"/>
  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${groups.flatMap((g) => g.paths.map((p) => urlEntry(g, p.path))).join("\n")}
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

import { type RouteConfig, index, route } from "@react-router/dev/routes";

const PAGES = ["contact", "changelog", "privacy", "terms", "data-security"] as const;

function pageRoutes() {
  return PAGES.flatMap((slug) => {
    const id = slug.replace("-", "_");
    return [
      route(slug, `routes/${slug}.tsx`, { id: `${id}-en` }),
      route(`uk/${slug}`, `routes/${slug}.tsx`, { id: `${id}-uk` }),
      route(`pl/${slug}`, `routes/${slug}.tsx`, { id: `${id}-pl` }),
    ];
  });
}

export default [
  index("routes/landing.tsx"),
  route("uk", "routes/landing.tsx", { id: "landing-uk" }),
  route("pl", "routes/landing.tsx", { id: "landing-pl" }),
  ...pageRoutes(),
] satisfies RouteConfig;

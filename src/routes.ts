import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("uk", "routes/landing.tsx", { id: "landing-uk" }),
  route("pl", "routes/landing.tsx", { id: "landing-pl" }),
] satisfies RouteConfig;

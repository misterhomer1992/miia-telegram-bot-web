import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";

import resetHref from "./styles/reset.css?url";
import tokensHref from "./styles/tokens.css?url";
import fontsHref from "./styles/fonts.css?url";
import animationsHref from "./styles/animations.css?url";
import globalHref from "./styles/global.css?url";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: resetHref },
  { rel: "stylesheet", href: tokensHref },
  { rel: "stylesheet", href: fontsHref },
  { rel: "stylesheet", href: animationsHref },
  { rel: "stylesheet", href: globalHref },
];

export default function Root() {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

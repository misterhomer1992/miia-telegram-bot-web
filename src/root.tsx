import { Links, Meta, Outlet, Scripts, ScrollRestoration, useMatches } from "react-router";
import type { LinksFunction } from "react-router";

import resetHref from "./styles/reset.css?url";
import tokensHref from "./styles/tokens.css?url";
import fontsHref from "./styles/fonts.css?url";
import animationsHref from "./styles/animations.css?url";
import globalHref from "./styles/global.css?url";

import { themeScript, langRedirectScript } from "./lib/inline-scripts";

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
  const matches = useMatches();
  const id = matches[matches.length - 1]?.id ?? "";
  const lang = id === "landing-uk" ? "uk" : id === "landing-pl" ? "pl" : "en";

  return (
    <html lang={lang} data-theme="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: langRedirectScript }} />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

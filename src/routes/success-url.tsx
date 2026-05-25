import { useMatches } from "react-router";
import type { MetaFunction } from "react-router";
import { resources, setupI18n } from "~/i18n/config";
import { localeFromRouteId } from "~/i18n/route";
import { Nav } from "~/sections/Nav/Nav";
import { SubscriptionSuccess } from "~/sections/SubscriptionSuccess/SubscriptionSuccess";

export const meta: MetaFunction = (args) => {
  const id = args.matches[args.matches.length - 1]?.id ?? "";
  const locale = localeFromRouteId(id);
  const t = resources[locale].translation as { success: { meta: { title: string } } };
  return [
    { title: t.success.meta.title },
    // Transactional page reached only after checkout — keep it out of search.
    { name: "robots", content: "noindex" },
  ];
};

export default function SuccessUrl() {
  const matches = useMatches();
  const locale = localeFromRouteId(matches[matches.length - 1]?.id ?? "");
  setupI18n(locale);

  return (
    <>
      <Nav />
      <SubscriptionSuccess />
    </>
  );
}

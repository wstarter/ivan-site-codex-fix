import { getVisualAsset, type VisualAssetKey } from "@/lib/assets";
import { getWpAssets } from "@/lib/wp-bridge";

/**
 * Centralized bundled fallbacks for inner-page heroes.
 *
 * Appearance > Ivan Settings overrides are resolved explicitly at read time.
 * WordPress Featured Image override can be added here later once the theme
 * bridge safely exposes current-page thumbnail data.
 */
export const pageHeroFallbackKeys = {
  "/usluge": "uslugeHero",
  "/repertoar": "repertoireHero",
  "/instagram": "mediaHero",
  "/dopunski-programi": "additionalProgramsHero",
  "/kontakt": "contactHero",
  "/dostupni-termini": "calendarHero",
  "/faq": "faqHero",
  "/hvala": "thankYouHero",
  "/upit/svadba": "formWeddingHero",
  "/upit/korporativna-proslava": "formCorporateHero",
  "/upit/klupska-svirka": "formClubHero",
  "/upit/rodjendan-jubilej": "formBirthdayHero",
} as const satisfies Record<string, VisualAssetKey>;

export type PageHeroRoute = keyof typeof pageHeroFallbackKeys;

export function getPageHeroImage(route: PageHeroRoute): string | undefined {
  const fallbackKey = pageHeroFallbackKeys[route];
  const settingsSrc = getWpAssets()?.[fallbackKey]?.src?.trim();
  if (settingsSrc) return settingsSrc;

  const fallbackSrc = getVisualAsset(fallbackKey).src.trim();
  return fallbackSrc || undefined;
}

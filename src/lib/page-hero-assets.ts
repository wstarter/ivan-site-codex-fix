import { getVisualAsset, type VisualAsset, type VisualAssetKey } from "@/lib/assets";

/**
 * Centralized bundled fallbacks for inner-page heroes.
 *
 * `getVisualAsset()` already honors Appearance > Ivan Settings overrides before
 * returning the local fallback. WordPress Featured Image override can be added
 * here later once the theme bridge safely exposes current-page thumbnail data.
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

export function getPageHeroAsset(route: PageHeroRoute): VisualAsset {
  return getVisualAsset(pageHeroFallbackKeys[route]);
}

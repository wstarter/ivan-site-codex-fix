// ============================================================================
// CENTRALIZED VISUAL ASSETS REGISTRY
// ----------------------------------------------------------------------------
// Single source of truth for every image used across the site.
// Maps 1:1 to future WordPress fields (theme options / ACF / featured images).
//
// To swap an image, replace the file in `src/assets/images/` or change the
// `src` import here. Components MUST read images from this registry only.
// ============================================================================

import ivanTransparent from "@/assets/images/Ivan_Jovanovic_transparent.webp";
import formWedding from "@/assets/images/form-wedding-hero.jpg";
import formCorporate from "@/assets/images/form-corporate-hero.jpg";
import formClub from "@/assets/images/form-club-gastrobar-hero.jpg";
import formBirthday from "@/assets/images/form-birthday-jubilee-hero.jpg";
import workflowHero from "@/assets/images/workflow-performance.jpg";
import repertoireHero from "@/assets/images/repertoire-live-stage.jpg";
import mediaHero from "@/assets/images/media-instagram-preview.jpg";
import thankYouHero from "@/assets/images/thank-you-hero.jpg";
import contactHero from "@/assets/images/hero-ivan-live-performance.jpg";

export type VisualAsset = {
  src: string;
  alt: string;
  /** WordPress field mapping note — informational. */
  wpField?: string;
};

export const visualAssets = {
  // Homepage hero — the real transparent Ivan portrait. MUST stay.
  heroIvan: {
    src: ivanTransparent,
    alt: "Ivan Jovanović — live music performer",
    wpField: "theme_option.hero_image",
  },

  // Form page heroes (one per inquiry type)
  formWeddingHero: {
    src: formWedding,
    alt: "Elegant wedding live music atmosphere",
    wpField: "page_meta.upit_svadba.hero_image",
  },
  formCorporateHero: {
    src: formCorporate,
    alt: "Corporate event live music atmosphere",
    wpField: "page_meta.upit_korporativna.hero_image",
  },
  formClubHero: {
    src: formClub,
    alt: "Club and gastro bar live music atmosphere",
    wpField: "page_meta.upit_klupska.hero_image",
  },
  formBirthdayHero: {
    src: formBirthday,
    alt: "Birthday and jubilee live music atmosphere",
    wpField: "page_meta.upit_rodjendan.hero_image",
  },

  // Inner page heroes
  uslugeHero: {
    src: formCorporate,
    alt: "Premium live music services atmosphere",
    wpField: "page_meta.usluge.hero_image",
  },
  workflowHero: {
    src: workflowHero,
    alt: "Live event organization and performance atmosphere",
    wpField: "page_meta.nacin_rada.hero_image",
  },
  repertoireHero: {
    src: repertoireHero,
    alt: "Live band repertoire and stage performance",
    wpField: "page_meta.repertoar.hero_image",
  },
  mediaHero: {
    src: mediaHero,
    alt: "Instagram live music performance preview",
    wpField: "page_meta.instagram.hero_image",
  },
  additionalProgramsHero: {
    src: repertoireHero,
    alt: "Additional live music programs — DJ, saxophone, quartet",
    wpField: "page_meta.dopunski_programi.hero_image",
  },
  contactHero: {
    src: contactHero,
    alt: "Premium live music contact atmosphere",
    wpField: "page_meta.kontakt.hero_image",
  },
  calendarHero: {
    src: workflowHero,
    alt: "Live event calendar and planning atmosphere",
    wpField: "page_meta.dostupni_termini.hero_image",
  },
  faqHero: {
    src: workflowHero,
    alt: "Frequently asked questions — live music booking",
    wpField: "page_meta.faq.hero_image",
  },
  thankYouHero: {
    src: thankYouHero,
    alt: "Premium live music thank you confirmation",
    wpField: "page_meta.hvala.hero_image",
  },
} as const satisfies Record<string, VisualAsset>;

export type VisualAssetKey = keyof typeof visualAssets;

// ---------------------------------------------------------------------------
// WordPress asset override
// ---------------------------------------------------------------------------
// In production, `window.IvanTheme.assets[key].src` (set in WP Admin → Ivan
// Settings) overrides the locally-imported image. Local dev keeps the bundled
// asset. Alt text follows the same priority: WP first, local fallback second.

type MutableAsset = { src: string; alt: string };
if (typeof window !== "undefined" && window.IvanTheme?.assets) {
  const wpAssets = window.IvanTheme.assets;
  (Object.keys(visualAssets) as Array<keyof typeof visualAssets>).forEach((k) => {
    const wp = wpAssets[k as string];
    if (!wp) return;
    const target = visualAssets[k] as MutableAsset;
    if (typeof wp.src === "string" && wp.src.length > 0) target.src = wp.src;
    if (typeof wp.alt === "string" && wp.alt.length > 0) target.alt = wp.alt;
  });
}

/**
 * Read a visual asset honoring the WordPress override (if any).
 * Components that need explicit dynamic resolution should use this helper;
 * existing direct `visualAssets.xxx` reads still work because the override
 * runs once at module init.
 */
export function getVisualAsset(key: VisualAssetKey): VisualAsset {
  return visualAssets[key];
}

/**
 * Centralized form configuration.
 * Single source of truth for budget bounds and future CF7 shortcode mapping.
 */

export type FormKey = "wedding" | "corporate" | "club" | "birthday";

export const budgetConfig = {
  currency: "€",
  min: 500,
  max: 50000,
  step: 500,
  defaults: {
    wedding: 3500,
    corporate: 5000,
    club: 3000,
    birthday: 3000,
  } satisfies Record<FormKey, number>,
};

// WordPress override: when `window.IvanTheme.budget` is present (production),
// merge it into the local config so React and CF7 stay in sync. Local dev keeps
// the literal defaults above. Single-handle slider only — Od/Do range is gone.
if (typeof window !== "undefined") {
  const wp = window.IvanTheme?.budget;
  if (wp) {
    if (typeof wp.min === "number" && wp.min >= 0) budgetConfig.min = wp.min;
    if (typeof wp.max === "number" && wp.max > budgetConfig.min) budgetConfig.max = wp.max;
    if (typeof wp.step === "number" && wp.step > 0) budgetConfig.step = wp.step;
    if (wp.defaults) {
      (Object.keys(budgetConfig.defaults) as FormKey[]).forEach((k) => {
        const v = wp.defaults?.[k];
        if (typeof v === "number") budgetConfig.defaults[k] = v;
      });
    }
  }
}

/** EU/Serbian thousands formatting with dot separator. */
export function formatBudget(value: number): string {
  return `${Math.round(value).toLocaleString("de-DE")}${budgetConfig.currency}`;
}

/** CF7 shortcode slot mapping. Populated later in WordPress theme options. */
export const cf7Forms = {
  wedding:   { shortcodeKey: "wedding",   futureShortcodeSetting: "ivan_cf7_wedding" },
  corporate: { shortcodeKey: "corporate", futureShortcodeSetting: "ivan_cf7_corporate" },
  club:      { shortcodeKey: "club",      futureShortcodeSetting: "ivan_cf7_club" },
  birthday:  { shortcodeKey: "birthday",  futureShortcodeSetting: "ivan_cf7_birthday" },
} satisfies Record<FormKey, { shortcodeKey: string; futureShortcodeSetting: string }>;

/** Honeypot field name — must match across forms and any future server validation. */
export const HONEYPOT_FIELD = "company_site";
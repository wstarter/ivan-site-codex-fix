/**
 * WordPress bridge reader.
 *
 * Safely consumes `window.IvanTheme` (populated by the WordPress theme via
 * `wp_localize_script` before the React bundle loads). All accessors are
 * SSR/local-dev safe: if `window` or `IvanTheme` is missing, they return
 * `null` (or sensible empty fallbacks) so the React frontend keeps using its
 * local defaults.
 */

export type WpMenuItem = {
  label: string;
  url: string;
  /** Path component (e.g. "/usluge") when the menu item points at this site. */
  path?: string;
  classes?: string[];
  children?: WpMenuItem[];
};

export type WpForm = {
  key: string;
  title?: string;
  shortcode?: string;
  html?: string;
  cf7Active?: boolean;
  futureShortcodeSetting?: string;
};

export type WpAsset = { src?: string; alt?: string };

export type IvanTheme = {
  siteUrl?: string;
  themeUrl?: string;
  distUrl?: string;
  assetsUrl?: string;
  restUrl?: string;
  ajaxUrl?: string;
  nonce?: string;
  primaryMenu?: WpMenuItem[];
  footerMenu?: WpMenuItem[];
  contact?: { phone?: string; email?: string; instagram?: string; whatsapp?: string };
  hero?: WpAsset;
  assets?: Record<string, WpAsset>;
  forms?: Record<string, WpForm>;
  availability?: { unavailableDates?: Array<{ date: string; status?: string; label?: string }> };
  budget?: {
    currency?: string;
    min?: number;
    max?: number;
    step?: number;
    defaults?: Partial<Record<"wedding" | "corporate" | "club" | "birthday", number>>;
  };
  pixel?: { id?: string; leadEnabled?: boolean; fireOn?: string; thankYouPath?: string };
  cookies?: { enabled?: boolean; text?: string; privacyUrl?: string };
  seo?: { siteName?: string; tagline?: string; locale?: string; ogImage?: string };
};

declare global {
  interface Window {
    IvanTheme?: IvanTheme;
    /** CF7 runtime global, only present when the WP plugin loads its JS. */
    wpcf7?: { init?: (form: HTMLFormElement) => void } & Record<string, unknown>;
  }
}

export function getIvanTheme(): IvanTheme | null {
  if (typeof window === "undefined") return null;
  return window.IvanTheme ?? null;
}

export function getWpMenu(location: "primary" | "footer"): WpMenuItem[] | null {
  const t = getIvanTheme();
  if (!t) return null;
  const m = location === "primary" ? t.primaryMenu : t.footerMenu;
  return Array.isArray(m) && m.length > 0 ? m : null;
}

export function getWpContact() {
  return getIvanTheme()?.contact ?? null;
}

export function getWpAssets() {
  return getIvanTheme()?.assets ?? null;
}

export function getWpForms() {
  return getIvanTheme()?.forms ?? null;
}

export function getWpForm(key: string): WpForm | null {
  const forms = getWpForms();
  return forms?.[key] ?? null;
}

export function getWpAvailability() {
  return getIvanTheme()?.availability ?? null;
}

export function getWpBudget() {
  return getIvanTheme()?.budget ?? null;
}

export function getWpPixel() {
  return getIvanTheme()?.pixel ?? null;
}

export function getWpCookies() {
  return getIvanTheme()?.cookies ?? null;
}
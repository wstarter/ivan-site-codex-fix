# Ivan Sedative Band — WordPress Theme

A thin **React/Vite SPA wrapper** WordPress theme. WordPress handles admin,
menus, settings, CF7, and asset enqueueing. React owns all rendering.

## 1. Install

1. Zip the `ivan-sedative-theme/` folder.
2. WordPress → Appearance → Themes → Add New → Upload Theme.
3. Activate. On activation, default pages and a default "Ivan Primary" menu
   are created (existing pages/menus are never overwritten).
4. Optional: run **Tools → Ivan: setup pages** to re-create stubs.

## 2. Build & ship the React app

From the project root, the full WP build pipeline is one command:

    npm install
    npm run build:theme

`build:theme` runs:

1. **`build:wp`** → `vite build --outDir dist-wp --emptyOutDir`
   Produces a client-only Vite build with `.vite/manifest.json`.
2. **`copy:wp`** → `node scripts/copy-wp-build.mjs`
   Locates the client build (checks `dist-wp/`, `dist-wp/client/`,
   `.output/public/`, `dist/client/`, `dist/` in that order) and copies
   `.vite/manifest.json` + `assets/index-*.{js,css}` into
   `wordpress-theme/ivan-sedative-theme/assets/app/`. The destination is
   wiped first; sibling folders (`admin/`, theme PHP files) are untouched.

> **Note on TanStack Start.** This project uses the TanStack Start +
> Cloudflare Vite plugin. The default `npm run build` emits an SSR-aware
> bundle; the WP wrapper only needs the client bundle. The copy script
> handles both shapes — if `build:wp` does not produce a flat `dist-wp/`
> SPA on your machine, run `npm run build` instead, then `npm run copy:wp`
> (the script will find the client subfolder automatically).

**Sanity checks after `build:theme`:**

    ls wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json
    ls wordpress-theme/ivan-sedative-theme/assets/app/assets/index-*.js
    ls wordpress-theme/ivan-sedative-theme/assets/app/assets/index-*.css

`inc/enqueue.php` reads `.vite/manifest.json` for hashed filenames; if the
manifest is missing it falls back to scanning `assets/app/assets/index-*.{js,css}`.

### Package the theme ZIP

    npm run zip:theme

Produces `wordpress-theme/ivan-sedative-theme.zip` containing **only** the
theme folder (no `node_modules`, no `src/`, no `dist-wp/`, no project root
files). Equivalent manual command:

    cd wordpress-theme
    zip -r ivan-sedative-theme.zip ivan-sedative-theme \
      -x "*.DS_Store" "__MACOSX/*"

## 3. Configure the theme

**Appearance → Ivan Settings** — no paid plugins required:

- Contact (phone, email, Instagram, WhatsApp)
- Visual assets (15 hero/OG slots, WP media picker)
- CF7 shortcodes per form (wedding / corporate / club / birthday)
- Budget min/max/step + per-form defaults (defaults: 500 / 50000 / 500)
- Meta Pixel ID + enable toggle
- Cookie banner toggle / text / privacy URL
- Unavailable calendar dates (JSON array)

All values flow into `window.IvanTheme` before React mounts.

## 4. Required & recommended plugins

**Required**

- Contact Form 7

**Recommended**

- Flamingo (stores every CF7 submission automatically)
- Cloudflare Turnstile *or* reCAPTCHA v3 CF7 integration
- CF7 Honeypot (or honeypot rule on `company_site` field)
- Rank Math *or* Yoast SEO
- WP Mail SMTP (deliverability)
- Cookie consent plugin (legal review required if Pixel is enabled)

The theme does NOT bundle CAPTCHA keys, SEO meta, or consent logic.

## 5. Contact Form 7 templates

Create one CF7 form per inquiry type and paste its shortcode/ID into
**Appearance → Ivan Settings → CF7 form shortcodes**.

Required shared fields (names MUST match the React payload):

    [text* full_name]
    [tel*  phone]
    [email* email]
    [acceptance consent] Saglasan sam da me kontaktirate u vezi upita
    [number budget min:500 max:50000 step:500]
    [text company_site class:ivan-honeypot]   ← honeypot, hide via CSS

Form-specific extras are documented inline in `inc/cf7-bridge.php`.

All forms redirect to `/hvala` on success. If Pixel is enabled, the theme
automatically fires `fbq('track', 'Lead')` on the `wpcf7mailsent` event and
then redirects — **never** on button click or validation error.

## 6. `window.IvanTheme` bridge

Built in `inc/ivan-theme-data.php`, injected before the React bundle:

    window.IvanTheme = {
      siteUrl, themeUrl, distUrl, assetsUrl, restUrl, ajaxUrl, nonce,
      primaryMenu, footerMenu,
      contact:  { phone, email, instagram, whatsapp },
      hero:     { src, alt },
      assets:   { heroIvan, formWeddingHero, ..., ogImage },
      forms:    { wedding: { key, title, shortcode, html, cf7Active }, ... },
      availability: { unavailableDates: [{ date, status, label, note, source }] },
      budget:   { currency, min, max, step, defaults: { wedding, ... } },
      pixel:    { id, leadEnabled, fireOn, thankYouPath },
      cookies:  { enabled, text, privacyUrl },
      seo:      { siteName, tagline, locale, ogImage }
    };

React reads each key and falls back to its local config when a value is empty.

## 7. SPA fallback

`inc/spa-rewrites.php` ensures direct URLs (`/upit/svadba`, `/repertoar`, …)
serve the React shell with HTTP 200 even when no matching WP page exists.
Excludes: `/wp-admin`, `/wp-login.php`, `/wp-json`, `/wp-content`,
`/wp-includes`, `/xmlrpc.php`, `/feed`, and any path ending in a file
extension.

## 8. Calendar

`window.IvanTheme.availability.unavailableDates` is the single source of
truth. Manage from **Ivan Settings → Calendar** as JSON:

    [
      { "date": "2026-05-03", "status": "unavailable",
        "label": "Zauzeto", "note": "", "source": "manual" }
    ]

The calendar is informational only — no clicks, no booking, no payment.

## 9. Known limitations

- Calendar admin UI is a JSON textarea (v1); replace with ACF repeater later.
- React app must still be built & uploaded manually (no CI step bundled).
- No CAPTCHA bundled; pick a CF7-compatible plugin per project.
- Pixel Lead requires CF7; the React fallback prototype does NOT fire Lead.

## 10. Next steps after GitHub export

1. Push `wordpress-theme/ivan-sedative-theme/` to its own repo (or as a subfolder).
2. CI: run `npm run build` and copy `dist/*` → `assets/app/`.
3. Install + activate on staging WP, install CF7 + Flamingo, fill in settings.
4. Create the 4 CF7 forms, paste shortcodes into Ivan Settings.
5. Verify `/upit/svadba` etc. resolve, forms submit, Pixel Lead fires.

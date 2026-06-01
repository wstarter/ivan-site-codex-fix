# Sprint 1.2.1 Live Glass and Portrait Overlay Report

## 1. Result

The narrow visual reliability patch is complete. The WordPress theme was rebuilt, packaged, and verified directly from the final installable ZIP.

- Final theme version: `1.0.11`
- WordPress asset cache version: `1.0.11`
- React: `18.3.1`
- React DOM: `18.3.1`
- Final ZIP: `C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`
- ZIP SHA-256: `87188ED7AED5169946C548040E02BE471FD11B0628520AADAB5D6504544AC850`
- ZIP size: `3215038` bytes

## 2. Changed Files

Source files:

- `src/styles.css`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/functions.php`

Generated WordPress build assets and `wordpress-theme/ivan-sedative-theme.zip` were refreshed by the requested build and packaging commands.

No FAQ, Repertoar, form, route, CF7 bridge, calendar bridge, WordPress mount, or interaction-safety files were changed.

## 3. Baseline Verification

Verified before editing:

- Branch: `sprint-1-1-hero-typography-corrections`
- React: `18.3.1`
- React DOM: `18.3.1`
- WordPress theme header version: `1.0.10`
- `src/wp-entry.tsx`: present
- `src/lib/interaction-safety.ts`: present
- `vite.wp.config.ts`: present
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`: present
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`: present
- `package-lock.json`: absent

## 4. Local Preview vs Live WordPress Diagnosis

The `1.0.10` installable ZIP already contained the intended glass rules:

- `backdrop-filter`
- `-webkit-backdrop-filter`
- panel `isolation`
- panel `overflow: hidden`
- reflective `::before`
- inner-edge `::after`

The mismatch was not caused by the WordPress build omitting the glass CSS.

Two reliability problems remained:

1. `wordpress-theme/ivan-sedative-theme/functions.php` still defined `IVAN_THEME_VERSION` as `1.0.0`. WordPress uses this constant when enqueueing the CSS and JavaScript assets. That stale cache key could allow a live installation, browser cache, or intermediary cache to continue serving older theme assets after a ZIP update.
2. The panel sits over a mostly black hero area. Backdrop blur is naturally subtle when the pixels behind the panel have very little visual variation. Relying on blur alone makes the live effect fragile even when the CSS is loaded correctly.

No production URL was provided for direct remote inspection. The diagnosis is based on the theme enqueue code, the previous installable ZIP, the generated manifest, local browser QA, and direct inspection of the final ZIP.

## 5. Glassmorphism Reliability Changes

The desktop metrics panel keeps the same four-column layout and restrained dark-luxury character.

Changed in `src/styles.css`:

- Added explicit `position: relative`
- Preserved `overflow: hidden`
- Preserved `isolation: isolate`
- Preserved both `backdrop-filter` and `-webkit-backdrop-filter`
- Preserved `blur(30px) saturate(135%) contrast(108%)`
- Added a reliable translucent fallback surface: `rgba(8, 8, 8, 0.42)`
- Increased the panel reflection from `rgba(255,255,255,0.10)` to `rgba(255,255,255,0.13)`
- Increased the dark translucent gradient surface slightly
- Increased the directional sheen in `::before`
- Preserved the reflective inner-edge `::after`

Changed in `wordpress-theme/ivan-sedative-theme/functions.php`:

- Updated `IVAN_THEME_VERSION` from `1.0.0` to `1.0.11`

The final ZIP now carries a new hashed CSS file and a matching WordPress cache version.

## 6. Mobile Dark Face Overlay Diagnosis

The source portrait asset has intentional directional lighting. Ivan's left face area is naturally dark in the original image.

CSS was still making the darkness more pronounced on mobile. The horizontal `.hero-readability` gradient stayed partially opaque across the face area before becoming transparent.

The portrait mask, opacity, size, right anchoring, and desktop portrait treatment were audited. No separate portrait pseudo-element, blend mode, or hidden image veil was found.

## 7. Mobile Face Visibility Changes

Changed only the mobile `.hero-readability` horizontal gradient:

Now:

- `0.96` opacity at `34%`
- `0.60` opacity at `40%`
- `0.16` opacity at `48%`
- Transparent at `58%`

The important change from `1.0.10` is that the veil now falls away much sooner:

- Previous `1.0.10` fade still reached `0.28` at `54%`, `0.08` at `66%`, and transparent at `78%`
- New `1.0.11` fade reaches `0.16` at `48%` and transparent at `58%`

Preserved:

- Portrait width at `390px` viewport: `390px`
- Portrait right offset at `390px` viewport: `-39px` (`-10vw`)
- Portrait top offset: `-14px`
- Portrait opacity: `1`
- Portrait filter: `brightness(1.14) contrast(1.02)` plus the existing shadow
- No glow or grey halo
- Desktop portrait rules unchanged

## 8. Metrics Icon and Spacing Changes

Desktop:

- Icon size increased from `40px` to `44px`
- Icon-to-content gap increased from `18px` to `22px`
- Metric item minimum height increased from `5.75rem` to `6rem`

Mobile:

- Icon size increased from `26px` to `28px`
- Icon-to-content gap increased from approximately `10.4px` to `12.8px`

All four metrics remain visible on mobile.

## 9. Local Browser QA

Preview:

`http://127.0.0.1:4173/`

Mobile QA at `390x844`:

- Portrait width: `390px`
- Portrait right offset: `-39px`
- Portrait top offset: `-14px`
- Portrait opacity: `1`
- Portrait filter: `brightness(1.14) contrast(1.02)` plus existing shadow
- Horizontal readability veil: transparent by `58%`
- Mobile metrics: four visible items
- Mobile metrics grid: two columns
- Mobile icon size: `28px`
- Mobile metric gap: `12.8px`

Desktop QA at `1440x1000`:

- Portrait width: `720px`
- Portrait x-position: `720px`
- Desktop portrait filter: original shadow only
- Metrics panel width: `1240px`
- Metrics grid: four equal `277.5px` columns
- Dividers: present
- Desktop icon size: `44px`
- Desktop metric gap: `22px`
- Primary CTA: single-line
- Panel fallback background: `rgba(8, 8, 8, 0.42)`
- Panel blur: `blur(30px) saturate(1.35) contrast(1.08)`

## 10. Font Loading

Font loading did not regress.

- Google Fonts import remains first in built CSS
- `Bebas Neue`: present
- `Manrope`: present
- Previous import-order warning did not reappear during the production build

## 11. Preserved Areas

Confirmed unchanged:

- FAQ
- Repertoar
- Forms
- Route structure
- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/form/Cf7FormSlot.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## 12. Build Command

```text
npm run build:theme
```

Result: passed.

## 13. ZIP Command

```text
npm run zip:theme
```

Result: passed.

## 14. Final ZIP Path

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

## 15. Final ZIP Verification

Verified directly inside `wordpress-theme/ivan-sedative-theme.zip`:

- Theme header version: `1.0.11`
- WordPress enqueue cache version: `1.0.11`
- ZIP entry count: `35`
- Manifest exists: yes
- Manifest WordPress entry: `src/wp-entry.tsx`
- Entry marked `isEntry: true`
- Entry JS: `assets/index-BE4QwaR4.js`
- Entry CSS: `assets/styles-o-GaqTOy.css`
- React runtime `18.3.1`: present
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- Root `/assets/` references: `0`
- `Allura`: absent
- `cursive`: absent
- `Bebas Neue`: present
- `Manrope`: present
- Gold token `#b79775`: present
- `PROVERI DOSTUPNE TERMINE`: present
- `POGLEDAJ VIDEO KAKO RADIMO`: present
- `POŠALJI UPIT`: present
- `Video snimanje pre rezervacije`: absent
- Interaction-safety markers: present
- Body and HTML unlock logic: present
- Deferred CF7 initialization support: present
- `package-lock.json`: absent
- CF7 bridge: unchanged
- Calendar bridge: unchanged
- `wp-entry.tsx`: unchanged
- `interaction-safety.ts`: unchanged
- `wp-bridge.ts`: unchanged
- Updated mobile portrait veil rule: present
- Updated mobile and desktop metric icon sizing: present
- Updated metric spacing: present
- Reliable glass fallback surface: present
- `backdrop-filter`: present
- `-webkit-backdrop-filter`: present
- Glass pseudo-layers: present
- Four-column desktop metric grid: present
- Desktop dividers: present
- Desktop CTA no-wrap rule: present

## 16. Limitations and Warnings

- The portrait asset intentionally contains strong left-side face shadow. The additional CSS veil now clears sooner, but fully removing the natural shadow would require editing or replacing the asset.
- Backdrop blur remains naturally subtle over a nearly black background. The new fallback surface and reflections make the glass treatment more reliable, but the underlying hero still limits how dramatic a true blur can appear.
- No live production URL was provided, so remote cache state and CDN behavior could not be inspected directly.
- A temporary external Vite command shim was used because the Bun-generated local Vite launcher does not execute correctly when invoked directly in this environment. The helper was removed after packaging, and the local launcher was restored.

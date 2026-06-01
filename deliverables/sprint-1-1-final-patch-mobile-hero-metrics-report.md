# Sprint 1.1 Final Patch - Mobile Hero and Metrics Polish

Date: 2026-06-01

## 1. Changed files

Source files changed:

- `src/routes/index.tsx`
- `src/styles.css`
- `wordpress-theme/ivan-sedative-theme/style.css`

Generated build/package output refreshed:

- `dist-wp/`
- `wordpress-theme/ivan-sedative-theme/assets/app/`
- `wordpress-theme/ivan-sedative-theme.zip`

Report added:

- `deliverables/sprint-1-1-final-patch-mobile-hero-metrics-report.md`

## 2. Baseline verification before changes

Baseline checks passed before edits:

- Branch from `.git/HEAD`: `sprint-1-1-hero-typography-corrections`
- `package.json` React: `18.3.1`
- `package.json` React DOM: `18.3.1`
- WordPress theme version before patch: `1.0.6`
- `package-lock.json`: absent

Required files existed:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/components/site/MobileMenu.tsx`
- `src/components/site/form/Cf7FormSlot.tsx`
- `vite.wp.config.ts`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## 3. Mobile hero image positioning changes

The mobile portrait is no longer a full central image behind the hero copy.

Mobile CSS now uses a right/top portrait accent:

- Base mobile: `top: 102px`, `right: -24vw`, `width: 72vw`
- Up to `430px`: `right: -25vw`, `width: 74vw`
- Up to `390px`: `right: -27vw`, `width: 74vw`
- Up to `360px`: `right: -29vw`, `width: 76vw`
- `object-position: top right`
- A right-biased radial mask preserves a soft edge into the black background.

The hero stage begins below the mobile header. With the `top: 102px` stage-relative offset, the visible portrait begins approximately `25px` below the header boundary.

Computed QA at `390x844`:

- Portrait visible box begins near `x: 207px`, `y: 179px`
- Hero title lane ends near `x: 212px`
- Effective title/portrait edge overlap is approximately `5px`
- `SEDATIVE BAND` overlap with the portrait box is `0px`

## 4. Mobile hero typography changes

The existing font families remain unchanged:

- Display/headings: `Bebas Neue`
- Body/UI: `Manrope`

Mobile visual normalization:

- Hero title reduced to `clamp(2.85rem, 12.4vw, 3.8rem)`
- Hero title line height normalized to `0.92`
- Hero title letter spacing reduced to `0.005em`
- Title and eyebrow lanes constrained to `12rem`
- Band name reduced to `clamp(1.8rem, 8.2vw, 2.3rem)`
- FEAT, support rule, and support name tracking reduced slightly
- Paragraph and CTA structure remain unchanged

No new font, cursive font, serif font, or Allura reference was added.

## 5. Mobile hero text and CTA visibility verification

Verified at `390x844`:

- Text remains left aligned.
- Portrait is a right/top accent instead of the central text background.
- Primary CTA remains present.
- Secondary CTA remains present.
- Video CTA remains present.
- Video CTA top is approximately `665px`, so it is visible before the `844px` fold.
- Mobile hero metrics begin below the CTA group.

## 6. Mobile menu active radius fix

The menu behavior and body lock logic were not modified.

The active row now uses:

```css
border-radius: 0.65rem !important;
```

The final ZIP built CSS contains the rounded active-state rule.

## 7. Desktop metrics glassmorphism polish

Desktop metrics remain inside one shared panel and now use a stronger glass treatment:

- Dark translucent gradient.
- `blur(22px) saturate(115%)`.
- Thin champagne/gold border.
- Subtle inner highlight.
- Subtle inner lower edge.
- Restrained outer shadow.
- Existing black hero background remains visible through the panel.

Computed desktop QA at `1440x1000`:

- Panel width: approximately `1240px`
- Panel backdrop filter: `blur(22px) saturate(1.15)`
- Panel background: translucent `135deg` dark gradient
- Panel border: `1px solid`

## 8. Desktop metrics divider implementation

Desktop-only subtle gold dividers were added:

```css
.hero-metric-item + .hero-metric-item {
  border-left: 1px solid color-mix(in oklab, var(--color-gold-main) 22%, transparent);
}
```

The divider rule lives inside the desktop media query, so mobile remains free of vertical dividers.

## 9. Desktop metrics alignment and balance fix

Each desktop metric now occupies one equal column:

```css
grid-template-columns: repeat(4, minmax(0, 1fr));
```

Computed QA:

- Four columns.
- Each column is approximately `277.5px`.
- Each item is centered consistently.
- Panel aligns with the hero content width.

## 10. Mobile metrics restored to lighter behavior

The heavy glass panel is now desktop-only.

Mobile metrics use:

- Transparent background.
- No panel border.
- No backdrop blur.
- No shadow.
- Compact three-column rhythm.

Computed mobile QA:

- Background: transparent.
- Border: `0px`.
- Backdrop filter: `none`.
- Shadow: `none`.

## 11. Desktop CTA one-line verification

Verified in source, computed desktop QA, and final ZIP CSS:

- `PROVERI DOSTUPNE TERMINE` remains unchanged.
- `.hero-cta-primary` contains `white-space: nowrap`.
- Computed desktop CTA white space: `nowrap`.

## 12. Hero color and background blend verification

Verified:

- Hero paragraph lines resolve to `rgb(245, 240, 232)`.
- `PRIME MUSIC PRODUCTION` resolves to `rgb(184, 175, 163)`.
- Background remains black/near-black.
- No strong radial glow was introduced.
- Desktop and mobile masks remain present.
- Mobile readability overlay now includes a left-to-right black text lane plus the existing lower fade.
- No visible image rectangle is introduced by the CSS.

## 13. FAQ confirmation

FAQ content and structure were not modified.

## 14. Repertoar / Nacin rada confirmation

Repertoar content, Nacin rada content, and their structure were not modified or merged.

## 15. Route structure confirmation

Routing architecture was not changed.

## 16. Protected runtime and bridge file confirmation

SHA-256 hashes were captured before edits and checked again after build/package. All remained unchanged:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/form/Cf7FormSlot.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## 17. Build command used

```text
npm run build:theme
```

## 18. ZIP command used

```text
npm run zip:theme
```

## 19. Final ZIP path

```text
C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip
```

## 20. Verification from final ZIP itself

The final installable ZIP was opened and inspected directly.

Passed:

- Theme version: `1.0.7`
- ZIP entries: `35`
- Manifest exists.
- Manifest entry: `src/wp-entry.tsx`
- Built JS: `assets/index-DQMr3gN2.js`
- Built CSS: `assets/styles-ByFVjR7u.css`
- Built React runtime marker: `18.3.1`
- Source dependencies: React `18.3.1`, React DOM `18.3.1`
- `hydrateRoot(document)` count: `0`
- `createRoot`: present
- Root `/assets/` reference count: `0`
- `Allura`: absent
- `cursive`: absent
- `#b79775`: present
- `PROVERI DOSTUPNE TERMINE`: present
- `POGLEDAJ VIDEO KAKO RADIMO`: present
- Instagram URL `https://www.instagram.com/p/DP3oHrNiHSD/`: present
- Inquiry submit label: present
- `Video snimanje pre rezervacije`: absent
- Interaction safety markers: present
- `package-lock.json`: not introduced and absent from ZIP
- Mobile right/top portrait positioning CSS: present
- Mobile text-lane overlay CSS: present
- Rounded mobile-menu active-state CSS: present
- Desktop glass metrics CSS: present
- Desktop metrics divider CSS: present
- Equal-width desktop metrics grid CSS: present
- Lightweight mobile metrics CSS: present
- Desktop CTA nowrap CSS: present

## 21. Warnings

Non-blocking build warning:

- Vite CSS optimization still reports the existing Google Fonts `@import` ordering warning.

Local preview warnings:

- The local non-WordPress preview entry still reports the existing hydration mismatch warnings from `src/routes/__root.tsx`.
- During this run, that existing local hydration mismatch prevented a reliable click-through verification of the opened mobile menu state. The menu behavior code and protected interaction safety files were not modified. The final ZIP CSS contains the rounded active-state rule.
- The WordPress install ZIP independently verifies `src/wp-entry.tsx`, `createRoot`, and zero `hydrateRoot(document)`.

Tooling note:

- The Bun-generated `node_modules/.bin/vite.exe` launcher could not start Vite directly. A temporary external Vite command shim was used while running the npm wrapper, and the original launcher was restored immediately after the build. No dependency installation or source dependency modification was performed.

## Commit / push status

- No commit created.
- No push performed.


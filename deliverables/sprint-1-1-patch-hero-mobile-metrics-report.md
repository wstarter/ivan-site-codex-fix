# Sprint 1.1 Patch - Hero Position, Mobile Typography, Metrics Glass Panel

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

- `deliverables/sprint-1-1-patch-hero-mobile-metrics-report.md`

## 2. Baseline verification before changes

Baseline checks passed before edits:

- Branch from `.git/HEAD`: `sprint-1-1-hero-typography-corrections`
- `package.json` React: `18.3.1`
- `package.json` React DOM: `18.3.1`
- `bun.lock` React: `18.3.1`
- `bun.lock` React DOM: `18.3.1`
- WordPress theme version before patch: `1.0.5`
- `package-lock.json`: absent

Required files existed:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/components/site/MobileMenu.tsx`
- `src/components/site/form/Cf7FormSlot.tsx`
- `vite.wp.config.ts`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## 3. Hero text block position changes

Hero content padding was reduced at desktop, tablet, and mobile breakpoints.

- Desktop hero content shifted upward by approximately 14-18px.
- Mobile hero content shifted upward by approximately 20-30px.
- The mobile video CTA is now visible earlier in the viewport.
- Header clearance, CTA visibility, and metrics remain intact.

Mobile QA at `390x844`:

- Video CTA top: approximately `674px`
- Video CTA is visible before the fold.

## 4. Ivan image position changes

The portrait was lifted while keeping the image mask and dark blend intact.

- Mobile portrait top offsets moved upward by `16px`.
- Desktop portrait height changed from `98%` to `101%`, preserving the bottom anchor while lifting the visible portrait.
- Face/head remain visible and are not clipped by the header.

## 5. Mobile typography consistency changes

The mobile presentation continues to use the same two-font system as desktop:

- Display/headings: `Bebas Neue`
- Body/UI: `Manrope`

Mobile-specific scale, line height, and letter spacing were normalized for:

- Homepage hero title
- Homepage band name
- Homepage slogan
- Homepage eyebrow
- Mobile menu labels
- Mobile inquiry title
- Mobile form labels and helper text
- Mobile metric numbers and labels

No third font was introduced. No cursive, serif, or Allura UI font was added.

## 6. Live Music Experience eyebrow changes

The hero eyebrow was reduced to a supporting Manrope label:

- Desktop clamp: `0.64rem` to `0.76rem`
- Mobile size: `0.62rem`
- Letter spacing reduced on desktop and mobile.
- Champagne/gold-muted treatment remains restrained.

## 7. FEAT. / SEDATIVE BAND verification

Verified:

- `FEAT.` remains visually secondary.
- `SEDATIVE BAND` remains separate, readable, and gold.
- The two labels remain stacked on desktop and mobile.

## 8. Hero text color verification

Verified:

- Both slogan rows use `var(--color-text-main)`, which resolves to `rgb(245, 240, 232)`.
- `PRIME MUSIC PRODUCTION` uses `var(--color-text-muted)`, which resolves to `rgb(184, 175, 163)`.

## 9. Hero background/image blend verification

Verified and preserved:

- Black/near-black hero background.
- No grey radial glow was reintroduced.
- Existing radial portrait masks remain present in the built CSS.
- Desktop readability overlay continues to fade the portrait edge into black.
- No visible rectangular image boundary was observed in desktop or mobile visual QA.

## 10. Metrics glassmorphism implementation

The metrics are now wrapped in one shared premium glass panel:

- Dark translucent background.
- Thin champagne/gold border.
- Subtle inner highlight and shadow.
- Backdrop blur.
- Shared responsive panel with restrained spacing.
- Metrics remain individual content columns inside one unified panel.

Compiled CSS includes:

- `.hero-metrics-panel`
- Background compiled as `#080808ad`
- Gold border with `color-mix(...)`
- `-webkit-backdrop-filter: blur(14px)`
- Inner highlight shadow

## 11. Separator line removal

Removed:

- Metrics top divider.
- Hero section bottom border.

The page-wide horizontal separator below the metrics is no longer present. The metrics panel keeps its own contained border.

## 12. Hero CTA one-line verification

Verified in source, local preview, and final ZIP CSS:

- `PROVERI DOSTUPNE TERMINE` remains unchanged.
- `.hero-cta-primary` includes `white-space: nowrap`.
- Desktop visual QA confirmed the CTA remains on one line without becoming oversized.

## 13. Mobile menu typography patch

Mobile menu interaction behavior was not changed.

Presentational CSS was normalized:

- Menu labels reduced to a responsive `1.05rem` to `1.25rem` range.
- Letter spacing reduced to `0.005em`.
- Line height normalized to `1`.
- Existing `overflow-wrap: anywhere` remains for long labels.
- Subtitles reduced slightly to `0.72rem`.

Interaction QA:

- Menu opened correctly.
- Body lock while open: `overflow: hidden`, `touchAction: none`.
- Menu closed correctly.
- Body/html interaction styles cleared after close.

## 14. Wedding form mobile typography patch

No form logic or fields changed.

Mobile QA on `/upit/svadba` at `390x844`:

- H1: `32px`, readable two-line layout.
- Form labels: `14px`.
- Long guest-culture question wraps cleanly and remains readable.
- Helper text remains readable.
- Body/html overflow remain visible.

## 15. FAQ confirmation

FAQ content and structure were not modified.

## 16. Repertoar / Nacin rada confirmation

Repertoar content, Nacin rada content, and their route structure were not modified or merged.

## 17. Route structure confirmation

Routing architecture was not changed.

## 18. Protected runtime/bridge file confirmation

SHA-256 hashes were captured before edits and checked again after build/package. All remained unchanged:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/form/Cf7FormSlot.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## 19. Build command used

```text
npm run build:theme
```

## 20. ZIP command used

```text
npm run zip:theme
```

## 21. Final ZIP path

```text
C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip
```

## 22. Verification from final ZIP itself

The final installable ZIP was opened and inspected directly.

Passed:

- Theme version: `1.0.6`
- Manifest exists.
- Manifest entry: `src/wp-entry.tsx`
- Built JS: `assets/index-BTiuehOy.js`
- Built CSS: `assets/styles-D6ja0t0Q.css`
- Built React runtime marker: `18.3.1`
- Source dependency and lock verification: React `18.3.1`, React DOM `18.3.1`
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
- Metrics glass panel CSS: present
- Page-wide metrics separator markup: absent
- Hero CTA nowrap CSS: present
- Mobile typography normalization CSS: present
- Hero background/image masks and overlay CSS: present

## 23. Warnings

Non-blocking build warning:

- Vite CSS optimization still reports the existing Google Fonts `@import` ordering warning.

Local Vite preview warnings:

- The local non-WordPress preview entry still reports existing hydration mismatch warnings from `src/routes/__root.tsx`.
- The local preview still reports the existing React `fetchPriority` DOM prop warning.
- The WordPress install ZIP independently verifies `src/wp-entry.tsx`, `createRoot`, and zero `hydrateRoot(document)`.

Tooling note:

- The Bun-generated `node_modules/.bin/vite.exe` launcher could not start Vite directly. A temporary external Vite command shim was used while running the npm wrapper, and the original launcher was restored immediately after the build. No dependency installation or source dependency modification was performed.

## Commit / push status

- No commit created.
- No push performed.


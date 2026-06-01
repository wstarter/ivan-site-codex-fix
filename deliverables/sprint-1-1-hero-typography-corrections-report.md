# Sprint 1.1 Hero + Typography Corrections Report

Report date: 2026-05-31

Workspace:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix`

Branch:

`sprint-1-1-hero-typography-corrections`

## Status

**Sprint 1.1 completed successfully.**

The final WordPress installer ZIP was rebuilt, opened, and inspected directly. The stable WordPress mount architecture and interaction-lock fix remain preserved.

## 1. Changed files

Source files:

- `src/styles.css`
- `src/routes/index.tsx`
- `src/components/site/MobileMenu.tsx`
- `src/components/site/form/FormField.tsx`
- `src/components/site/form/InquiryFormLayout.tsx`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `deliverables/sprint-1-1-hero-typography-corrections-report.md`

Generated build output:

- `dist-wp/*`
- `wordpress-theme/ivan-sedative-theme/assets/app/*`
- `wordpress-theme/ivan-sedative-theme.zip`

## 2. Baseline verification before changes

| Check | Result |
| --- | --- |
| Branch | `sprint-1-1-hero-typography-corrections` |
| `package.json` React | `18.3.1` |
| `package.json` React DOM | `18.3.1` |
| `bun.lock` application React | `react@18.3.1` |
| `bun.lock` application React DOM | `react-dom@18.3.1` |
| Theme version before changes | `1.0.4` |
| `package-lock.json` exists | No |
| Required runtime and bridge files exist | Pass |
| `createRoot` exists in `src/wp-entry.tsx` | Pass |
| `hydrateRoot(document)` count in `src/wp-entry.tsx` | `0` |
| Interaction-safety helper exists | Pass |
| Mobile menu cleanup exists | Pass |

## 3. Typography consistency changes

The existing two-font system remains:

- `Bebas Neue` for display headings, card titles, and metrics.
- `Manrope` for body text, UI, navigation, buttons, forms, helper text, and eyebrow labels.

Typography scale corrections:

- Reduced global H1, H2, H3, and card-title fluid scales.
- Reduced mobile heading overrides so mobile reads as the same system as desktop.
- Tightened button font size and tracking slightly for better CTA fit.
- Added scoped mobile form-title and form-label rules.
- Added scoped mobile-menu label and subtitle rules.

No font was added. `Allura`, cursive, serif, and handwritten styles remain absent.

## 4. Hero eyebrow correction

`Live Music Experience` remains present but now behaves as an eyebrow:

- Manrope only.
- Reduced to `0.72rem–0.9rem` on desktop.
- Reduced to `0.7rem` on mobile.
- Uses controlled uppercase tracking and a restrained champagne tone.
- No longer competes visually with the main H1.

## 5. Hero text-block position

Removed the inline `clamp(220px, 36vh, 300px)` top padding from the homepage route.

Added responsive `.hero-content` spacing:

- Desktop: `clamp(6.5rem, 10vh, 7.75rem)`.
- Mobile: `clamp(9.75rem, 23vh, 11.5rem)`.

Mobile QA confirmed that `POGLEDAJ VIDEO KAKO RADIMO` is visible inside the first `390x844` viewport after the cookie banner is dismissed.

## 6. FEAT / Sedative Band structure

`.hero-feat-block` now uses a vertical flex direction:

- `FEAT.` renders on its own row.
- `SEDATIVE BAND` renders directly beneath it.
- The gap is intentionally compact.
- Desktop and mobile use the same structure.

## 7. Hero color corrections

Both slogan lines now use:

`rgb(245, 240, 232)`

`PRIME MUSIC PRODUCTION` now uses:

`rgb(184, 175, 163)`

These values come from the existing text tokens rather than scattered inline overrides.

## 8. Hero glow removal

Removed the hero radial glow stack and animated spotlight pseudo-elements.

The hero stage now uses a restrained near-black gradient:

```css
linear-gradient(180deg, var(--color-black-soft) 0%, var(--color-black-main) 88%)
```

No `heroSpot` keyframes remain in built CSS.

## 9. Ivan image edge blend

The source image file was not modified.

CSS radial masks now fade Ivan into the black background:

- Mobile mask: `radial-gradient(78% 94% at 50% 38%, ...)`
- Desktop mask: `radial-gradient(86% 98% at 56% 46%, ...)`

The desktop readability overlay also fades the right edge back into black.

Visual QA confirmed that the visible rectangular boundary and right-side image edge are no longer apparent.

## 10. Hero CTA one-line fix

The primary homepage CTA still reads:

`PROVERI DOSTUPNE TERMINE`

Added scoped `.hero-cta-primary` styling:

- `white-space: nowrap`
- Reduced tracking
- Controlled horizontal padding
- Slight mobile font-size adjustment

Desktop visual QA confirmed the CTA remains on one line.

## 11. Mobile menu typography sanity check

Only presentational menu classes changed:

- `.menu-item-title`
- `.menu-item-subtitle`

Long labels receive controlled font size, line height, tracking, and width-aware wrapping. Menu open/close logic and interaction safety were not modified.

Live QA confirmed:

- Opening the menu sets body overflow to `hidden`.
- Opening the menu sets body touch action to `none`.
- Closing the menu removes the dialog.
- Closing the menu clears body/html overflow and touch-action locks.

## 12. Wedding form mobile typography check

No wedding form logic, fields, payload, validation, or CF7 behavior changed.

Presentational improvements:

- Added `.form-page-title` to normalize the mobile form H1.
- Added `.form-field-label` and `.form-field-hint` for readable mobile labels and helper text.

Live `390x844` QA confirmed:

- `POPUNI UPIT ZA SVADBU` renders at a compact mobile scale.
- The long international-guests question wraps to two readable lines.
- The page scrolls normally.

## 13. Scope confirmation

Not implemented:

- FAQ restructuring or content replacement.
- Repertoar content replacement.
- Repertoar / Način rada merge.
- Calendar changes.
- CF7 bridge changes.
- WordPress rewrite changes.
- Route changes.
- New fonts, libraries, or dependencies.

## 14. Runtime safety preservation

These protected files remained byte-for-byte unchanged by SHA-256 comparison:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/form/Cf7FormSlot.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

`src/components/site/MobileMenu.tsx` received presentational class changes only. Its lock/unlock and route-cleanup logic remain present.

## 15. Version bump

Updated:

`wordpress-theme/ivan-sedative-theme/style.css`

From:

`Version: 1.0.4`

To:

`Version: 1.0.5`

## 16. Build and packaging

Commands executed successfully:

```powershell
npm run build:theme
npm run zip:theme
```

Final installable theme ZIP:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

ZIP metadata:

| Check | Result |
| --- | --- |
| Size | `3214544` bytes |
| Modified time | `2026-05-31T17:04:48.8358174+02:00` |
| Entry count | `35` |

## 17. Mandatory ZIP verification

The final ZIP itself was opened and inspected.

| Required check | Result |
| --- | --- |
| Theme version is `1.0.5` | Pass |
| Manifest exists | Pass |
| Manifest entry is `src/wp-entry.tsx` | Pass |
| Built JS exists | Pass: `assets/index-Ccxbfuzt.js` |
| Built CSS exists | Pass: `assets/styles-Bx-toEct.css` |
| React remains `18.3.1` | Pass |
| React DOM remains `18.3.1` | Pass |
| `hydrateRoot(document)` count | `0` |
| `createRoot` exists | Pass |
| Root `"/assets/"` reference count | `0` |
| `Allura` absent | Pass |
| Cursive UI font absent | Pass |
| `#b79775` remains present | Pass |
| `PROVERI DOSTUPNE TERMINE` remains present | Pass |
| `POGLEDAJ VIDEO KAKO RADIMO` remains present | Pass |
| Instagram video URL remains present | Pass |
| `POŠALJI UPIT` remains present | Pass |
| `Video snimanje pre rezervacije` remains absent | Pass |
| Interaction safety markers remain present | Pass |
| Packaged `Live Music Experience` remains present | Pass |
| Packaged `.hero-signature` rule remains present | Pass |
| Packaged `.hero-content` rule remains present | Pass |
| Packaged `.hero-cta-primary` rule remains present | Pass |
| Packaged `.hero-bg` rule remains present | Pass |
| Packaged FEAT column rule remains present | Pass |
| Packaged CTA no-wrap rule remains present | Pass |
| Hero glow keyframes remain absent | Pass |

## 18. Visual QA

Local preview URL:

`http://127.0.0.1:4173`

Checked:

- Desktop homepage at `1440x1000`.
- Mobile homepage at `390x844`.
- Mobile menu open and close behavior.
- Mobile `/upit/svadba` header and form typography.
- Mobile wedding form scrolling.

## 19. Warnings and concerns

- Vite still emits the existing non-blocking CSS optimizer warning that the Google Fonts `@import` follows generated rules.
- The non-WordPress local Vite preview logs existing hydration mismatch warnings from its local web entry and a React `fetchPriority` warning. This Sprint 1.1 pass did not alter the local SSR architecture. The generated WordPress installer was separately verified to use `src/wp-entry.tsx`, `createRoot`, and zero `hydrateRoot(document)`.
- No commit or push was performed.

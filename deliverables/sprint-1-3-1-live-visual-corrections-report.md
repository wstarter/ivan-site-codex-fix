# Sprint 1.3.1 - Live Visual Corrections Report

## 1. Changed Files

Authored source changes:

- `src/styles.css`
- `src/components/site/Header.tsx`
- `src/components/site/MobileMenu.tsx`
- `src/routes/index.tsx`
- `src/routes/nacin-rada.tsx`
- `src/routes/kontakt.tsx`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/functions.php`

Generated theme output refreshed by the required build:

- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-kA_jKO68.js`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/styles-DUM1Nzdk.css`
- `wordpress-theme/ivan-sedative-theme.zip`

The build also recopied the existing image assets into the theme bundle. No visual asset source was changed.

## 2. Baseline Verification Before Changes

- Repository: `C:\Users\Nikola\Documents\Ivan-site-codex-fix`
- Existing branch: `sprint-1-1-hero-typography-corrections`
- `react`: `18.3.1`
- `react-dom`: `18.3.1`
- Starting theme version: `1.0.12`
- Starting asset cache version: `1.0.12`, not stale `1.0.0`
- Required WordPress entry, interaction safety, bridge, Vite config, CF7 bridge, and calendar bridge files existed.
- `package-lock.json` was absent and remains absent.

## 3. Live-Safe Glassmorphism Changes

The desktop `.hero-metrics-panel` keeps its dark translucent surface, border, depth shadow, vertical dividers, blur, and four-column layout. Its `::after` pseudo-layer now adds a restrained internal border, a top-to-bottom highlight, a diagonal reflection, and inset depth shadows.

## 4. Why The Glass Is More Robust On Live WordPress

The effect no longer depends only on `backdrop-filter`. The built CSS includes dark layered backgrounds plus `::before` and `::after` sheen layers that remain visible even when the mostly black hero background makes real blur subtle. True blur is still present through both `backdrop-filter` and `-webkit-backdrop-filter`.

## 5. Final CTA Eyebrow Typography

The homepage final CTA now renders `Imate datum?` with `.cta-eyebrow`. It uses the Manrope body font at `0.78rem`, restrained letter spacing, and the existing champagne/gold token so it supports rather than competes with `PRVI KORAK JE JEDNOSTAVAN.`

## 6. Availability CTA One-Line Fix

Added the reusable `.availability-cta` class with `white-space: nowrap`, compact horizontal padding, and slightly tightened button typography.

Checked locations:

- Homepage hero
- Homepage final CTA above the footer
- `Nacin rada`
- `Kontakt`
- Mobile menu

Local computed checks confirmed `PROVERI DOSTUPNE TERMINE` fits on one line at desktop widths and at `390px` mobile width. The label was not shortened and routes were not changed.

## 7. Active Navigation State

Desktop header links now receive `desktop-nav-link-active` through the existing TanStack `Link.activeProps` mechanism. Mobile menu links keep their existing `menu-item-active` active class. CSS gives active items the same `var(--color-primary)` champagne/gold token as hover.

The inactive desktop utility color was moved into `.desktop-nav-link`, and the inactive mobile title color into `.menu-item-title`, so utility-layer precedence cannot suppress the active state.

Local computed checks confirmed:

- Desktop `/nacin-rada`: active item is gold.
- Desktop/mobile-width `/kontakt`: active item is gold.
- Homepage `/`: active item is gold.
- Mobile menu `/kontakt`: active item is gold.

No route detection or routing architecture was changed.

## 8. Previous File-Change Scope Review

The local Git executable was unavailable in `PATH`, so the Sprint 1.0.12 scope was reviewed through direct source reads and targeted searches.

- `src/routes/nacin-rada.tsx`: only intended CTA label/class cleanup is present.
- `src/routes/kontakt.tsx`: only intended CTA label/class cleanup is present.
- `src/components/site/MobileMenu.tsx`, `src/lib/site-data.ts`, `src/components/site/Footer.tsx`, and `src/routes/index.tsx`: intended footer/nav/CTA cleanup remains in place.
- No unintended content or route change was found.
- No prior change needed to be reverted.

## 9. Footer Regression Check

The footer remains unchanged in this sprint and preserves:

- `Korisni linkovi`
- Sentence/title case link normalization
- `Created by Starter Studio`
- `https://starter-studio.com`
- Footer typography cleanup

Visible footer copy does not reintroduce `NAVIGACIJA`.

## 10. Placeholder Contact Values

Placeholder values remain intentionally present because no client replacements were supplied:

- Email: `booking@ivansedativeband.com`
- Phone: `+381 XX XXX XXXX`
- Instagram URL: `https://instagram.com/PLACEHOLDER`
- Visible Instagram handle: `@PLACEHOLDER`

## 11. Mobile Hero Face Status

No hero portrait, hero overlay, glow, brightness, sizing, or positioning experiment was added. At `390x844`, the existing transparent portrait remains present with its existing mobile composition and the four hero metrics remain visible.

If Ivan's face is still too dark on live WordPress, the remaining issue should be treated as an asset limitation. The recommended follow-up is a dedicated mobile hero asset, not further global hero CSS brightening.

## 12. Codex Error Launching App Note

The recurring Codex/Electron `Error launching app` condition is a local environment limitation, not a theme change target. No theme code was altered to address it. The preview URL, production build, packaging command, and ZIP inspection all completed successfully.

## 13. FAQ Scope Confirmation

FAQ content and structure were not modified.

## 14. Repertoar / Nacin Rada Scope Confirmation

`Repertoar` content was not modified. `Repertoar` and `Nacin rada` were not merged or restructured.

## 15. Route Scope Confirmation

No routes, route paths, WordPress rewrites, or mount architecture were changed.

## 16. Protected Runtime And Bridge Files

The protected files were hash-checked after build and remain unchanged:

| File | SHA-256 |
| --- | --- |
| `src/wp-entry.tsx` | `DF476C7B5D5F1B775319EA669492CD3F7AE031AC2E48EBED0D81BE04D9F27794` |
| `src/lib/interaction-safety.ts` | `226259CEFCC1697045B761E56F9B10D4AA8804A9127ECD1FAFE009578C992DC2` |
| `src/lib/wp-bridge.ts` | `85BB91D3D741EBB0AF999DFC7F47D3276DDB0214A8851751E19811F75ACC3481` |
| `src/components/site/form/Cf7FormSlot.tsx` | `89E8010ADE56D3C3908408189D1FC32C73FCD907DC6387E54204E8FE78C655F1` |
| `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php` | `31AC3A858BC92EB8EF5CD07F88D3FE6EC5E988168EFCFF6DE20518E62EBD41D9` |
| `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php` | `B1E3E94F4F6A57A625280F76931D7C1E520C6727C07F12149FBD0AA29A8FCAA5` |

The packaged ZIP bridge PHP hashes also match the protected baseline.

## 17. Asset Version

- Theme header version: `1.0.13`
- `IVAN_THEME_VERSION`: `1.0.13`
- No stale `1.0.0` cache marker remains.

## 18. Build Command

```text
npm run build:theme
```

Result: passed.

## 19. ZIP Command

```text
npm run zip:theme
```

Result: passed.

## 20. Final ZIP

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

SHA-256:

`DFF6F4CA844C2E01F1261F06A316DBFD5B44E33C9D11490D904275AD6AC8626E`

## 21. ZIP Verification Summary

The install ZIP itself was inspected directly.

- Theme version is `1.0.13`.
- Asset cache version is `1.0.13`, not stale `1.0.0`.
- Manifest exists at `assets/app/.vite/manifest.json`.
- Manifest entry is `src/wp-entry.tsx`.
- Built JS is `assets/index-kA_jKO68.js`.
- Built CSS is `assets/styles-DUM1Nzdk.css`.
- React runtime marker `18.3.1` is present; `package.json` still pins React and React DOM to `18.3.1`.
- `hydrateRoot(document)` count is `0`.
- `createRoot` marker is present.
- Root `/assets/` references count is `0`.
- `Allura` and cursive UI fonts are absent.
- `Bebas Neue`, `Manrope`, and the Google Fonts import remain present. The minified Google Fonts import appears before generated CSS layers.
- `#b79775` remains present.
- `PROVERI DOSTUPNE TERMINE`, `POGLEDAJ VIDEO KAKO RADIMO`, `POŠALJI UPIT`, and the Instagram video URL remain present.
- Old `PROVERI TERMIN` and `PROVERI DATUM` labels are absent.
- `Video snimanje pre rezervacije` is absent.
- Footer credit, Starter Studio URL, and `Korisni linkovi` remain present.
- Desktop and mobile active-nav class markers are present.
- Built CSS contains the glass panel, `::before`, `::after`, blur, WebKit blur, CTA eyebrow, and availability no-wrap rules.
- Built JS contains interaction-safety markers including `ivan_debug`, `overlay-lock`, `pagehide`, and `beforeunload`.
- All four hero metric values/content markers remain present.
- `package-lock.json` is absent from both repository and ZIP.
- Protected bridge files remain unchanged inside the packaged ZIP.

Local route regression checks also confirmed that all four `/upit/*` pages render a form, leave body overflow unlocked, and contain zero pointer-active large fixed overlays.

## 22. Remaining Limitations

- Live WordPress render remains the final visual proof after installation.
- Real blur can remain visually subtle because the hero background is mostly black; the new layered sheen is the fallback for that condition.
- Mobile hero face darkness remains primarily asset-based.
- Placeholder phone and Instagram values still require client data.
- The local Codex/Electron launch error is outside theme scope.
- No commit or push was performed.

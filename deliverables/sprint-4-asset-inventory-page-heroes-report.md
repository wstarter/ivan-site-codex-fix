# Sprint 4 Asset Inventory and Page Heroes Report

## Baseline Status

- Repository: `C:\Users\Nikola\Documents\Ivan-site-codex-fix`
- Branch: `sprint-4-assets-page-heroes`
- Working tree before Sprint 4 edits: clean
- React: `18.3.1`
- React DOM: `18.3.1`
- Theme/cache version before Sprint 4: `1.0.18`
- Theme/cache version after Sprint 4: `1.0.19`
- `package-lock.json`: absent
- WordPress entry: `src/wp-entry.tsx`
- WordPress runtime uses `createRoot(#root)`.
- `hydrateRoot(document)` count: `0`
- Root `"/assets/"` references count: `0`
- Required WordPress theme files were present.

## Implementation Summary

Added `src/lib/page-hero-assets.ts` as the centralized inner-page fallback resolver. Each affected route now selects its hero through `getPageHeroAsset(route)` instead of reading an asset key directly.

The resolver intentionally reuses `getVisualAsset()` from `src/lib/assets.ts`. That existing helper already applies the WordPress `Appearance > Ivan Settings` media-picker override before returning the bundled fallback, so Sprint 4 keeps the existing manual replacement path and avoids protected runtime changes.

No new image assets were added, downloaded, generated, or deleted.

## Changed Files

Source changes:

- `src/lib/page-hero-assets.ts`
- `src/routes/usluge.tsx`
- `src/routes/repertoar.tsx`
- `src/routes/instagram.tsx`
- `src/routes/dopunski-programi.tsx`
- `src/routes/dostupni-termini.tsx`
- `src/routes/faq.tsx`
- `src/routes/kontakt.tsx`
- `src/routes/hvala.tsx`
- `src/routes/upit.svadba.tsx`
- `src/routes/upit.korporativna-proslava.tsx`
- `src/routes/upit.klupska-svirka.tsx`
- `src/routes/upit.rodjendan-jubilej.tsx`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/functions.php`

Generated build changes:

- `dist-wp/.vite/manifest.json`
- `dist-wp/assets/index-aWp6ODP4.js`
- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-aWp6ODP4.js`
- Replaced prior generated `index-BWDO7QZr.js` bundle in both build output locations.
- Refreshed `wordpress-theme/ivan-sedative-theme.zip`.

## Original Source Asset Inventory

| Asset path | Type / size | Probable purpose | Current usage | Hero suitability | Action |
| --- | --- | --- | --- | --- | --- |
| `src/assets/images/Ivan_Jovanovic_transparent.webp` | WEBP / 2,247,988 B | Transparent Ivan portrait | Homepage `heroIvan` | Homepage only | Keep connected |
| `src/assets/images/form-wedding-hero.jpg` | JPG / 117,692 B | Wedding ballroom scene | Wedding inquiry hero | Strong match | Keep connected |
| `src/assets/images/form-corporate-hero.jpg` | JPG / 169,828 B | Corporate event stage | Corporate inquiry hero and `/usluge` fallback | Strong match | Keep connected |
| `src/assets/images/form-club-gastrobar-hero.jpg` | JPG / 129,038 B | Club / gastrobar performance | Club inquiry hero | Strong match | Keep connected |
| `src/assets/images/form-birthday-jubilee-hero.jpg` | JPG / 113,233 B | Birthday celebration | Birthday / jubilee inquiry hero | Strong match | Keep connected |
| `src/assets/images/workflow-performance.jpg` | JPG / 85,678 B | Performance workflow / stage | Calendar and FAQ fallbacks | Suitable generic support image | Keep connected intentionally |
| `src/assets/images/repertoire-live-stage.jpg` | JPG / 54,577 B | Stage microphone and lights | Repertoire and additional-program fallbacks | Strong match | Keep connected intentionally |
| `src/assets/images/media-instagram-preview.jpg` | JPG / 53,429 B | Crowd and stage lights | Instagram fallback | Strong match | Keep connected |
| `src/assets/images/thank-you-hero.jpg` | JPG / 62,750 B | Empty lit stage microphone | Thank-you background | Strong match | Keep connected |
| `src/assets/images/hero-ivan-live-performance.jpg` | JPG / 122,433 B | Ivan live performance portrait | Contact fallback | Suitable subtle portrait | Keep connected |
| `src/assets/ivan-hero-mobile.jpg` | JPG / 200,300 B | Older composed mobile hero artwork with embedded text/UI | Unused | Not suitable for inner pages | Keep for later review |
| `src/assets/ivan-portrait.jpg` | JPG / 2,443,878 B | Original Ivan portrait photo | Unused | Possible future editorial use | Keep for later review |

No source SVG, PNG, AVIF, GIF, or ICO visual assets were found in the searched source/theme asset locations. Interface icons are provided through Lucide component imports, not bitmap files.

## Generated Theme Asset Copies

These are generated install-theme copies of source assets, not separate originals:

- `assets/app/assets/Ivan_Jovanovic_transparent-UDx0j16A.webp`
- `assets/app/assets/form-wedding-hero-ucLCdI5v.jpg`
- `assets/app/assets/form-corporate-hero-CgD_M3dI.jpg`
- `assets/app/assets/form-club-gastrobar-hero-ceG2UukR.jpg`
- `assets/app/assets/form-birthday-jubilee-hero-DoRwmpzs.jpg`
- `assets/app/assets/workflow-performance-DrFVWn_T.jpg`
- `assets/app/assets/repertoire-live-stage-D8Rgrjwt.jpg`
- `assets/app/assets/media-instagram-preview-8zXl2ejM.jpg`
- `assets/app/assets/thank-you-hero-BF_eoFQU.jpg`
- `assets/app/assets/hero-ivan-live-performance-C5rOavx-.jpg`

## Connected Fallback Mapping

| Route | Central fallback key | Existing asset |
| --- | --- | --- |
| `/usluge` | `uslugeHero` | `form-corporate-hero.jpg` |
| `/repertoar` | `repertoireHero` | `repertoire-live-stage.jpg` |
| `/instagram` | `mediaHero` | `media-instagram-preview.jpg` |
| `/dopunski-programi` | `additionalProgramsHero` | `repertoire-live-stage.jpg` |
| `/kontakt` | `contactHero` | `hero-ivan-live-performance.jpg` |
| `/dostupni-termini` | `calendarHero` | `workflow-performance.jpg` |
| `/faq` | `faqHero` | `workflow-performance.jpg` |
| `/hvala` | `thankYouHero` | `thank-you-hero.jpg` |
| `/upit/svadba` | `formWeddingHero` | `form-wedding-hero.jpg` |
| `/upit/korporativna-proslava` | `formCorporateHero` | `form-corporate-hero.jpg` |
| `/upit/klupska-svirka` | `formClubHero` | `form-club-gastrobar-hero.jpg` |
| `/upit/rodjendan-jubilej` | `formBirthdayHero` | `form-birthday-jubilee-hero.jpg` |

The visual result is unchanged by default because the routes use the same existing assets. Sprint 4 centralizes selection so later maintenance is localized.

## Pages Intentionally Left Unchanged

- Homepage hero layout, typography, asset placement, and visual treatment
- Inner-page hero component styling
- Inquiry form layout and fields
- FAQ content and behavior
- Calendar logic
- Navigation labels and WordPress menu logic
- Runtime safety, mobile-menu locking, CF7 bridge, calendar bridge, redirects, footer, color tokens, and global typography

## WordPress Replacement Path

Current supported manual replacement:

1. Open `Appearance > Ivan Settings` in WordPress.
2. Choose the matching page hero media field.
3. Select or replace the image.
4. Save settings.
5. Clear cache and hard refresh if needed.

The preferred per-page workflow (`Edit Page > Featured Image > Update`) is not active yet because the current bridge payload does not expose the current page Featured Image. Sprint 4 did not modify protected bridge/runtime files to add that metadata.

Future extension point:

1. Extend `ivan_theme_data_payload()` in `wordpress-theme/ivan-sedative-theme/inc/ivan-theme-data.php` with safe current-page Featured Image metadata.
2. Extend the `IvanTheme` type in `src/lib/wp-bridge.ts`.
3. Update `getPageHeroAsset()` in `src/lib/page-hero-assets.ts` so priority becomes: Featured Image, existing Ivan Settings override, bundled fallback.

## Responsive QA

Tested with the local preview at `http://127.0.0.1:4173` across a wide desktop viewport and a `390x844` mobile viewport:

- Homepage regression check
- `/usluge`
- `/repertoar`
- `/instagram`
- `/dopunski-programi`
- `/dostupni-termini`
- `/faq`
- `/kontakt`
- `/hvala`
- `/upit/svadba`
- `/upit/korporativna-proslava`
- `/upit/klupska-svirka`
- `/upit/rodjendan-jubilej`

Results:

- All routes rendered a main page and expected hero asset.
- No unresolved image references were found.
- Mobile horizontal overflow: `0`.
- Body/document scrolling remained unlocked outside the open mobile menu.
- Mobile menu body lock appeared only while open.
- Mobile-menu navigation to `/kontakt` removed the overlay and restored scrolling.
- Long inquiry-page scrolling worked normally.
- No large inactive fixed overlay remained after navigation.
- Existing menu labels remained unchanged.

## Build and ZIP Verification

Commands:

```text
npm run build:theme
npm run zip:theme
```

On Windows, `npm run zip:theme` required a temporary external `zip.cmd` wrapper because the project script invokes Unix `zip`. The wrapper was created outside the repository, used for packaging, and removed afterward.

Final ZIP:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

ZIP SHA-256:

`1B818A6F11066A95A5FBBC3A1BAC8E3FC87A4437E60C4A38DDEF7D3FFD6E272F`

Direct extracted-ZIP audit:

| Check | Result |
| --- | --- |
| Theme version | `1.0.19` |
| Cache version | `1.0.19` |
| React / React DOM baseline | Source package remains `18.3.1`; built frontend contains React `18.3.1` markers |
| Manifest entry | `src/wp-entry.tsx` |
| `createRoot` | Present |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |
| `package-lock.json` | Absent |
| Allura markers in frontend output | `0` |
| Cursive markers in frontend output | `0` |
| Lovable markers in frontend output | `0` |
| Manifest-referenced asset paths | `12` resolved, `0` missing |
| Protected ZIP PHP bridge hashes | Unchanged |

Protected source runtime/bridge hashes were also rechecked after build and remained unchanged.

## Limitations and Warnings

- Per-page WordPress Featured Image override still needs the documented future bridge extension.
- The normal local web preview continues to emit its pre-existing TanStack SSR hydration warning. The WordPress install bundle remains separate, uses `createRoot(#root)`, and passes the direct ZIP runtime invariant checks.
- `src/assets/ivan-hero-mobile.jpg` and `src/assets/ivan-portrait.jpg` remain intentionally unused and were documented rather than deleted.
- No commit, push, or pull request was performed.

# Sprint 4.1 Connect Ivan Settings Heroes Report

## Baseline Status

- Repository: `C:\Users\Nikola\Documents\Ivan-site-codex-fix`
- Branch: `sprint-4-assets-page-heroes`
- Starting working tree: clean
- Starting theme/cache version: `1.0.19`
- Final theme/cache version: `1.0.20`
- React: `18.3.1`
- React DOM: `18.3.1`
- `package-lock.json`: absent
- WordPress entry remains `src/wp-entry.tsx`.
- WordPress runtime remains `createRoot(#root)`.
- `hydrateRoot(document)` count remains `0`.
- Root `"/assets/"` references in frontend output remain `0`.

## Exact Cause

The WordPress settings and PHP bridge were already populated correctly. `ivan_theme_data_payload()` already exposes every Visual assets field under `window.IvanTheme.assets`, and `enqueue.php` injects that payload before the WordPress app bundle.

The frontend had two weak points:

1. Inner-page hero selection relied on a one-time module mutation in `src/lib/assets.ts` instead of resolving `window.IvanTheme.assets` explicitly through the centralized page-hero helper.
2. Shared inner-page hero image wrappers used `-z-10` without an isolated stacking context. That can place the image behind the page background, leaving the DOM image present but visually absent.

## Implemented Fix

`src/lib/page-hero-assets.ts` now exports a centralized `getPageHeroImage(route)` resolver:

1. Read the matching `window.IvanTheme.assets[bridgeKey].src`.
2. If the trimmed Ivan Settings URL is populated, return it.
3. Otherwise return the existing bundled fallback from `src/lib/assets.ts`.
4. If a fallback is ever empty, return `undefined` so the existing text-only hero layout remains valid.

Shared hero components now render images in an isolated `z-0 pointer-events-none` layer and keep text in a relative `z-10` layer. This keeps the same dark premium overlays, prevents hard boundaries, preserves readability, and prevents background images from intercepting clicks.

`/hvala` now loads its above-the-fold background eagerly so the existing fallback is fetched immediately.

## Changed Files

Source files:

- `src/lib/page-hero-assets.ts`
- `src/components/site/PageHero.tsx`
- `src/components/site/form/InquiryFormLayout.tsx`
- `src/routes/usluge.tsx`
- `src/routes/repertoar.tsx`
- `src/routes/instagram.tsx`
- `src/routes/kontakt.tsx`
- `src/routes/dopunski-programi.tsx`
- `src/routes/dostupni-termini.tsx`
- `src/routes/faq.tsx`
- `src/routes/hvala.tsx`
- `src/routes/upit.svadba.tsx`
- `src/routes/upit.korporativna-proslava.tsx`
- `src/routes/upit.klupska-svirka.tsx`
- `src/routes/upit.rodjendan-jubilej.tsx`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/functions.php`

Generated files:

- `dist-wp/.vite/manifest.json`
- `dist-wp/assets/index-CHaV6v8E.js`
- `dist-wp/assets/styles-BStCWnjc.css`
- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-CHaV6v8E.js`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/styles-BStCWnjc.css`
- `wordpress-theme/ivan-sedative-theme.zip`

Prior generated JS/CSS hashes were replaced by the new build hashes.

## Ivan Settings Option Keys

The saved WordPress option is `ivan_theme_settings`.

| Admin field | Option key | Frontend bridge key |
| --- | --- | --- |
| Hero Ivan | `asset_hero_ivan` | `heroIvan` |
| Wedding form hero | `asset_form_wedding_hero` | `formWeddingHero` |
| Corporate form hero | `asset_form_corporate_hero` | `formCorporateHero` |
| Club/gastro form hero | `asset_form_club_hero` | `formClubHero` |
| Birthday/jubilee form hero | `asset_form_birthday_hero` | `formBirthdayHero` |
| Usluge hero | `asset_usluge_hero` | `uslugeHero` |
| Nacin rada hero | `asset_workflow_hero` | `workflowHero` |
| Repertoar hero | `asset_repertoire_hero` | `repertoireHero` |
| Dopunski programi hero | `asset_additional_hero` | `additionalProgramsHero` |
| Instagram/media hero | `asset_media_hero` | `mediaHero` |
| Kontakt hero | `asset_contact_hero` | `contactHero` |
| Dostupni termini hero | `asset_calendar_hero` | `calendarHero` |
| FAQ hero | `asset_faq_hero` | `faqHero` |
| Hvala hero | `asset_thank_you_hero` | `thankYouHero` |
| OG image | `asset_og_image` | `ogImage` |

## Frontend Payload Status

Before Sprint 4.1:

- Settings registration: present
- Settings sanitization: present
- PHP payload mapping: present
- Injection before app bundle: present
- Minimal PHP bridge extension required: no
- Protected bridge PHP files changed: no

After Sprint 4.1:

- React page-hero resolver reads the matching bridge key explicitly at resolution time.
- Inner hero image layers are visible behind text.
- Existing bundled fallbacks remain authoritative when a matching field is empty.

## Route Mapping

| Route | Bridge key | Empty-setting fallback |
| --- | --- | --- |
| `/usluge` | `uslugeHero` | `form-corporate-hero.jpg` |
| `/repertoar` | `repertoireHero` | `repertoire-live-stage.jpg` |
| `/instagram` | `mediaHero` | `media-instagram-preview.jpg` |
| `/kontakt` | `contactHero` | `hero-ivan-live-performance.jpg` |
| `/dopunski-programi` | `additionalProgramsHero` | `repertoire-live-stage.jpg` |
| `/dostupni-termini` | `calendarHero` | `workflow-performance.jpg` |
| `/faq` | `faqHero` | `workflow-performance.jpg` |
| `/hvala` | `thankYouHero` | `thank-you-hero.jpg` |
| `/upit/svadba` | `formWeddingHero` | `form-wedding-hero.jpg` |
| `/upit/korporativna-proslava` | `formCorporateHero` | `form-corporate-hero.jpg` |
| `/upit/klupska-svirka` | `formClubHero` | `form-club-gastrobar-hero.jpg` |
| `/upit/rodjendan-jubilej` | `formBirthdayHero` | `form-birthday-jubilee-hero.jpg` |

## DOM QA

A disposable WordPress-style local harness injected representative populated Ivan Settings URLs before the production WordPress bundle. Optional fields for additional programs, calendar, FAQ, and thank-you were intentionally left empty to verify fallback behavior.

Representative resolved settings example:

- Route: `/upit/svadba`
- DOM location: `main section img`
- Resolved `src`: `/assets/app/assets/form-wedding-hero-ucLCdI5v.jpg?ivan-settings=svadba`
- Image loaded: yes (`1280px` natural width)
- Image visibility: `visible`
- Image opacity: `0.55`
- Layer position: `absolute`
- Layer z-index: `0`
- Layer pointer events: `none`
- Text layer z-index: `10`

Tested at desktop `1440x1000` and mobile `390x844`:

- Homepage regression check
- `/usluge`
- `/repertoar`
- `/instagram`
- `/kontakt`
- `/dopunski-programi`
- `/dostupni-termini`
- `/faq`
- `/hvala`
- `/upit/svadba`
- `/upit/korporativna-proslava`
- `/upit/klupska-svirka`
- `/upit/rodjendan-jubilej`

Results:

- All populated settings routes rendered the injected settings URL.
- All intentionally empty settings routes rendered the expected bundled fallback.
- All tested images loaded.
- All inner hero images were visible behind text.
- Horizontal overflow: `0` for every route at both viewports.
- Large inactive fixed overlays: `0`.
- Mobile-menu regression check passed: body lock exists only while open, and the overlay is removed with scrolling restored after close.
- WordPress-style production harness runtime errors: `0`.
- Screenshot capture was attempted but unavailable because the in-app browser screenshot command timed out. DOM and computed-style QA completed successfully.

## Build and Package

Commands:

```text
npm run build:theme
npm run zip:theme
```

On Windows, `npm run zip:theme` required a temporary external `zip.cmd` wrapper because the project script invokes Unix `zip`. The wrapper was created outside the repository and removed after packaging.

Final ZIP:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

ZIP SHA-256:

`10CF7A667D31646C405E92F533C2FB7E35E95DD105442AD42E61FF7A7E0F4515`

## Direct ZIP Verification

| Check | Result |
| --- | --- |
| Theme version | `1.0.20` |
| Cache version | `1.0.20` |
| React / React DOM | Source remains `18.3.1`; packaged frontend contains React `18.3.1` markers |
| Manifest entry | `src/wp-entry.tsx` |
| Packaged JS | `assets/index-CHaV6v8E.js` |
| `createRoot` | Present |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |
| `package-lock.json` | Absent |
| Manifest asset references | `12` present, `0` missing |
| Allura frontend markers | `0` |
| Cursive frontend markers | `0` |
| Lovable frontend markers | `0` |
| Fifteen Ivan Settings option keys in packaged PHP payload | Present |
| Inner-page bridge keys in packaged frontend | Present |
| Protected runtime / CF7 / calendar hashes | Unchanged |

## Limitations and Warnings

- WordPress Featured Image override remains intentionally out of scope. A future extension can add current-page thumbnail metadata to `ivan_theme_data_payload()` and prioritize it inside `getPageHeroImage()`.
- `asset_workflow_hero` remains available in the payload for the existing workflow asset but is not a standalone route hero.
- `asset_og_image` remains exposed for SEO payload use and is not an inner-page React hero.
- The existing normal TanStack local web preview can emit its pre-existing SSR hydration warning. Sprint 4.1 QA used the WordPress production entry and recorded zero runtime errors.
- No content, forms logic, FAQ content, calendar logic, mobile-menu behavior, runtime mounting, redirects, homepage hero layout, navigation labels, footer content, visual assets, or WordPress menu logic were changed.
- No commit, push, or pull request was performed.

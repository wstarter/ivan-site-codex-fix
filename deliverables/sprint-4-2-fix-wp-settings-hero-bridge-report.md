# Sprint 4.2 Fix WordPress Settings Hero Bridge Report

## Baseline Status

- Repository: `C:\Users\Nikola\Documents\Ivan-site-codex-fix`
- Branch: `sprint-4-assets-page-heroes`
- Starting commit: `bf416d5`
- Starting working tree: clean
- Starting theme/cache version: `1.0.20`
- Final theme/cache version: `1.0.21`
- React: `18.3.1`
- React DOM: `18.3.1`
- `package-lock.json`: absent
- WordPress runtime still uses `createRoot(#root)`.
- `hydrateRoot(document)` count remains `0`.
- Root `"/assets/"` frontend references remain `0`.

## Root Cause

The Visual assets option fields, saved option key, PHP option reading, PHP asset-key map, React route map, and Sprint 4.1 renderer were already aligned.

The remaining live-only weak point was in `wordpress-theme/ivan-sedative-theme/inc/enqueue.php`:

```php
wp_register_script( 'ivan-theme-bridge', '', array(), IVAN_THEME_VERSION, false );
wp_enqueue_script( 'ivan-theme-bridge' );
wp_add_inline_script( 'ivan-theme-bridge', $payload, 'before' );
wp_enqueue_script( 'ivan-app', $hashed_vite_entry, array( 'ivan-theme-bridge' ), ... );
```

The inline config was attached to a synthetic dependency handle with an empty `src`, not to the real hashed Vite entry handle. That is an unreliable output contract for the live WordPress frontend.

## Root Cause Checklist

| Question | Answer |
| --- | --- |
| Was the issue PHP option reading? | No. `ivan_get_settings()` correctly reads the `ivan_theme_settings` option array. |
| Was the issue script handle/localization? | Yes. Inline bridge data was attached to an empty synthetic handle instead of the printed Vite app handle. |
| Was the issue key mismatch? | No. Option keys, PHP bridge keys, React resolver keys, and route keys match 1:1. |
| Was the issue React resolver? | No new React fix was required. Sprint 4.1 already resolves settings URL first, then bundled fallback. |
| Was the issue CSS layering? | No new CSS fix was required. Sprint 4.1 already fixed the visible hero stacking layer. |

The public live domain did not return a response from this execution environment, so direct live page-source inspection could not be completed here. The corrected WordPress output contract was verified through source inspection, direct ZIP inspection, and a WordPress-style production harness.

## Implemented Fix

`ivan_enqueue_app()` now enqueues the real `ivan-app` Vite module handle first and attaches the payload directly to that same handle:

```php
$bridge = ivan_theme_data_payload();
wp_enqueue_script( 'ivan-app', $entries['js'], array(), IVAN_THEME_VERSION, true );
wp_add_inline_script(
    'ivan-app',
    'window.IvanTheme = ' . wp_json_encode( $bridge ) . ';',
    'before'
);
```

This gives WordPress a stable same-handle contract: print the inline `window.IvanTheme` config immediately before the hashed `ivan-app` module tag.

## Changed Files

- `wordpress-theme/ivan-sedative-theme/inc/enqueue.php`
- `wordpress-theme/ivan-sedative-theme/functions.php`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `deliverables/sprint-4-2-fix-wp-settings-hero-bridge-report.md`

No React source, CF7 bridge, calendar bridge, FAQ, forms, mobile menu, runtime safety, or visual asset files changed.

## Exact Data Flow After Fix

1. `Appearance > Ivan Settings > Visual assets` saves URLs inside the `ivan_theme_settings` WordPress option array.
2. `ivan_get_settings()` reads the saved array and merges defaults.
3. `ivan_theme_data_payload()` calls `ivan_collect_assets_bridge( $s )`.
4. `ivan_collect_assets_bridge()` maps saved option keys to stable frontend bridge keys.
5. `ivan_enqueue_app()` enqueues the hashed `ivan-app` module entry.
6. `wp_add_inline_script( 'ivan-app', ..., 'before' )` prints `window.IvanTheme = {...};` immediately before the module entry.
7. `src/lib/page-hero-assets.ts` reads `window.IvanTheme.assets[routeBridgeKey].src`.
8. If a settings URL exists, React renders it. Otherwise it renders the bundled fallback. If neither exists, the existing text-only hero layout remains valid.

## Ivan Settings Option Keys

The saved WordPress option is `ivan_theme_settings`.

| Admin field | Option key | `window.IvanTheme.assets` key |
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

## `window.IvanTheme.assets` Shape

Representative frontend shape:

```js
window.IvanTheme = {
  assets: {
    formWeddingHero: { src: "..." },
    formCorporateHero: { src: "..." },
    formClubHero: { src: "..." },
    formBirthdayHero: { src: "..." },
    uslugeHero: { src: "..." },
    repertoireHero: { src: "..." },
    mediaHero: { src: "..." },
    contactHero: { src: "..." },
    calendarHero: { src: "..." },
    faqHero: { src: "..." },
    thankYouHero: { src: "..." },
    additionalProgramsHero: { src: "..." }
  }
};
```

## WordPress-Style Output Inspection

A disposable production harness mirrored WordPress output with the corrected ordering:

1. Inline `window.IvanTheme` script
2. Hashed `type="module"` Vite entry script

Page-source inspection result:

- `window.IvanTheme`: present at byte `354`
- `window.IvanTheme.assets`: present
- Hashed module tag: present at byte `1606`
- Inline config appears before module tag: yes
- Wedding form hero URL: present
- Birthday/jubilee form hero URL: present
- Corporate form hero URL: present
- Club/gastro form hero URL: present
- Services hero URL: present
- Repertoire hero URL: present
- Contact hero URL: present
- FAQ hero URL: present

No production WordPress media-library URL was hardcoded into source.

## Route QA

Populated-settings mode was tested at desktop `1440x1000` and mobile `390x844`:

- `/`
- `/usluge`
- `/repertoar`
- `/instagram`
- `/kontakt`
- `/dostupni-termini`
- `/faq`
- `/hvala`
- `/upit/svadba`
- `/upit/korporativna-proslava`
- `/upit/klupska-svirka`
- `/upit/rodjendan-jubilej`
- `/dopunski-programi`

Results:

- Every mapped route rendered its injected settings URL marker.
- Every hero image loaded successfully.
- Birthday/jubilee and wedding form heroes were visible.
- Repertoire and contact heroes were visible.
- Text remained above visuals at `z-index: 10`.
- Hero image layers remained non-interactive at `pointer-events: none`.
- Horizontal overflow: `0` on every route at both viewports.
- Inactive fullscreen overlays: `0`.
- Production-harness runtime errors: `0`.

Mobile-menu regression:

- Open state: body overflow `hidden`, overlay present.
- Closed state: body overflow `visible`, overlay removed.

## Fallback Behavior

An empty-settings mode was tested against all mapped inner routes at desktop and against birthday/wedding routes at `390px`.

Results:

- Settings marker URL was absent.
- Every route rendered its expected bundled fallback.
- Every fallback image loaded successfully.
- Text remained above visuals.
- Horizontal overflow remained `0`.

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

`6867E1D2C59902AE0F2567BD164289A3E3AAAEF86B7FCDD5AD1370E592A4610E`

## Direct ZIP Audit

| Check | Result |
| --- | --- |
| Theme version | `1.0.21` |
| Cache version | `1.0.21` |
| React / React DOM | Source remains `18.3.1`; packaged frontend contains React `18.3.1` markers |
| Manifest entry | `src/wp-entry.tsx` |
| Packaged entry JS | `assets/index-CHaV6v8E.js` |
| `createRoot` | Present |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |
| `package-lock.json` | Absent |
| Manifest asset references | `12` present, `0` missing |
| Allura frontend markers | `0` |
| Cursive frontend markers | `0` |
| Lovable frontend markers | `0` |
| Fifteen Ivan Settings option keys | Present |
| `ivan-app` enqueue before inline attachment | Present |
| `wp_add_inline_script( 'ivan-app', ..., 'before' )` | Present |
| Synthetic `ivan-theme-bridge` handle | Removed |
| CF7 bridge | Unchanged |
| Calendar bridge | Unchanged |
| Mobile menu | Unchanged |
| FAQ source | Unchanged |
| Runtime safety files | Unchanged |

## Warnings and Limitations

- Install the `1.0.21` ZIP on WordPress, clear page/cache/CDN caches, hard refresh, and verify the saved Ivan Settings visuals on the public frontend.
- Direct public live-domain page-source inspection could not be completed because the live domain did not return a response from this execution environment.
- WordPress Featured Image override remains intentionally deferred.
- Current manual replacement method remains: `Appearance > Ivan Settings > Visual assets`.
- PHP CLI is not installed locally, so the PHP change was verified through narrow source diff review, WordPress-style output inspection, extracted-ZIP inspection, and production-bundle browser QA.
- No commit, push, pull request, or merge was performed.

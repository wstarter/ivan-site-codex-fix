# Sprint 4.3 - Fix Live Vite Asset Version Mismatch

## 1. Baseline Status

Baseline gate passed before edits:

| Check | Result |
| --- | --- |
| Branch | `sprint-4-assets-page-heroes` |
| Worktree | Clean |
| Starting theme header version | `1.0.21` |
| Starting cache constant | `IVAN_THEME_VERSION = 1.0.21` |
| React | `18.3.1` |
| React DOM | `18.3.1` |
| `package-lock.json` | Absent |
| `createRoot` | Present |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |

## 2. Root Cause

The clean repository did not contain a runtime `1.0.18` cache constant or a
second app-asset version source. Its WordPress loader already used the central
`IVAN_THEME_VERSION` constant for both app CSS and app JS.

The public site source was inspected before this Sprint 4.3 package was built.
It still served an older installed or cached theme artifact:

```text
styles-BsmQjbxN.css?ver=1.0.18
index-BWDO7QZr.js?ver=1.0.18
```

That live source also still printed the older synthetic inline handle:

```text
ivan-theme-bridge-js-before
```

The current repository no longer contains that synthetic bridge handle. The
live `1.0.18` output therefore came from an older deployed theme artifact, not
from the clean Sprint 4.2 repository checkpoint.

## 3. Files Changed

| File | Change |
| --- | --- |
| `wordpress-theme/ivan-sedative-theme/functions.php` | Bumped central `IVAN_THEME_VERSION` from `1.0.21` to `1.0.22`. |
| `wordpress-theme/ivan-sedative-theme/style.css` | Bumped WordPress theme header from `1.0.21` to `1.0.22`. |
| `deliverables/sprint-4-3-fix-live-vite-asset-version-report.md` | Added this report. |

No React source, layout, content, form, calendar, FAQ, mobile-menu, or bridge
logic file was edited.

## 4. Central Version Source

The single runtime cache source remains:

```php
define( 'IVAN_THEME_VERSION', '1.0.22' );
```

`inc/enqueue.php` uses it for app CSS:

```php
wp_enqueue_style( 'ivan-app-' . $i, $href, array(), IVAN_THEME_VERSION );
```

It also uses the same source for app JS:

```php
wp_enqueue_script( 'ivan-app', $entries['js'], array(), IVAN_THEME_VERSION, true );
```

The WordPress theme header also reports:

```text
Version: 1.0.22
```

## 5. Manifest And Generated Assets

Commands used:

```text
npm.cmd run build:theme
npm.cmd run zip:theme
```

`npm.cmd` was used because this Windows PowerShell execution policy blocks the
`npm.ps1` shim. The npm scripts themselves were executed unchanged.

Fresh copied WordPress build:

| Item | Value |
| --- | --- |
| Manifest entry | `src/wp-entry.tsx` |
| Manifest JS | `assets/index-CHaV6v8E.js` |
| Manifest CSS | `assets/styles-BStCWnjc.css` |
| Missing manifest assets | `0` |
| CSS enqueue version | `1.0.22` through `IVAN_THEME_VERSION` |
| JS enqueue version | `1.0.22` through `IVAN_THEME_VERSION` |

The copy script wiped `wordpress-theme/ivan-sedative-theme/assets/app/` before
copying the fresh `dist-wp` output.

## 6. `window.IvanTheme` Order

The corrected Sprint 4.2 bridge remains attached directly to `ivan-app`:

```php
wp_add_inline_script(
    'ivan-app',
    'window.IvanTheme = ' . wp_json_encode( $bridge ) . ';',
    'before'
);
```

WordPress-style rendered HTML confirmed:

| Check | Result |
| --- | --- |
| Inline `window.IvanTheme` byte position | `321` |
| `assets/index-CHaV6v8E.js?ver=1.0.22` byte position | `783` |
| Inline bridge appears before app JS | Pass |
| Injected `formBirthdayHero` key exists | Pass |
| Injected birthday marker URL exists | Pass |

## 7. WordPress-Style Harness QA

The production WordPress bundle was loaded in a disposable WordPress-style HTML
shell with injected Ivan Settings values.

| Check | Result |
| --- | --- |
| `ivan-app` CSS uses `?ver=1.0.22` | Pass |
| `ivan-app` JS uses `?ver=1.0.22` | Pass |
| `/upit/rodjendan-jubilej` renders injected birthday hero | Pass |
| `/upit/svadba` renders injected wedding hero | Pass |
| Empty Ivan Settings birthday fallback | Pass |
| Mobile birthday hero at `390px` | Pass |
| Mobile wedding hero at `390px` | Pass |
| Mobile empty-settings fallback at `390px` | Pass |
| Horizontal overflow at `390px` | `0` |
| Homepage existing hero smoke check | Pass |
| `/repertoar` existing hero smoke check | Pass |
| `/faq` existing hero smoke check | Pass |
| Browser runtime errors | `0` |

## 8. Direct ZIP Audit

Final ZIP:

```text
wordpress-theme/ivan-sedative-theme.zip
```

SHA-256:

```text
B826F2B0197CD7D5446B63E00F1BE33451EAF55A6206F1011E0E47D65E0EA24B
```

The ZIP was extracted to a disposable audit directory and inspected directly.

| ZIP Check | Result |
| --- | --- |
| Theme header version | `1.0.22` |
| Cache constant | `1.0.22` |
| Manifest entry | `src/wp-entry.tsx` |
| Manifest JS | `assets/index-CHaV6v8E.js` |
| Manifest CSS | `assets/styles-BStCWnjc.css` |
| ZIP contains manifest JS and CSS | Pass |
| Missing manifest assets | `0` |
| React `18.3.1` bundle markers | `4` |
| `createRoot` markers | `4` |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |
| Runtime `1.0.18` references | `0` |
| Runtime old `index-BWDO7QZr` / `styles-BsmQjbxN` references | `0` |
| `package-lock.json` | Absent |
| Frontend Allura markers | `0` |
| Frontend cursive markers | `0` |
| Frontend Lovable markers | `0` |
| Inline bridge attached before `ivan-app` | Pass |
| Synthetic `ivan-theme-bridge` handle | Absent |

Protected runtime hashes remain unchanged:

```text
src/wp-entry.tsx
DF476C7B5D5F1B775319EA669492CD3F7AE031AC2E48EBED0D81BE04D9F27794

src/lib/interaction-safety.ts
226259CEFCC1697045B761E56F9B10D4AA8804A9127ECD1FAFE009578C992DC2

src/lib/wp-bridge.ts
85BB91D3D741EBB0AF999DFC7F47D3276DDB0214A8851751E19811F75ACC3481

src/components/site/MobileMenu.tsx
9C6B543D202989BA723EE0D66B5255ADDE510CB50E09B29AB00421D24FF90016

src/components/site/form/Cf7FormSlot.tsx
89E8010ADE56D3C3908408189D1FC32C73FCD907DC6387E54204E8FE78C655F1

src/routes/faq.tsx
94573F2C4CD7486DD02BB862AAF97CB38FCF5B72869C9F74E2AFC76523772ACE

wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php
31AC3A858BC92EB8EF5CD07F88D3FE6EC5E988168EFCFF6DE20518E62EBD41D9

wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php
B1E3E94F4F6A57A625280F76931D7C1E520C6727C07F12149FBD0AA29A8FCAA5
```

## 9. Live Verification Instructions

Install the final `1.0.22` ZIP, clear any WordPress page cache and CDN cache,
then hard refresh the browser.

Verify the public page source:

1. Search `ivan-app-0-css` and confirm the app stylesheet URL ends with
   `?ver=1.0.22`.
2. Search `index-` and confirm the app module URL ends with `?ver=1.0.22`.
3. Search `window.IvanTheme` and confirm it appears before the app module.
4. Search `formBirthdayHero` and confirm it contains the uploaded WordPress
   media URL.
5. Open `/upit/rodjendan-jubilej/` and `/upit/svadba/` and confirm the Ivan
   Settings hero images are visible.

## 10. Warnings And Limitations

- The public site was reachable during diagnosis and still served the old
  `1.0.18` installed artifact before this new ZIP was built.
- This environment cannot install the theme into the live WordPress admin.
  Final public confirmation must happen after the user installs the ZIP and
  clears caches.
- A later public-source fetch became intermittent, so post-install verification
  remains a manual live step.
- No commit, push, pull request, or merge was performed.

# Sprint 4.5 - Fix Dynamic Page Title And Meta Updates

## 1. Baseline Status

The required baseline gate passed before edits:

| Check | Result |
| --- | --- |
| Branch | `sprint-4-assets-page-heroes` |
| Worktree | Clean |
| Starting theme/cache version | `1.0.23` |
| React | `18.3.1` |
| React DOM | `18.3.1` |
| `package-lock.json` | Absent |
| `createRoot` | Present |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |

## 2. Root Cause

Route files already declared TanStack `head()` metadata. That metadata works for
the TanStack document shell, which renders `<HeadContent />`.

The WordPress entry intentionally mounts the SPA with:

```tsx
createRoot(el).render(
  <RouterProvider router={router} />
);
```

WordPress owns `<html>`, `<head>`, `wp_head()`, `<body>`, and `wp_footer()`.
Therefore the TanStack document shell is not rendered by the WordPress entry.
Client-side route changes updated page content correctly, but nothing
reactively synchronized `document.title` or the WordPress-owned meta tags.

A hard refresh appeared correct because WordPress generated the initial title
for the requested URL on the server.

## 3. Files Changed

Source files:

| File | Change |
| --- | --- |
| `src/lib/route-seo.tsx` | Added centralized route title/meta map and reactive synchronizer. |
| `src/routes/__root.tsx` | Mounted `<RouteSeoSync />` once at the app root. |
| `wordpress-theme/ivan-sedative-theme/functions.php` | Bumped central cache version to `1.0.24`. |
| `wordpress-theme/ivan-sedative-theme/style.css` | Bumped WordPress theme header to `Version: 1.0.24`. |
| `deliverables/sprint-4-5-fix-dynamic-page-title-meta-report.md` | Added this report. |

Generated WordPress bundle files were refreshed by `npm run build:theme`:

```text
dist-wp/.vite/manifest.json
dist-wp/assets/index-CKvceOyb.js
wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json
wordpress-theme/ivan-sedative-theme/assets/app/assets/index-CKvceOyb.js
```

The previous generated `index-CHaV6v8E.js` was replaced in both build output
locations.

No design, hero layout, hero resolver, Ivan Settings bridge, form, calendar,
FAQ, repertoire-content, mobile-menu, footer, CF7 bridge, or calendar bridge
file was edited.

## 4. Title Handling Before And After

### Before

- Individual routes declared `head()` metadata.
- WordPress direct requests received server-rendered titles.
- WordPress SPA client-side navigation did not run `<HeadContent />`.
- Browser tabs could retain the previous route title until a hard refresh.

### After

`RouteSeoSync` reads the active router pathname once at the root layout and
updates the WordPress-owned document head after every route change.

It updates:

```text
document.title
meta[name="description"]
link[rel="canonical"]
meta[property="og:title"]
meta[property="og:description"]
meta[property="og:url"]
```

Each helper reuses an existing tag when possible, creates it once when missing,
and removes duplicates. Repeated navigation cannot accumulate duplicate tags.

## 5. Route To Title Map

| Route | Browser title |
| --- | --- |
| `/` | `Ivan Jovanović feat. Sedative` |
| `/usluge` | `Usluge \| Ivan Jovanović feat. Sedative` |
| `/repertoar` | `Repertoar i način rada \| Ivan Jovanović feat. Sedative` |
| `/instagram` | `Instagram \| Ivan Jovanović feat. Sedative` |
| `/dopunski-programi` | `Dopunski programi \| Ivan Jovanović feat. Sedative` |
| `/dostupni-termini` | `Dostupni termini \| Ivan Jovanović feat. Sedative` |
| `/faq` | `Najčešća pitanja i odgovori \| Ivan Jovanović feat. Sedative` |
| `/kontakt` | `Kontakt \| Ivan Jovanović feat. Sedative` |
| `/upit/svadba` | `Upit za svadbu \| Ivan Jovanović feat. Sedative` |
| `/upit/korporativna-proslava` | `Upit za korporativnu proslavu \| Ivan Jovanović feat. Sedative` |
| `/upit/klupska-svirka` | `Upit za klupsku svirku \| Ivan Jovanović feat. Sedative` |
| `/upit/rodjendan-jubilej` | `Upit za rođendan / jubilej \| Ivan Jovanović feat. Sedative` |
| `/hvala` | `Hvala \| Ivan Jovanović feat. Sedative` |
| `/nacin-rada` | Redirects to `/repertoar#nacin-rada`; repertoire title is used. |

## 6. Meta Tag Behavior

A disposable WordPress-style shell intentionally started with duplicate
description, OG title, and canonical tags.

After the SPA mounted:

| Tag | Count |
| --- | --- |
| `meta[name="description"]` | `1` |
| `link[rel="canonical"]` | `1` |
| `meta[property="og:title"]` | `1` |
| `meta[property="og:description"]` | `1` |
| `meta[property="og:url"]` | `1` |

The same count remained `1` after repeated route transitions and the complete
route sweep.

## 7. Client-Side Navigation QA

The packaged production bundle was loaded in a disposable WordPress-style
shell and tested through real in-app clicks without full reloads.

| Transition | Result |
| --- | --- |
| `/` initial mount | `Ivan Jovanović feat. Sedative` |
| `/` -> `/usluge` through desktop header | Title/meta updated immediately |
| `/usluge` -> `/repertoar` through desktop header | Title/meta updated immediately |
| `/repertoar` -> `/faq` through footer | Title/meta updated immediately |
| `/faq` -> `/kontakt` through sticky header | Title/meta updated immediately |
| `/kontakt` -> `/usluge` through desktop header | Title/meta updated immediately |

Canonical URL and OG URL followed each active route. Descriptions and OG
descriptions also changed to the active route values.

## 8. Direct Refresh QA

A direct browser refresh on `/kontakt` passed:

```text
title:
Kontakt | Ivan Jovanović feat. Sedative

canonical:
http://127.0.0.1:4174/kontakt
```

Description, OG title, OG description, and OG URL also remained correct after
the refresh.

## 9. Mobile Menu Navigation QA

Tested at `390x844`.

Menu open state:

```text
body overflow: hidden
body touchAction: none
dialog count: 1
```

After clicking the Usluge mobile-menu item:

```text
title: Usluge | Ivan Jovanović feat. Sedative
body overflow: ""
body touchAction: ""
html overflow: ""
html touchAction: ""
dialog count: 0
horizontal overflow: 0
```

The mobile menu still closes, the overlay unmounts, scroll lock clears, and the
title updates during the same client-side navigation.

## 10. Ivan Settings Hero Regression

The WordPress-style shell injected:

```text
window.IvanTheme.assets.formWeddingHero.src
= http://127.0.0.1:4174/custom-wedding.jpg
```

On `/upit/svadba`, the production bundle rendered that override instead of the
bundled fallback:

| Check | Result |
| --- | --- |
| Custom wedding image selected | Pass |
| Image loaded | Pass |
| Image visible | Pass |
| Inquiry-page title | `Upit za svadbu \| Ivan Jovanović feat. Sedative` |

Harness page source also confirmed:

| Check | Result |
| --- | --- |
| `window.IvanTheme` byte position | `928` |
| App module byte position | `1671` |
| Inline bridge appears before app module | Pass |
| CSS uses `?ver=1.0.24` | Pass |
| JS uses `?ver=1.0.24` | Pass |
| Hero asset keys remain present | Pass |

## 11. Build And Package

Commands used:

```text
npm.cmd run build:theme
npm.cmd run zip:theme
```

`npm.cmd` was used because this Windows PowerShell policy blocks the `npm.ps1`
shim. The npm scripts themselves were executed unchanged.

Generated manifest:

| Item | Value |
| --- | --- |
| Manifest entry | `src/wp-entry.tsx` |
| JavaScript | `assets/index-CKvceOyb.js` |
| CSS | `assets/styles-BStCWnjc.css` |

## 12. Direct ZIP Audit

Final ZIP:

```text
wordpress-theme/ivan-sedative-theme.zip
```

SHA-256:

```text
DDE3D0F62D7DC9018A417E94FD714A41E88C01B9031BCEA3D3889696F4310D96
```

The ZIP was extracted to a disposable audit directory and checked directly.

| ZIP check | Result |
| --- | --- |
| Theme header version | `1.0.24` |
| Cache constant | `1.0.24` |
| React `18.3.1` bundle markers | `4` |
| Manifest entry | `src/wp-entry.tsx` |
| Manifest JS and CSS exist | Pass |
| Missing manifest assets | `0` |
| `createRoot` markers | `4` |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |
| `package-lock.json` | Absent |
| Frontend Allura markers | `0` |
| Frontend cursive markers | `0` |
| Frontend Lovable markers | `0` |
| `window.IvanTheme` bridge attached before `ivan-app` | Pass |
| Module-tag filter preserves inline bridge | Pass |
| All 15 Ivan Settings asset keys | Pass |
| Ivan Settings hero override | Pass |
| CF7 bridge hash unchanged | Pass |
| Calendar bridge hash unchanged | Pass |
| Mobile menu hash unchanged | Pass |
| FAQ route hash unchanged | Pass |
| Repertoire route hash unchanged | Pass |

Protected runtime hashes:

```text
src/wp-entry.tsx
DF476C7B5D5F1B775319EA669492CD3F7AE031AC2E48EBED0D81BE04D9F27794

src/lib/interaction-safety.ts
226259CEFCC1697045B761E56F9B10D4AA8804A9127ECD1FAFE009578C992DC2

src/lib/wp-bridge.ts
85BB91D3D741EBB0AF999DFC7F47D3276DDB0214A8851751E19811F75ACC3481

src/lib/page-hero-assets.ts
5134EA0103A0415F33B40553FD598351219C97E041186A2751A997DB02FF9CCE

src/components/site/MobileMenu.tsx
9C6B543D202989BA723EE0D66B5255ADDE510CB50E09B29AB00421D24FF90016

src/components/site/form/Cf7FormSlot.tsx
89E8010ADE56D3C3908408189D1FC32C73FCD907DC6387E54204E8FE78C655F1

src/routes/faq.tsx
94573F2C4CD7486DD02BB862AAF97CB38FCF5B72869C9F74E2AFC76523772ACE

src/routes/repertoar.tsx
DF06938D019C72A351425D6F18BEC2FF335F20C05E04F3894D0090CFA2895A49

wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php
31AC3A858BC92EB8EF5CD07F88D3FE6EC5E988168EFCFF6DE20518E62EBD41D9

wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php
B1E3E94F4F6A57A625280F76931D7C1E520C6727C07F12149FBD0AA29A8FCAA5

wordpress-theme/ivan-sedative-theme/inc/ivan-theme-data.php
F5CC902A6C6B5B703A95D61A4B2F2D8F9712D5F66E91EB9A824B6245C7F6C127

wordpress-theme/ivan-sedative-theme/inc/theme-settings.php
501BBA4BFC9F9BCAF9E495E3EE271BFB0F143B5B6ADC6377D1253B8A34370CDB

wordpress-theme/ivan-sedative-theme/inc/enqueue.php
AA360075FB37B5AEAC1CECDB73370A453D4E7F920A027E2EF46356C6A317D77C
```

## 13. Live Verification Instructions

After installing the `1.0.24` ZIP:

1. Clear WordPress page cache and CDN cache, then hard refresh.
2. Open the homepage.
3. Click Usluge, Repertoar i način rada, Kontakt, and FAQ without refreshing.
4. Confirm the browser-tab title changes immediately after every click.
5. Refresh `/kontakt` directly and confirm the Kontakt title remains correct.
6. On mobile, open the hamburger menu, tap Usluge, and confirm:
   - menu closes;
   - page scroll remains available;
   - title changes immediately.
7. Confirm an Ivan Settings hero override still appears on `/upit/svadba`.

## 14. Warnings And Limitations

- WordPress and SEO plugins remain responsible for server-rendered source
  metadata. This helper synchronizes the browser DOM after SPA navigation.
- Social crawlers generally inspect server-rendered HTML, not client-side DOM
  mutations. Existing WordPress/SEO-plugin output remains the crawler-facing
  source of truth.
- This environment cannot install the ZIP into the public WordPress admin.
  Final live confirmation must happen after installation and cache clearing.
- No commit, push, pull request, or merge was performed.

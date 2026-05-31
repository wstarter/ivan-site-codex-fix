# Interaction Lock Fix Report

## Files changed

- `src/lib/interaction-safety.ts`
- `src/wp-entry.tsx`
- `src/components/site/MobileMenu.tsx`
- `src/components/site/form/Cf7FormSlot.tsx`
- `src/routes/upit.svadba.tsx`
- `src/routes/upit.korporativna-proslava.tsx`
- `src/routes/upit.klupska-svirka.tsx`
- `src/routes/upit.rodjendan-jubilej.tsx`
- `vite.wp.config.ts` comment only

## Cause identified

The main interaction lock risk was stale global body state. `MobileMenu` locked `document.body.style.overflow` and `touchAction` while open, then restored previous values on cleanup. If the previous values were already stale, closing/unmounting the menu could preserve `overflow: hidden` or `touch-action: none`, leaving mobile pages unable to scroll or receive expected interactions.

The inquiry route freeze risk was CF7 re-initialization running synchronously during route mount. In WordPress, a slow or problematic `window.wpcf7.init` could block the route render path.

No other active invisible full-screen overlay was found in the app runtime path. The mobile menu portal is now unmounted when closed, and inactive overlays do not remain above the page.

## Safety changes made

- Added `unlockBodyInteraction()` to clear body/html `overflow`, `overflowX`, `overflowY`, and `touchAction`.
- Added removal for app lock classes including `menu-open`, `mobile-menu-open`, and `overlay-lock`.
- Added `installInteractionSafetyNet()` with unlocks for `pagehide`, `popstate`, `beforeunload`, `visibilitychange`, plus guarded `pushState`/`replaceState` unlock passes.
- Added `?ivan_debug=1` debug panel/logging for route, body/html lock state, center `elementFromPoint`, large fixed element count, `window.wpcf7`, and `IvanTheme.forms`.
- Removed React `StrictMode` from the WordPress entry only.
- Kept WordPress entry on `src/wp-entry.tsx`.
- Kept `createRoot(#root)`.
- Kept trailing slash normalization.
- Kept the WordPress bridge and CF7 fallback logic.
- Made `MobileMenu` clear locks when closed, unmounted, or route changes.
- Deferred CF7 init with `requestAnimationFrame`, falling back to `setTimeout(0)`, with cancellation and try/catch.
- Added route mount unlock passes to all four `/upit/*` inquiry routes.

## Build and ZIP commands

- Build command used: `npm run build:theme`
- ZIP command used: `npm run zip:theme`

Note: this app session did not have system `npm` or `zip` on PATH, so the npm scripts were executed through a temporary npm CLI and temporary external command shims. The project scripts themselves were not changed.

## Final theme ZIP

- `wordpress-theme/ivan-sedative-theme.zip`

## ZIP verification results

Verification was performed from the generated ZIP itself by extracting it to a temp folder and inspecting `ivan-sedative-theme/assets/app`.

- Manifest exists: pass
- Manifest entry: `src/wp-entry.tsx`
- Manifest output file: `assets/index-D7mI1gWB.js`
- Manifest CSS: `assets/styles-f1AKky4S.css`
- `hydrateRoot(document)` count: `0`
- `createRoot` count: `2`
- `"/assets/` root-reference count: `0`
- Interaction safety code present: pass
- Body/html unlock tokens present: pass
- Safety listeners present: `pagehide`, `popstate`, `beforeunload`, `visibilitychange`
- History unlock patch present: `pushState`, `replaceState`
- CF7 init deferred: pass (`requestAnimationFrame`, `setTimeout(0)`, and guarded `wpcf7.init`)
- ZIP contains corrected app build: pass

## What to test in WordPress

- Mobile homepage scroll works immediately after load.
- Mobile hamburger opens and closes repeatedly.
- Mobile menu links close the menu and do not leave the page locked.
- Desktop `/upit/svadba`, `/upit/korporativna-proslava`, `/upit/klupska-svirka`, and `/upit/rodjendan-jubilej` render without freezing.
- Browser back, forward, and refresh after visiting inquiry routes remain interactive.
- CF7 active with configured forms renders CF7 HTML and submits normally.
- CF7 inactive or missing configured HTML falls back to the React form.
- Add `?ivan_debug=1` to any URL to inspect lock state and fixed overlay diagnostics.

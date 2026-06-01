# Sprint 1.2 Face Visibility and Glassmorphism Report

## Result

The narrow visual patch is complete. The WordPress theme was rebuilt, packaged, and verified directly from the final installable ZIP.

- Final theme version: `1.0.10`
- React: `18.3.1`
- React DOM: `18.3.1`
- Final ZIP: `C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`
- ZIP SHA-256: `1C6212E051965C9860B635429F2867FD4D01843CE4259339C436953776D468FA`
- ZIP size: `3215052` bytes

## Files Changed

Source files:

- `src/styles.css`
- `wordpress-theme/ivan-sedative-theme/style.css`

Generated WordPress build assets and `wordpress-theme/ivan-sedative-theme.zip` were refreshed by the requested build and packaging flow.

No runtime, routing, form, CF7 bridge, calendar bridge, or WordPress mount files were modified.

## Mobile Face-Shadow Diagnosis

The face shadow had two causes:

1. The source portrait asset has intentional right-side lighting. The left side of the face is naturally shadowed in the original image.
2. Mobile CSS added avoidable extra darkness. The mobile `.hero-readability` gradient retained a strong black veil across the center-right portrait area before fading away.

The asset itself was not replaced or edited. The fix reduces the additional CSS veil while preserving the portrait's original premium, directional-light character.

## Mobile Portrait Changes

The mobile portrait remains anchored to the right and was not shrunk.

- Common mobile top offset changed from `4px` to `-14px`
- Effective upward move: `18px`
- Width at `390px` viewport remains `390px`
- Right offset at `390px` viewport remains `-39px` (`-10vw`)
- Opacity changed from `0.96` to `1`
- Mobile-only filter changed from `brightness(1.08) contrast(1.02)` to `brightness(1.14) contrast(1.02)`
- Existing shadow remains; no glow or halo was added

The mobile readability gradient now protects the text lane and falls away sooner across the portrait:

- Horizontal veil transitions through `0.76` at `44%`
- Reduced to `0.28` at `54%`
- Reduced to `0.08` at `66%`
- Transparent by `78%`

The vertical fade was also eased slightly so the portrait reads more clearly before the darker lower transition.

## Desktop Glassmorphism Changes

The desktop metrics block keeps its existing four-column layout but now behaves more like a translucent glass surface above the hero.

- Dark surface opacity reduced to reveal more background variation
- Backdrop filter increased from `blur(22px) saturate(115%)` to `blur(30px) saturate(135%) contrast(108%)`
- Added a subtle radial reflection within the panel surface
- Added a restrained directional sheen
- Increased the champagne-gold border presence slightly
- Strengthened the inner top reflection
- Added a quiet inset reflective edge through `::after`
- Added a soft inner surface glow and slightly deeper exterior shadow

The treatment remains restrained: no noisy texture, bright flare, or flashy reflection was added.

## Metrics Icon and Spacing Changes

Desktop:

- Icon size increased from `34px` to `40px`
- Icon-to-content gap increased from `14px` to `18px`
- Metric item minimum height increased from `5.25rem` to `5.75rem`

Mobile:

- Icon size increased from `24px` to `26px`
- Icon-to-content gap increased from `8px` to approximately `10.4px`

All four metrics remain visible on mobile, and desktop dividers remain intact.

## Live Browser QA

Local preview:

`http://127.0.0.1:4173/`

Mobile QA at `390x844`:

- Portrait top offset: `-14px`
- Portrait width: `390px`
- Portrait right offset: `-39px`
- Portrait opacity: `1`
- Portrait filter: `brightness(1.14) contrast(1.02)` plus the existing shadow
- Four mobile metrics: visible
- Mobile grid: two columns
- Mobile icon size: `26px`
- Mobile metrics panel: remains lightweight with no glass background

Desktop QA at `1440x1000`:

- Portrait width: `720px`
- Portrait x-position: `720px`
- Desktop portrait filter: original shadow only
- Metrics panel width: `1240px`
- Metrics grid: four equal `277.5px` columns
- Dividers: present between metric columns
- Desktop icon size: `40px`
- Desktop metric gap: `18px`
- Desktop CTA: remains single-line
- Computed glass filter: `blur(30px) saturate(1.35) contrast(1.08)`

## Build and Package Commands

```text
npm run build:theme
npm run zip:theme
```

Both commands passed.

The previous Google Fonts import-order warning did not reappear.

## Final ZIP Verification

Verified directly inside `wordpress-theme/ivan-sedative-theme.zip`:

- Theme header version: `1.0.10`
- Manifest path: `ivan-sedative-theme/assets/app/.vite/manifest.json`
- Manifest WordPress entry: `src/wp-entry.tsx`
- Entry marked `isEntry: true`
- Entry JS: `assets/index-zSmBCPyO.js`
- Entry CSS: `assets/styles-eNNC67uO.css`
- ZIP entry count: `35`
- `package-lock.json`: absent
- `inc/cf7-bridge.php`: present
- `inc/calendar-bridge.php`: present

Verified directly inside packaged JS:

- React runtime `18.3.1`: present
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- Root `/assets/` references: `0`
- Interaction safety markers: present
- Body and HTML unlock logic: present
- Deferred CF7 initialization support: present
- All four metrics: present
- Expected CTAs and Instagram URL: present
- Old video copy: absent

Verified directly inside packaged CSS:

- Google Fonts import remains first
- `Bebas Neue`: present
- `Manrope`: present
- `Allura`: absent
- `cursive`: absent
- Root `/assets/` references: `0`
- Portrait `top: -14px`: present
- Portrait mobile width retained: present
- Portrait right anchoring retained: present
- Portrait opacity and brightness changes: present
- Glow-style zero-offset shadow: absent
- Reduced mobile readability veil: present
- Desktop `40px` icons: present
- Desktop `18px` spacing: present
- `30px` glass blur and translucent reflections: present
- Four-column desktop metrics grid: present
- Desktop dividers: present
- Primary CTA no-wrap rule: present

## Protected Files

The following files match their pre-patch SHA-256 hashes:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/form/Cf7FormSlot.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## Remaining Limitation

The portrait source asset deliberately contains strong left-side face shadow. CSS no longer adds the earlier heavy veil across the face area, and the mobile portrait is clearer, brighter, and higher. Fully removing the remaining natural shadow would require editing or replacing the portrait asset, which was outside this narrow patch.

## Warnings

- In-app browser screenshot capture timed out during visual QA. Live DOM geometry, computed styles, original-asset inspection, successful production build output, and direct ZIP-level inspection were used for verification.
- A temporary external Vite command shim was used because the Bun-generated local Vite launcher does not execute correctly when invoked directly in this environment. The helper was removed after packaging, and the local launcher was restored.

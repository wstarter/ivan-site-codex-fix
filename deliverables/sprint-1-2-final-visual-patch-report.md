# Sprint 1.2 Final Visual Patch Report

## 1. Result

Sprint 1.2 is complete. The installable WordPress theme ZIP was rebuilt, packaged, and verified from the ZIP contents themselves.

Final theme version: `1.0.9`

Final ZIP:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

ZIP SHA-256:

`6024306E8DCE55F4FD08F6B8D52CD6D105C9401941B3F6A4FE1818A0D98A2AA0`

ZIP size: `3214930` bytes

## 2. Baseline Confirmed

- Branch: `sprint-1-1-hero-typography-corrections`
- React: `18.3.1`
- React DOM: `18.3.1`
- Starting WordPress theme version: `1.0.8`
- Final WordPress theme version: `1.0.9`
- `package-lock.json`: absent before and after the patch

## 3. Source Files Changed

- `src/routes/index.tsx`
- `src/styles.css`
- `wordpress-theme/ivan-sedative-theme/style.css`

Generated theme assets and `wordpress-theme/ivan-sedative-theme.zip` were refreshed by the requested build and packaging commands.

## 4. Scope Preserved

This patch did not redesign the page, change layout structure, change content, change typography, replace visual assets, alter form fields, or modify the WordPress runtime bridge.

## 5. Font Loading Preservation

The `1.0.8` Google Fonts loading correction remains intact. The built CSS starts with the Google Fonts import for `Bebas Neue` and `Manrope`.

Build result: the prior Google Fonts import-order warning did not reappear.

## 6. Mobile Portrait Adjustment

The mobile portrait was moved upward without shrinking it or pushing it farther right.

- `1.0.8` breathing room above portrait: approximately `24px`
- `1.0.9` breathing room above portrait: approximately `4px`
- Effective upward adjustment: `20px`
- Mobile width at `390px` viewport: `390px`
- Mobile right offset at `390px` viewport: `-39px` (`-10vw`)

The mobile-only portrait filter now uses `brightness(1.08) contrast(1.02)` with the existing shadow. No glow or halo effect was added.

## 7. Mobile Readability

The left text lane remains protected by the hero overlay. The gradient eases toward the portrait after the text lane so the face is more visible while the text remains readable.

At `390x844`, the video CTA remained above the fold:

- Video CTA top: approximately `666px`
- Video CTA bottom: approximately `714px`

## 8. Desktop Regression Check

Desktop hero behavior remains preserved at `1440x1000`.

- Portrait width: `720px`
- Portrait x-position: `720px`
- Desktop portrait filter: original shadow only
- Metrics panel width: `1240px`
- Metrics grid: four equal columns
- Primary CTA: no wrapping

## 9. Mobile Metrics Restored

All four mobile metrics now render:

- `15+ GODINA ISKUSTVA`
- `3.000+ USPEŠNO REALIZOVANIH DOGAĐAJA`
- `100k+ ZADOVOLJNIH GOSTIJU`
- `MUZIKA KOJA POVEZUJE`

At `390x844`, the metrics grid rendered as two columns with four visible items.

## 10. Metrics Presentation

The mobile metrics remain lightweight:

- No mobile panel background
- No mobile backdrop blur
- No mobile border
- No mobile box shadow

The desktop metrics presentation remains restrained:

- Four-column grid
- `34px` icons
- `14px` icon-to-copy gap
- Subtle dividers between metrics
- Existing glass panel preserved

## 11. Protected Files Confirmed Unchanged

The following protected files match their pre-patch SHA-256 hashes:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/form/Cf7FormSlot.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## 12. Build Command

```text
npm run build:theme
```

Result: passed.

## 13. ZIP Command

```text
npm run zip:theme
```

Result: passed.

## 14. ZIP Manifest Verification

Verified inside `wordpress-theme/ivan-sedative-theme.zip`:

- Manifest path exists: `ivan-sedative-theme/assets/app/.vite/manifest.json`
- Manifest entry exists: `src/wp-entry.tsx`
- Entry is marked `isEntry: true`
- Entry JS: `assets/index-DhKu114c.js`
- Entry CSS: `assets/styles-6H5i9ktV.css`

## 15. ZIP Runtime Verification

Verified inside the packaged JS:

- React runtime `18.3.1`: present
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- Root `/assets/` references in built JS: `0`
- Interaction safety markers: present
- Body and HTML overflow unlock logic: present
- Body and HTML touch-action handling: present
- `pagehide`, `popstate`, `beforeunload`, and `visibilitychange` safety listeners: present
- Deferred CF7 initialization support: present

## 16. ZIP CSS Verification

Verified inside the packaged CSS:

- Google Fonts import is first: yes
- `Bebas Neue`: present
- `Manrope`: present
- `Allura`: absent
- `cursive`: absent
- Gold token `#b79775`: present
- Root `/assets/` references in built CSS: `0`
- Mobile portrait upward offset: present
- Mobile portrait width retained: present
- Mobile portrait right offset retained: present
- Mobile brightness and contrast adjustment: present
- Glow-style zero-offset shadow: absent
- Desktop icon sizing and metric spacing: present
- Desktop metrics dividers and four-column grid: present
- Primary CTA no-wrap rule: present

## 17. ZIP Content Verification

Verified inside the ZIP:

- Theme header version: `1.0.9`
- ZIP entry count: `35`
- `package-lock.json`: absent
- `inc/cf7-bridge.php`: present
- `inc/calendar-bridge.php`: present
- Manifest root `/assets/` references: `0`

## 18. Content Verification

Verified inside the packaged JS:

- `PROVERI DOSTUPNE TERMINE`: present
- `POGLEDAJ VIDEO KAKO RADIMO`: present
- Instagram URL `https://www.instagram.com/p/DP3oHrNiHSD/`: present
- `POŠALJI UPIT`: present
- Old `Video snimanje pre rezervacije` copy: absent
- All four metric labels: present

## 19. Browser QA

Responsive verification was completed in the local in-app browser at:

`http://127.0.0.1:4173/`

Computed geometry and style checks passed at:

- Mobile: `390x844`
- Desktop: `1440x1000`

The browser viewport was reset after QA.

## 20. Warnings

- The Google Fonts import-order warning remains resolved.
- The local non-WordPress hydration mismatch remains an existing local-preview characteristic and was not changed by this WordPress packaging patch.
- In-app browser screenshot capture intermittently timed out during QA. Computed geometry, computed styles, live DOM checks, build output, and ZIP-level inspection were used for verification.
- A temporary external Vite command shim was used because the Bun-generated local Vite launcher does not run correctly when invoked directly in this environment. The temporary shim was removed after packaging, and the local launcher was restored.

## 21. WordPress Smoke Test Checklist

- Install `ivan-sedative-theme.zip`.
- Confirm the homepage portrait sits slightly higher on a mobile viewport.
- Confirm the face reads more clearly without glow or halo.
- Confirm hero text and CTA readability remain strong.
- Confirm all four mobile metrics render.
- Confirm desktop hero framing and glass metrics panel remain unchanged.
- Confirm mobile menu, mobile scrolling, SPA routes, and `/upit/*` routes still work normally.

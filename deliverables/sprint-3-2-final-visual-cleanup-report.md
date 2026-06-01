# Sprint 3.2 Final Visual Cleanup Report

## Status

Completed on branch `sprint-3-repertoar-nacin-rada`.

Final installable theme ZIP:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

SHA-256:

`7DAA850A1B72B6220204DFABB40109993FBE9BC338C01D8EC907B4A796A1A161`

No commit, push, or pull request was created.

## Baseline Gate

- Branch: `sprint-3-repertoar-nacin-rada`
- Clean worktree before edits: yes
- React: `18.3.1`
- React DOM: `18.3.1`
- Starting theme/cache version: `1.0.17`
- `package-lock.json`: absent
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- Root `"/assets/"` source references: `0`

## Exact Causes Identified

1. The homepage hero still used radial portrait masks, a soft vertical background gradient, and a mobile brightness/contrast boost. Together these reintroduced glow and made the portrait edge more noticeable.
2. The desktop metrics glass panel used bright radial reflections, strong white sheens, a brighter border, and a weaker dark fallback surface.
3. The active typography import was already Bebas Neue + Manrope, but an obsolete `.script` alias remained and the fallback stacks were generic. No active Allura import was present.
4. The centralized fallback navigation and the fresh WordPress menu seed still exposed separate `Način rada` and `Repertoar` links.

## Safety Changes Made

- Replaced hero radial portrait masks with controlled linear edge fades.
- Made the hero background solid black and removed the mobile portrait brightness boost.
- Darkened the desktop metrics fallback surface and reduced border, reflection, blur, and inset highlight strength.
- Removed unused `.script` and `.gold-glow` CSS aliases.
- Kept only Bebas Neue and Manrope, with closer Arial-based fallbacks.
- Centralized the visible navigation item as `Repertoar i način rada` linking to `/repertoar`.
- Added a dedicated footer fallback matching the required useful-links list.
- Normalized legacy WordPress menu links so `/nacin-rada` and `/repertoar#nacin-rada` display as one `/repertoar` item.
- Updated the fresh WordPress primary-menu seed to the merged link.
- Bumped theme and cache version to `1.0.18`.

## Protected Files

The protected runtime, CF7, calendar, FAQ, and mobile-menu safety files remained byte-identical:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/MobileMenu.tsx`
- `src/components/site/form/Cf7FormSlot.tsx`
- `src/routes/faq.tsx`
- `src/components/site/FaqAnswer.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## Files Changed

Source and theme files:

- `src/lib/site-data.ts`
- `src/styles.css`
- `vite.config.ts`
- `vite.wp.config.ts`
- `wordpress-theme/ivan-sedative-theme/THEME_SETUP.md`
- `wordpress-theme/ivan-sedative-theme/functions.php`
- `wordpress-theme/ivan-sedative-theme/inc/spa-pages.php`
- `wordpress-theme/ivan-sedative-theme/style.css`

Generated files:

- `dist-wp/.vite/manifest.json`
- `dist-wp/assets/index-BWDO7QZr.js`
- `dist-wp/assets/styles-BsmQjbxN.css`
- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-BWDO7QZr.js`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/styles-BsmQjbxN.css`

The prior hashed JS/CSS files were replaced by the new generated files.

## Build And Package

Build command:

`npm run build:theme`

ZIP command:

`npm run zip:theme`

The Windows host did not provide the Unix `zip` executable expected by the existing npm script. A temporary compatibility shim outside the repository invoked Windows `tar.exe` ZIP creation, allowed the unchanged npm script to run successfully, and was removed immediately afterward.

## ZIP Verification

The generated ZIP was extracted to a temporary folder outside the repository and audited directly.

- Theme version: `1.0.18`
- Asset/cache version: `1.0.18`
- Manifest entry: `src/wp-entry.tsx`
- Manifest JS: `assets/index-BWDO7QZr.js`
- Manifest CSS: `assets/styles-BsmQjbxN.css`
- React / React DOM source versions: `18.3.1` / `18.3.1`
- Bundled `18.3.1` runtime markers: `4`
- `createRoot` markers: `4`
- `hydrateRoot(document)`: `0`
- Root `"/assets/"` references in bundled JS/CSS: `0`
- `package-lock.json` entries: `0`
- Google Fonts imports in bundled CSS: `1`
- Allura references in bundled JS/CSS: `0`
- Cursive references in bundled JS/CSS: `0`
- `.script` aliases in bundled JS/CSS: `0`
- Lovable references in bundled frontend JS/CSS: `0`
- Solid black `.hero-bg`: present
- Linear `.hero-ivan` mask rules: present
- Radial `.hero-ivan` mask rules: `0`
- Radial metrics rules: `0`
- Dark metrics fallback surface: present
- Fresh WordPress menu seed merged item: present
- Fresh WordPress menu seed separate `Način rada`: `0`
- Runtime safety markers `pagehide`, `popstate`, `beforeunload`, `visibilitychange`, `touchAction`, `documentElement`, `wpcf7`, and deferred `requestAnimationFrame`: present

## Browser QA

Checked locally at `http://127.0.0.1:4173`.

Desktop:

- Homepage hero background is black and contains no visible glow behind Ivan.
- Portrait blends into the dark background without a hard right ending line.
- Metrics strip is darker and subtler with restrained highlights.
- Hero CTA widths fit their text without overflow.
- Header shows one `REPERTOAR I NAČIN RADA` item.
- Homepage active navigation styling remains present.
- Horizontal overflow: `0`.

Mobile at `390x844`:

- Hero composition remains intact with the right-edge fade resolved inside the viewport.
- Horizontal overflow: `0`.
- Mobile menu opens with exactly one fixed dialog and readable typography.
- Body scroll locks only while the menu is open.
- Closing the menu removes the fixed layer and clears the body lock.
- Navigating through the merged repertoire menu item closes the menu and clears the lock.
- Page scrolling moved normally after close.

`/repertoar`:

- Merged page renders.
- Eyebrow remains `REPERTOAR, ATMOSFERA I NAČIN RADA`.
- H1 remains `REPERTOAR I ŽANROVI KOJE SVIRAMO`.
- `/nacin-rada` still redirects to `/repertoar#nacin-rada`.

## Warnings And Limitations

- The install ZIP still contains two legacy `Lovable` words inside comments in protected `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`. That file was intentionally left byte-identical under the sprint do-not-touch rule. These comments are not emitted into frontend JS/CSS.
- The development dependency `@lovable.dev/vite-tanstack-config` remains in `package.json`, `bunfig.toml`, and the functional import in `vite.config.ts`; removing it would change the non-WordPress development toolchain. It is not shipped in the installable theme frontend output.
- Final live WordPress verification should still be performed after installing the ZIP, especially a hard refresh with cache cleared.

## WordPress Test Checklist

- Install `wordpress-theme/ivan-sedative-theme.zip`.
- Clear page cache, CDN cache, and browser cache.
- Hard refresh the homepage on desktop and mobile.
- Confirm no old cursive font flash appears.
- Confirm the hero stays black with no glow or portrait ending line.
- Confirm the desktop metrics strip stays dark and subtle.
- Confirm desktop and mobile navigation show one `Repertoar i način rada` link.
- Open and close the mobile menu, scroll the homepage, and navigate to `/repertoar`.
- Visit `/nacin-rada` and confirm redirect to `/repertoar#nacin-rada`.

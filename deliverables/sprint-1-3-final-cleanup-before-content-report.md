# Sprint 1.3 Final Cleanup Before Content Restructuring

## 1. Result

Sprint 1.3 is complete. The WordPress theme was rebuilt, packaged, and verified directly from the final installable ZIP.

- Theme version: `1.0.12`
- WordPress asset cache version: `1.0.12`
- React: `18.3.1`
- React DOM: `18.3.1`
- Final ZIP: `C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`
- ZIP SHA-256: `61C572D3E1C3E6035511ABC2E03671C0BCF2269DAC2406EB11CD2250ECE47E33`
- ZIP size: `3215221` bytes

## 2. Changed Files

Source files:

- `src/styles.css`
- `src/lib/site-data.ts`
- `src/components/site/Footer.tsx`
- `src/components/site/MobileMenu.tsx`
- `src/routes/index.tsx`
- `src/routes/nacin-rada.tsx`
- `src/routes/kontakt.tsx`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/functions.php`

Generated WordPress build assets and `wordpress-theme/ivan-sedative-theme.zip` were refreshed by the requested build and package flow.

## 3. Baseline Verification

Verified before editing:

- Branch: `sprint-1-1-hero-typography-corrections`
- React: `18.3.1`
- React DOM: `18.3.1`
- Theme version: `1.0.11`
- WordPress asset cache version: `1.0.11`
- Required runtime, bridge, and Vite config files: present
- `package-lock.json`: absent

## 4. Live WordPress and Local Preview Glass Diagnosis

The final WordPress CSS already included:

- `backdrop-filter`
- `-webkit-backdrop-filter`
- translucent fallback surface
- `position: relative`
- `isolation: isolate`
- `overflow: hidden`
- reflective `::before`
- inner-edge `::after`

The WordPress manifest and enqueue cache version are aligned. The remaining visual limitation is that the panel sits above a mostly black hero region, so true backdrop blur has little background variation to reveal.

No production URL was provided for direct remote inspection. The live-site diagnosis is based on WordPress enqueue code, local browser QA, and direct inspection of the packaged ZIP.

## 5. Glass Robustness Change

The existing restrained glass system was preserved. A subtle internal reflection band was added to `.hero-metrics-panel::after`:

```css
linear-gradient(
  180deg,
  rgba(255, 255, 255, 0.055) 0%,
  rgba(255, 255, 255, 0.016) 26%,
  transparent 58%
)
```

This adds consistent depth when true blur is visually quiet over the black hero background. It does not brighten the panel into a light or flashy surface.

## 6. Mobile Portrait Final Diagnosis

The mobile portrait layers were audited again:

- portrait mask
- portrait opacity
- portrait brightness and contrast
- readability gradients
- hero wrappers
- pseudo-elements
- blend-mode usage

The mobile horizontal readability veil already clears by `58%`, preserving the left text lane while avoiding a heavy layer over the face. No further CSS forcing was applied in this sprint.

The remaining face darkness is primarily asset-based. The source image uses strong directional lighting and naturally shadows the left side of Ivan's face.

Recommendation: if a brighter mobile face is still required, prepare a dedicated mobile hero asset with subtly lifted face exposure. Do not keep pushing the shared CSS treatment.

## 7. Footer Typography Cleanup

Footer typography now follows the site hierarchy:

- Footer brand title: `Bebas Neue`
- Footer headings: `Manrope`
- Footer body copy: `Manrope`
- Footer navigation: `Manrope`
- Footer contact information: `Manrope`
- Footer legal links and bottom bar: `Manrope`

The footer remains dark and premium without becoming a separate typography system.

## 8. Footer Navigation Label

Changed:

`NAVIGACIJA` to `Korisni linkovi`

Footer navigation labels are normalized to initial-uppercase sentence case:

- `Početna`
- `Usluge`
- `Način rada`
- `Repertoar`
- `Instagram`
- `Dopunski programi`
- `Kontakt`

## 9. Footer Credit

Changed:

`Powered by Prime Music Production`

to:

`Created by Starter Studio`

Verified link behavior:

- URL: `https://starter-studio.com`
- `target="_blank"`
- `rel="noreferrer"`

## 10. Placeholder Contact Inventory

The following placeholder or placeholder-marked contact values remain:

- `brand.email`: `booking@ivansedativeband.com` with a `PLACEHOLDER` source comment
- `brand.phone`: `+381 XX XXX XXXX`
- `brand.instagram`: `https://instagram.com/PLACEHOLDER`
- Contact page visible Instagram handle: `@PLACEHOLDER`
- Instagram page CTA visible handle: `@PLACEHOLDER`

`Prime Music Production` remains as the configured support brand in hero/support contexts. It is no longer used as the footer creation credit.

WordPress settings override the local brand email, phone, and Instagram URL when non-empty values are configured. Client confirmation is still required for the final phone number and Instagram handle.

## 11. CTA Copy Consistency

Primary availability CTAs now use:

`PROVERI DOSTUPNE TERMINE`

Updated locations:

- Homepage final CTA above footer
- Mobile menu bottom CTA
- `Način rada` page CTA
- `Kontakt` page CTA

Already correct:

- Homepage hero CTA

Compact exceptions retained:

- Header action: `DOSTUPNI TERMINI`
- Thank-you page compact action grid: `TERMINI`

These compact labels are intentionally short UI actions, not old primary `PROVERI TERMIN` or `PROVERI DATUM` variants.

## 12. Navigation Data Consistency

Navigation data flow:

- Header: `getNavItems()` using the WordPress `primary` menu when configured, otherwise local `navItems`
- Mobile menu: same `getNavItems()` source as header
- Footer: `getFooterNavItems()` using the WordPress `footer` menu when configured, otherwise local `navItems`
- Footer presentation: sentence-case normalization after resolving the footer menu

WordPress can therefore render a different live menu set when administrators configure a primary or footer menu. The local fallback contains the seven core navigation routes. The WordPress route registry also knows about additional SPA pages such as `/dostupni-termini` and `/faq`, but no routes were added, removed, or restructured in this sprint.

## 13. Mobile Menu QA

Verified at `390x844`:

- Menu opens
- Full CTA `PROVERI DOSTUPNE TERMINE` fits inside the menu width
- CTA width: `358px`
- CTA overflow: none
- Body locking applies only while menu is open
- Menu closes through the UI
- Dialog unmounts after close
- Body overflow clears after close
- HTML overflow clears after close
- Touch-action clears after close

## 14. Hero and Metrics QA

Mobile at `390x844`:

- Portrait width: `390px`
- Portrait right offset: `-39px`
- Portrait top offset: `-14px`
- Portrait opacity: `1`
- Portrait filter: `brightness(1.14) contrast(1.02)` plus existing shadow
- Four metrics: visible

Desktop:

- Four equal metric columns preserved
- Vertical dividers preserved
- Desktop icons: `44px`
- Desktop metric gap: `22px`
- Primary hero CTA remains single-line
- Glass fallback and internal sheen are active

## 15. Inquiry Route Smoke Test

Verified locally at `/upit/svadba`:

- Wedding inquiry form renders
- Scroll remains available
- Body overflow is clear
- HTML overflow is clear
- Body touch-action is clear
- Navigation back to homepage succeeds

## 16. Preserved Scope

Confirmed:

- FAQ content was not restructured
- Repertoar content was not replaced
- Repertoar and `Način rada` were not merged
- Route structure was not changed
- Forms were not modified
- CF7 bridge was not modified
- Calendar bridge was not modified
- WordPress mount architecture was not modified
- Interaction safety was not modified

## 17. Protected Files

The following files match their pre-patch SHA-256 hashes:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/form/Cf7FormSlot.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

The packaged ZIP copies of `inc/cf7-bridge.php` and `inc/calendar-bridge.php` were also extracted and hash-verified.

## 18. Asset Version

The WordPress asset cache version is no longer stale:

```php
define( 'IVAN_THEME_VERSION', '1.0.12' );
```

## 19. Build Command

```text
npm run build:theme
```

Result: passed.

## 20. ZIP Command

```text
npm run zip:theme
```

Result: passed.

## 21. Final ZIP Verification

Verified directly inside `wordpress-theme/ivan-sedative-theme.zip`:

- Theme version: `1.0.12`
- Asset cache version: `1.0.12`
- Stale cache version `1.0.0`: absent
- Manifest: present
- Manifest WordPress entry: `src/wp-entry.tsx`
- Entry JS: `assets/index-gmn7BJOz.js`
- Entry CSS: `assets/styles-BysM7Z02.css`
- React runtime `18.3.1`: present
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- Root `/assets/` references: `0`
- `Allura`: absent
- `cursive`: absent
- `Bebas Neue`: present
- `Manrope`: present
- Google Fonts import remains first
- Gold token `#b79775`: present
- `PROVERI DOSTUPNE TERMINE`: present
- Old `PROVERI TERMIN`: absent
- Old `PROVERI TERMINE`: absent
- Old `PROVERI DATUM`: absent
- `POGLEDAJ VIDEO KAKO RADIMO`: present
- Instagram URL `https://www.instagram.com/p/DP3oHrNiHSD/`: present
- `POŠALJI UPIT`: present
- `Video snimanje pre rezervacije`: absent
- `Created by Starter Studio`: present
- `https://starter-studio.com`: present
- `Korisni linkovi`: present
- Visible footer `NAVIGACIJA`: absent
- Footer sentence-case normalizer: present
- Interaction-safety markers: present
- Body and HTML unlock logic: present
- Deferred CF7 initialization support: present
- `package-lock.json`: absent
- CF7 bridge: unchanged
- Calendar bridge: unchanged
- Updated glass fallback: present
- `backdrop-filter`: present
- `-webkit-backdrop-filter`: present
- Reflection pseudo-layers: present
- New internal sheen: present
- Current metric icon sizing and spacing: present
- All four mobile metrics: present

## 22. Limitations and Warnings

- No production URL was supplied, so remote WordPress, browser, or CDN cache state could not be inspected directly.
- True backdrop blur remains visually restrained because the panel sits above a mostly black hero area. The fallback surface and reflection layers provide consistent depth.
- Remaining portrait face darkness is primarily baked into the source image asset.
- Placeholder contact values still require client confirmation.
- A temporary external Vite command shim was used because the Bun-generated local Vite launcher does not execute correctly when invoked directly in this environment. The helper was removed after packaging and the launcher was restored.

# Sprint 1.2 - Mobile Hero Reconstruction and Font Loading Fix

Date: 2026-06-01

## 1. Changed files

Source files changed:

- `src/styles.css`
- `src/routes/index.tsx`
- `wordpress-theme/ivan-sedative-theme/style.css`

Generated build/package output refreshed:

- `dist-wp/`
- `wordpress-theme/ivan-sedative-theme/assets/app/`
- `wordpress-theme/ivan-sedative-theme.zip`

Report added:

- `deliverables/sprint-1-2-mobile-hero-font-loading-report.md`

## 2. Baseline verification before changes

Baseline checks passed before edits:

- Branch from `.git/HEAD`: `sprint-1-1-hero-typography-corrections`
- `package.json` React: `18.3.1`
- `package.json` React DOM: `18.3.1`
- WordPress theme version before patch: `1.0.7`
- `package-lock.json`: absent

Required files existed:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/components/site/MobileMenu.tsx`
- `src/components/site/form/Cf7FormSlot.tsx`
- `vite.wp.config.ts`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## 3. Font loading investigation

The Google Fonts import was present in `src/styles.css`, but it appeared after Tailwind imports, `@source`, a custom variant directive, and comments.

Previous order:

```css
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;500;600;700&display=swap");
```

That ordering caused Vite CSS optimization to warn that `@import` rules must precede other rules.

## 4. Exact Google Fonts ordering fix

The Google Fonts import was moved to the first line of `src/styles.css`, before Tailwind imports and directives:

```css
@import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;500;600;700&display=swap");
@import "tailwindcss" source(none);
@source "../src";
@import "tw-animate-css";
```

Result:

- `npm run build:theme` completed without the previous Google Fonts import-order warning.
- The final ZIP CSS begins with Vite's normalized valid form:

```css
@import"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;500;600;700&display=swap";
```

## 5. Bebas Neue and Manrope verification

Live browser QA after the fix:

- `document.fonts.check('48px "Bebas Neue"')`: `true`
- `document.fonts.check('16px "Manrope"')`: `true`
- Hero title computed family: `"Bebas Neue", sans-serif`
- Body computed family: `Manrope, sans-serif`

The final ZIP built CSS contains both `Bebas Neue` and `Manrope`.

## 6. Allura and cursive verification

Verified in the final ZIP built CSS and JS:

- `Allura`: absent
- `cursive`: absent
- No script, serif, handwritten, or third UI font was introduced.

## 7. Mobile hero image reconstruction

Ivan is no longer treated as a small right-side accent.

Mobile portrait CSS now uses:

- Base mobile width: `98vw`
- Up to `430px`: `100vw`
- Up to `390px`: `100vw`
- Up to `360px`: `104vw`
- Base top position: `24px` below the hero stage boundary
- Up to `360px`: `22px`
- Base right offset: `-10vw`
- Up to `360px`: `-12vw`
- Maximum mobile height: `54vh` to `56vh`
- `object-position: top right`
- A larger right-biased radial mask for a soft edge into black.
- Opacity restored to `0.96`.

Computed QA at `390x844`:

- Header bottom: `77px`
- Hero stage top: `77px`
- Portrait top: `101px`
- Portrait breathing space below the header/stage boundary: `24px`
- Portrait width: `390px`
- Portrait height: approximately `464px`
- Portrait visible x-position: approximately `39px`

Ivan is large, high, and visually dominant again.

## 8. Mobile hero typography changes

The font loading fix guarantees the same real fonts on desktop and mobile. Mobile sizing was also adjusted to keep the same visual system:

- Hero title: `clamp(2.9rem, 12.6vw, 3.9rem)`
- Hero title max width: `11.5rem`
- Hero title line height: `0.92`
- Hero title letter spacing: `0.005em`
- Eyebrow max width: `11.5rem`
- Existing Manrope eyebrow, paragraph, support text, buttons, and video CTA remain intact.

The result stays a responsive desktop composition rather than a separate poster-style mobile treatment.

## 9. Mobile hero image/text relationship

The image is intentionally large and integrated into the upper hero zone.

Readability is protected by:

- Left-to-right black overlay with strong opacity through the text lane.
- Lower black fade into the hero background.
- Right-biased radial portrait mask.
- A narrower title lane.

The image remains visible and dominant while key text remains legible. The CTA stack is not hidden.

Computed QA at `390x844`:

- Video CTA top: approximately `666px`
- Video CTA remains visible before the `844px` fold.
- Mobile metrics remain present below the CTA stack.
- Both slogan lines resolve to `rgb(245, 240, 232)`.
- `PRIME MUSIC PRODUCTION` resolves to `rgb(184, 175, 163)`.

## 10. Desktop hero regression check

Desktop QA at `1440x1000` passed:

- Primary CTA remains one line.
- Primary CTA computed `white-space`: `nowrap`.
- Hero stage bottom border remains absent.
- Portrait blend remains masked into black.
- Desktop metrics panel remains present.
- Four metrics remain equal width.

## 11. Metrics glass effect review

Backdrop blur is naturally subtle because much of the hero background is black. The panel was not brightened into a fake light card.

The desktop panel keeps:

- Dark translucent gradient.
- `blur(22px) saturate(115%)`.
- Thin champagne/gold border.
- Inner upper highlight.
- Inner lower edge.
- Restrained outer shadow.

A subtle reflected pseudo-layer was added:

```css
linear-gradient(112deg, rgba(183, 151, 117, 0.12) 0%, transparent 26%, rgba(255, 255, 255, 0.045) 52%, transparent 78%)
```

This gives the panel a restrained glass reflection without making it flashy.

Computed desktop QA:

- Panel width: approximately `1240px`
- Panel backdrop filter: `blur(22px) saturate(1.15)`
- Four equal columns: approximately `277.5px` each
- Desktop dividers remain present.
- Mobile metrics remain lightweight, transparent, and free of heavy glass styling.

## 12. Metrics icon size and spacing changes

Desktop metrics icons were increased and separated from values:

- Desktop icon size: `34px` by `34px`
- Desktop icon-to-number gap: `0.875rem`, computed as `14px`
- Mobile icons remain compact at `24px` by `24px`

The icons remain thin and premium.

## 13. Mobile menu active-state verification

The existing rounded active-state rule was verified and left intact:

```css
border-radius: 0.65rem !important;
```

No mobile menu behavior or interaction-safety code was modified.

## 14. FAQ confirmation

FAQ content and structure were not modified.

## 15. Repertoar / Nacin rada confirmation

Repertoar content, Nacin rada content, and their structure were not modified or merged.

## 16. Route structure confirmation

Routing architecture was not changed.

## 17. Protected runtime and bridge file confirmation

SHA-256 hashes were captured before edits and checked again after build/package. All remained unchanged:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/form/Cf7FormSlot.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

## 18. Build command used

```text
npm run build:theme
```

## 19. ZIP command used

```text
npm run zip:theme
```

## 20. Final ZIP path

```text
C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip
```

## 21. Verification from final ZIP itself

The final installable ZIP was opened and inspected directly.

Passed:

- Theme version: `1.0.8`
- ZIP entries: `35`
- Manifest exists.
- Manifest entry: `src/wp-entry.tsx`
- Built JS: `assets/index-A6kE6roQ.js`
- Built CSS: `assets/styles-RMuN0FmK.css`
- Built React runtime marker: `18.3.1`
- Source dependencies: React `18.3.1`, React DOM `18.3.1`
- `hydrateRoot(document)` count: `0`
- `createRoot`: present
- Root `/assets/` reference count: `0`
- `Allura`: absent
- `cursive`: absent
- `Bebas Neue`: present
- `Manrope`: present
- Google Fonts import emitted first in built CSS.
- `#b79775`: present
- `PROVERI DOSTUPNE TERMINE`: present
- `POGLEDAJ VIDEO KAKO RADIMO`: present
- Instagram URL `https://www.instagram.com/p/DP3oHrNiHSD/`: present
- Inquiry submit label: present
- `Video snimanje pre rezervacije`: absent
- Interaction safety markers: present
- `package-lock.json`: not introduced and absent from ZIP
- Large high mobile portrait CSS: present
- Mobile text-lane overlay CSS: present
- Mobile typography normalization CSS: present
- Desktop glass reflection CSS: present
- Desktop metrics divider CSS: present
- Equal-width desktop metrics grid CSS: present
- Desktop `34px` metrics icon CSS: present
- Desktop `0.875rem` metrics icon spacing CSS: present
- Lightweight mobile metrics CSS: present
- Desktop CTA nowrap CSS: present

## 22. Warnings

Resolved:

- The previous Vite Google Fonts `@import` ordering warning is gone.

Remaining local preview notes:

- The local non-WordPress preview entry still has the previously observed hydration mismatch behavior from `src/routes/__root.tsx`.
- The in-app screenshot capture timed out during this run. Responsive geometry, computed CSS, font availability, ZIP contents, and build output were verified directly.
- The WordPress install ZIP independently verifies `src/wp-entry.tsx`, `createRoot`, and zero `hydrateRoot(document)`.

Tooling note:

- The Bun-generated `node_modules/.bin/vite.exe` launcher could not start Vite directly. A temporary external Vite command shim was used while running the npm wrapper, and the original launcher was restored immediately after the build. No dependency installation or source dependency modification was performed.

## Commit / push status

- No commit created.
- No push performed.


# Sprint 1.3.2 - Mobile Menu Typography Report

## 1. Changed Files

Authored source changes:

- `src/styles.css`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/functions.php`

Generated theme output refreshed by the required build:

- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-C8wtoHff.js`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/styles-CPR4YZDH.css`
- `wordpress-theme/ivan-sedative-theme.zip`

No visual asset source was changed.

## 2. Baseline Verification Before Changes

- Repository: `C:\Users\Nikola\Documents\Ivan-site-codex-fix`
- Existing branch: `sprint-1-1-hero-typography-corrections`
- `react`: `18.3.1`
- `react-dom`: `18.3.1`
- Starting theme version: `1.0.13`
- Starting asset cache version: `1.0.13`, not stale `1.0.0`
- Required WordPress entry, interaction safety, bridge, mobile menu, Vite config, CF7 bridge, and calendar bridge files existed.
- `package-lock.json` was absent and remains absent.

## 3. Exact Mobile Menu Title Typography Changes

Only the shared `.menu-item-title` rule changed:

```css
.menu-item-title {
  font-size: clamp(1.18rem, 4.75vw, 1.4rem);
  line-height: 1.02;
  letter-spacing: 0.01em;
  overflow-wrap: anywhere;
}
```

Previous values:

```css
font-size: clamp(1.05rem, 4.25vw, 1.25rem);
line-height: 1;
letter-spacing: 0.005em;
```

At `390px` and `320px` viewport widths, local computed menu-title size increased from `16.8px` to `18.88px`, approximately `12.4%`. Bebas Neue remains the title font. Subtitles remain unchanged in Manrope at `11.52px`.

The retained `overflow-wrap: anywhere` safeguard keeps long WordPress-managed menu labels controlled if wrapping is needed.

## 4. Active Mobile Menu State

Active state did not regress:

- Existing rounded active background remains.
- Existing `menu-item-active` class remains.
- Active title remains champagne/gold through `var(--color-primary)`.
- Inactive title hierarchy remains unchanged.
- Icon blocks, arrows, menu structure, and route behavior remain unchanged.

Local computed QA on `/kontakt` confirmed:

- Active title color: `rgb(183, 151, 117)`
- Rounded active background remains visible.
- Menu title font remains `"Bebas Neue", sans-serif`.

## 5. Mobile Menu CTA

The bottom CTA remains:

`PROVERI DOSTUPNE TERMINE`

No label, route, or CTA styling change was made. Local computed QA confirmed `white-space: nowrap` and successful one-line fit:

- `390px` viewport: CTA width `358px`, fits.
- `320px` viewport: CTA width `288px`, fits.

## 6. Unchanged Visual Systems

This sprint did not change:

- Hero layout or portrait
- Metrics glass panel
- Desktop or mobile metrics
- Footer
- Final CTA
- Desktop header layout
- Typography outside the shared mobile menu title rule

## 7. Unchanged Content And Runtime Areas

This sprint did not change:

- FAQ content or structure
- Repertoar content
- Nacin rada content
- Forms
- Calendar
- CF7 bridge
- Runtime safety
- Routing
- WordPress mount architecture

Protected files were hash-checked after the build and remain unchanged:

| File | SHA-256 |
| --- | --- |
| `src/wp-entry.tsx` | `DF476C7B5D5F1B775319EA669492CD3F7AE031AC2E48EBED0D81BE04D9F27794` |
| `src/lib/interaction-safety.ts` | `226259CEFCC1697045B761E56F9B10D4AA8804A9127ECD1FAFE009578C992DC2` |
| `src/lib/wp-bridge.ts` | `85BB91D3D741EBB0AF999DFC7F47D3276DDB0214A8851751E19811F75ACC3481` |
| `src/components/site/form/Cf7FormSlot.tsx` | `89E8010ADE56D3C3908408189D1FC32C73FCD907DC6387E54204E8FE78C655F1` |
| `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php` | `31AC3A858BC92EB8EF5CD07F88D3FE6EC5E988168EFCFF6DE20518E62EBD41D9` |
| `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php` | `B1E3E94F4F6A57A625280F76931D7C1E520C6727C07F12149FBD0AA29A8FCAA5` |

The packaged ZIP bridge PHP hashes also match the protected baseline.

## 8. Build Command

```text
npm run build:theme
```

Result: passed.

## 9. ZIP Command

```text
npm run zip:theme
```

Result: passed.

## 10. Final ZIP

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

SHA-256:

`E1C2622A496EAAB2536B7248F974D7BEC338DF334CEE5FD606083396DECC27B9`

## 11. ZIP Verification Summary

The final install ZIP itself was inspected directly.

- Theme version is `1.0.14`.
- Asset cache version is `1.0.14`, not stale `1.0.0`.
- Manifest exists at `assets/app/.vite/manifest.json`.
- Manifest entry is `src/wp-entry.tsx`.
- Built JS is `assets/index-C8wtoHff.js`.
- Built CSS is `assets/styles-CPR4YZDH.css`.
- React runtime marker `18.3.1` is present; `package.json` still pins React and React DOM to `18.3.1`.
- `hydrateRoot(document)` count is `0`.
- `createRoot` marker is present.
- Root `/assets/` references count is `0`.
- `Allura` and cursive UI fonts are absent.
- `Bebas Neue`, `Manrope`, and the Google Fonts import remain present. The minified Google Fonts import remains before generated CSS layers.
- `#b79775` remains present.
- `PROVERI DOSTUPNE TERMINE`, `POGLEDAJ VIDEO KAKO RADIMO`, and `POŠALJI UPIT` remain present.
- `Created by Starter Studio`, `https://starter-studio.com`, and `Korisni linkovi` remain present.
- Interaction-safety markers including `ivan_debug`, `overlay-lock`, `pagehide`, and `beforeunload` remain present.
- `package-lock.json` is absent from repository and ZIP.
- The packaged `.menu-item-title` rule includes the new title clamp, line-height, tracking, and wrap safeguard.
- Packaged active mobile menu background and gold-title rules remain present.
- Packaged availability CTA no-wrap rule remains present.
- Packaged metrics glass and final CTA eyebrow rules remain present.

Local browser QA confirmed:

- At `390px` and `320px`, standard local menu rows do not overflow.
- Opening the menu applies the expected body lock only while open.
- Closing the menu clears body/html lock styles and leaves zero pointer-active large fixed overlays.
- Active `/kontakt` mobile item remains gold with rounded background.
- CTA remains readable and one-line at both checked widths.

## 12. Warnings And Limitations

- Live WordPress remains the final visual proof after installation.
- The standalone local preview uses its fallback navigation rows: `Pocetna`, `Usluge`, `Nacin rada`, `Repertoar`, `Instagram`, `Dopunski programi`, and `Kontakt`.
- `Dostupni termini` and `Najcesca pitanja i odgovori` are WordPress-managed menu rows when configured live, so they were not rendered as rows in the standalone preview. They receive the same shared `.menu-item-title` rule, and the retained `overflow-wrap: anywhere` safeguard protects the longer FAQ label.
- The mobile CTA for available dates was rendered and tested locally at both checked widths.
- A Codex/Electron screenshot capture timed out locally. DOM and computed-style QA completed successfully.
- No commit or push was performed.

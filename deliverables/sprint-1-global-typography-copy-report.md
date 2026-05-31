# Sprint 1 Global Typography / Copy Report

Report date: 2026-05-31

Workspace:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix`

## Status

**Sprint 1 completed successfully.**

The final WordPress installer ZIP was regenerated and inspected directly. Sprint 2 FAQ content restructuring was not implemented.

## 1. Changed files

Source files:

- `src/styles.css`
- `src/lib/site-data.ts`
- `src/routes/index.tsx`
- `src/routes/faq.tsx`
- `src/routes/upit.svadba.tsx`
- `src/routes/upit.korporativna-proslava.tsx`
- `src/routes/upit.klupska-svirka.tsx`
- `src/routes/upit.rodjendan-jubilej.tsx`
- `src/components/site/MobileMenu.tsx`
- `src/components/site/form/InfoPanel.tsx`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `deliverables/sprint-1-global-typography-copy-report.md`

Generated output refreshed by the build and packaging scripts:

- `dist-wp/*`
- `wordpress-theme/ivan-sedative-theme/assets/app/*`
- `wordpress-theme/ivan-sedative-theme.zip`

## 2. Baseline confirmation before changes

| Check | Result |
| --- | --- |
| Current branch | `main` |
| `package.json` React | `18.3.1` |
| `package.json` React DOM | `18.3.1` |
| `bun.lock` application React | `react@18.3.1` |
| `bun.lock` application React DOM | `react-dom@18.3.1` |
| Theme version before Sprint 1 | `1.0.3` |
| `package-lock.json` exists | No |
| Required protected files exist | Pass |
| `src/wp-entry.tsx` uses `createRoot` | Pass |
| `hydrateRoot(document)` count | `0` |
| Interaction safety helper exists | Pass |
| Mobile menu interaction cleanup exists | Pass |

## 3. Typography changes

The rendered UI typography system now uses only:

- `Bebas Neue` for display headings, card titles, and metric numbers.
- `Manrope` for body text, navigation, buttons, forms, helper text, FAQ copy, and former signature/script treatments.

Removed from rendered UI:

- `Allura` Google Fonts import.
- `--font-script`.
- `--font-signature`.
- Script/cursive font assignments.

Existing `.script`, `.signature-text`, `.hero-signature`, and `.text-signature` classes were remapped to `Manrope`.

ZIP verification confirms that built CSS and JS contain neither `Allura` nor `cursive`.

## 4. Gold token changes

The global champagne accent token is now:

`#b79775`

Visible gold derivatives were consolidated through CSS variables and controlled `color-mix()` expressions. Old scattered `#D99A3A`, `#F1B75A`, `#B87933`, and matching hardcoded RGB derivatives were removed from rendered UI source.

ZIP verification confirms `#b79775` is present in built CSS.

## 5. Homepage CTA changes

Homepage hero CTA updates:

| CTA | Label | Target |
| --- | --- | --- |
| Primary | `PROVERI DOSTUPNE TERMINE` | `/dostupni-termini` |
| Secondary | `POŠALJI UPIT` | `/usluge` |
| Video | `POGLEDAJ VIDEO KAKO RADIMO` | `https://www.instagram.com/p/DP3oHrNiHSD/` |

The video CTA uses an external anchor through the existing `CTALink` external mode with:

- `target="_blank"`
- `rel="noreferrer"`

## 6. FAQ label-only changes

Visible FAQ labels were renamed to:

`NAJČEŠĆA PITANJA I ODGOVORI`

Updated surfaces:

- Homepage FAQ preview eyebrow, title, and CTA.
- `/faq` page hero eyebrow and title.
- React WordPress menu mapping for `/faq`, including visible navigation and footer output.

The protected WordPress `inc/*` files were not modified. Their stored default `FAQ` setup label is normalized by the allowed React menu mapper whenever `/faq` menu data is rendered.

FAQ route URL remains:

`/faq`

FAQ list data was not restructured or replaced.

## 7. Global form copy changes

All four inquiry forms now use:

- Budget label: `Koji je vaš planirani budžet?`
- Submit label: `POŠALJI UPIT`

The shared 24h response panel and workflow copy now use:

`Svakom upitu pristupamo lično i preuzimamo dalju komunikaciju do potvrde termina.`

## 8. Wedding-only form changes

Applied only to `/upit/svadba`:

- Added helper text beneath `Dodatni muzički & show program`:
  `Kvarteti za vreme skupa svatova, DJ-evi za vreme torte, kabare program i još mnogo toga.`
- Removed `Video snimanje pre rezervacije` from local state, validation, rendered form fields, and resulting local form payload.
- Rephrased `Internacionalno venčanje` to:
  `Da li očekujete veći broj stranih gostiju ili gostiju iz različitih kultura?`
- Renumbered subsequent wedding fields without gaps.

No CF7 recommended template comment containing the removed wedding video field was found outside generated assets. Protected CF7 bridge mechanics were not modified.

## 9. Other forms

Corporate, club, and birthday forms received only the required global neutral copy updates:

- Shared budget label.
- Shared submit label.
- Shared response-panel copy.

Wedding-specific field additions, removals, and renaming were not applied to the other forms.

## 10. Theme version

Updated:

`wordpress-theme/ivan-sedative-theme/style.css`

From:

`Version: 1.0.3`

To:

`Version: 1.0.4`

## 11. Build and packaging

Required scripts executed successfully:

```powershell
npm run build:theme
npm run zip:theme
```

Final installer ZIP:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

ZIP metadata:

| Check | Result |
| --- | --- |
| Size | `3214581` bytes |
| Modified time | `2026-05-31T15:31:24.8365007+02:00` |
| ZIP entry count | `35` |

## 12. ZIP verification results

The final installable ZIP itself was opened and inspected.

| Required check | Result |
| --- | --- |
| Theme version is `1.0.4` | Pass |
| Manifest exists | Pass |
| Manifest entry is `src/wp-entry.tsx` | Pass |
| Built JS is present | Pass: `assets/index-DyVYPEc_.js` |
| Built CSS is present | Pass: `assets/styles-D0TtBoLv.css` |
| `hydrateRoot(document)` count | `0` |
| `createRoot` exists | Pass |
| Root-absolute `/assets/` reference count | `0` |
| `Allura` absent from built CSS/JS | Pass |
| `cursive` absent from built CSS/JS | Pass |
| `#b79775` present in built CSS | Pass |
| `PROVERI DOSTUPNE TERMINE` present | Pass |
| `POGLEDAJ VIDEO KAKO RADIMO` present | Pass |
| Instagram video URL present | Pass |
| External anchor markers present | Pass |
| `NAJČEŠĆA PITANJA I ODGOVORI` present | Pass |
| `Koji je vaš planirani budžet?` present | Pass |
| Universal `POŠALJI UPIT` present | Pass |
| Old form-specific submit labels absent | Pass |
| `Video snimanje pre rezervacije` absent | Pass |
| New wedding international-guests question present | Pass |
| New wedding helper text present | Pass |
| Shared neutral 24h response text present | Pass |
| Mobile menu safety marker present | Pass |
| Overlay lock safety marker present | Pass |
| Touch-action safety marker present | Pass |
| Optional interaction debug marker present | Pass |

## 13. Runtime preservation

| Required source check after build | Result |
| --- | --- |
| React remains exactly `18.3.1` | Pass |
| React DOM remains exactly `18.3.1` | Pass |
| `bun.lock` application React remains `18.3.1` | Pass |
| `bun.lock` application React DOM remains `18.3.1` | Pass |
| `package-lock.json` exists | No |
| WordPress entry remains `src/wp-entry.tsx` | Pass |
| `createRoot` remains present | Pass |
| `hydrateRoot(document)` count remains `0` | Pass |
| Interaction-safety helper remains present | Pass |
| Mobile menu cleanup remains present | Pass |

## 14. Preserved architecture and scope

The WordPress mount architecture remains unchanged:

- WordPress still owns `html`, `head`, and `body`.
- React still mounts only inside `#root`.
- `src/wp-entry.tsx` was not modified.
- `src/lib/interaction-safety.ts` was not modified.
- CF7 bridge mechanics were not modified.
- Calendar logic was not modified.
- WordPress rewrite logic was not modified.
- Mobile menu interaction behavior was not modified.

Sprint 2 items were not implemented:

- FAQ data was not replaced or restructured.
- Repertoar content was not replaced.

## 15. Warnings

- Vite completed successfully with the existing non-blocking CSS optimizer warning that the Google Fonts `@import` follows generated rules. The import now requests only `Bebas Neue` and `Manrope`.
- WordPress frontend smoke testing was not run in this local packaging pass.
- No commit or push was performed.

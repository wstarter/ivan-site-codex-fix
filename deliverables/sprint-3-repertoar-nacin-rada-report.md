# Sprint 3 - Repertoar And Nacin Rada Report

## 1. Changed Files

Authored source changes:

- `src/lib/repertoire-data.ts`
- `src/lib/site-data.ts`
- `src/routes/repertoar.tsx`
- `src/routes/nacin-rada.tsx`
- `src/routes/index.tsx`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/functions.php`

Generated theme output refreshed by the required build:

- `dist-wp/.vite/manifest.json`
- `dist-wp/assets/index-D31GrC20.js`
- `dist-wp/assets/styles-Cpuioj5j.css`
- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-D31GrC20.js`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/styles-Cpuioj5j.css`
- `wordpress-theme/ivan-sedative-theme.zip`

The replaced hashed JS/CSS assets from theme `1.0.15` were removed by the build copy step.

## 2. Baseline Verification Before Changes

- Repository: `C:\Users\Nikola\Documents\Ivan-site-codex-fix`
- Existing branch: `sprint-3-repertoar-nacin-rada`
- Git working tree: clean before work started
- Local Git configuration preserved:
  - `core.autocrlf false`
  - `core.eol lf`
- `react`: `18.3.1`
- `react-dom`: `18.3.1`
- Starting theme version: `1.0.15`
- Starting asset cache version: `1.0.15`
- `src/wp-entry.tsx` existed, used `createRoot`, and contained zero `hydrateRoot(document)` calls.
- Required runtime, bridge, mobile menu, Vite config, CF7 bridge, and calendar bridge files existed.
- `package-lock.json` was absent and remains absent.

## 3. Previous Repertoar Content

Old Repertoar ownership was split between:

- `src/lib/site-data.ts`: a short eight-item `repertoireCategories` placeholder array
- `src/routes/repertoar.tsx`: page shell, category-card renderer, old short hero copy, and the repeated placeholder note `Lista pesama biće dodata nakon dostavljanja repertoara.`
- `src/routes/index.tsx`: compact homepage preview based on the same short placeholder array

## 4. Previous Nacin Rada Content

`src/routes/nacin-rada.tsx` owns the Način rada page shell and detail sections. Its five workflow steps remain centralized in `src/lib/site-data.ts` as `workflowSteps`.

The existing process content was already useful and did not conflict with the expanded Repertoar page.

## 5. Centralization

New Repertoar ownership is centralized in:

`src/lib/repertoire-data.ts`

It exports:

- `repertoireIntro`: four readable introduction paragraphs
- `repertoireSections`: seven full content blocks with title, full paragraphs, and a concise homepage preview

The Repertoar page and homepage preview now consume the same central data without duplicating the long copy.

## 6. Replaced Content

The Repertoar page now uses:

- Eyebrow: `REPERTOAR, ATMOSFERA I NAČIN RADA`
- H1: `REPERTOAR I ŽANROVI KOJE SVIRAMO`
- A four-paragraph introduction explaining repertoire, atmosphere, protocol, and event flow
- Seven full content cards
- Existing dark premium panel/card styling
- Existing inquiry CTA

## 7. Final Seven Blocks

All requested content blocks are present:

1. `DOMAĆI POP`
2. `DOMAĆI HITOVI`
3. `MUZIKA 90-IH`
4. `STRANA MUZIKA`
5. `NARODNA MUZIKA`
6. `KOLA`
7. `PRVI PLES, ULAZAK I TORTA`

## 8. Old Repertoar Tail Removal

The old `repertoireCategories` array was removed from `src/lib/site-data.ts`.

The following obsolete content is absent from the final built JS:

- Placeholder note about adding a song list later
- Old `Club / House` placeholder block
- Duplicate old short category-card tail

## 9. Nacin Rada Route

`/nacin-rada` remains alive and was not removed or redirected.

The existing workflow page remains focused on process. A small bridge section was added:

- Eyebrow: `REPERTOAR I ATMOSFERA`
- Heading: `Kako muzika prati tok događaja`
- CTA: `POGLEDAJ REPERTOAR`
- Link target: `/repertoar`

The full Repertoar copy is not duplicated on `/nacin-rada`.

## 10. Homepage Preview

The homepage remains a compact preview. It renders the seven centralized Repertoar blocks as concise linked cards using each block's `preview` text.

The homepage does not render the full long Repertoar copy and retains its existing layout pattern.

## 11. Repertoar Visual QA

Local browser QA passed:

- Desktop route rendered successfully.
- Mobile viewport checked at `390x844`.
- Correct H1: `REPERTOAR I ŽANROVI KOJE SVIRAMO`
- Correct eyebrow: `REPERTOAR, ATMOSFERA I NAČIN RADA`
- Intro paragraphs: `4`
- Content cards: `7`
- Heading font: Bebas Neue
- Paragraph font: Manrope
- Horizontal overflow: `false`
- Mobile card width: `350px` within the `390px` viewport
- Inquiry CTA fits.

## 12. Nacin Rada Visual QA

Local browser QA passed on desktop and mobile:

- Existing workflow items: `5`
- New bridge section rendered.
- `POGLEDAJ REPERTOAR` CTA fits.
- Existing `PROVERI DOSTUPNE TERMINE` CTA remains one line.
- Horizontal overflow: `false`

## 13. FAQ Integrity

FAQ content and FAQ page rendering were not changed.

- `src/routes/faq.tsx`: unchanged
- `src/components/site/FaqAnswer.tsx`: unchanged
- Flat FAQ item count: `30`
- `src/lib/site-data.ts` changed only by deleting the obsolete Repertoar placeholder array before the FAQ section.
- `NAJČEŠĆA PITANJA I ODGOVORI` remains present in the final built JS.

## 14. Protected Runtime And Bridge Files

Forms, CF7, calendar, runtime safety, mobile menu behavior, and WordPress mount architecture were not changed.

Protected source hashes remain unchanged:

| File | SHA-256 |
| --- | --- |
| `src/wp-entry.tsx` | `DF476C7B5D5F1B775319EA669492CD3F7AE031AC2E48EBED0D81BE04D9F27794` |
| `src/lib/interaction-safety.ts` | `226259CEFCC1697045B761E56F9B10D4AA8804A9127ECD1FAFE009578C992DC2` |
| `src/lib/wp-bridge.ts` | `85BB91D3D741EBB0AF999DFC7F47D3276DDB0214A8851751E19811F75ACC3481` |
| `src/components/site/MobileMenu.tsx` | `9C6B543D202989BA723EE0D66B5255ADDE510CB50E09B29AB00421D24FF90016` |
| `src/components/site/form/Cf7FormSlot.tsx` | `89E8010ADE56D3C3908408189D1FC32C73FCD907DC6387E54204E8FE78C655F1` |
| `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php` | `31AC3A858BC92EB8EF5CD07F88D3FE6EC5E988168EFCFF6DE20518E62EBD41D9` |
| `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php` | `B1E3E94F4F6A57A625280F76931D7C1E520C6727C07F12149FBD0AA29A8FCAA5` |

The packaged ZIP bridge PHP hashes also match the protected baseline.

## 15. Build Command

```text
npm run build:theme
```

Result: passed.

## 16. ZIP Command

```text
npm run zip:theme
```

Result: passed.

## 17. Final ZIP

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

SHA-256:

`2EFF81B2BEC1273DA515D19D967702951F105ADE3C050F4FFE6F5B0F605BEEFB`

## 18. ZIP Verification Summary

The final install ZIP itself was inspected directly.

- Theme version is `1.0.16`.
- Asset cache version is `1.0.16`, not stale `1.0.0`.
- Manifest exists at `assets/app/.vite/manifest.json`.
- Manifest entry is `src/wp-entry.tsx`.
- Built JS is `assets/index-D31GrC20.js`.
- Built CSS is `assets/styles-Cpuioj5j.css`.
- React runtime marker `18.3.1` is present; `package.json` still pins React and React DOM to `18.3.1`.
- `hydrateRoot(document)` count is `0`.
- `createRoot` marker is present.
- Root `/assets/` references count is `0`.
- `Allura` and cursive UI fonts are absent.
- `Bebas Neue`, `Manrope`, and the Google Fonts import remain present. The font import remains before generated CSS layers.
- `#b79775` remains present.
- Repertoar combined title, eyebrow, and all seven content blocks are present.
- `/nacin-rada` route and `POGLEDAJ REPERTOAR` bridge marker are present.
- Old Repertoar placeholder and `Club / House` tail are absent.
- Flat FAQ title remains present.
- `Created by Starter Studio` and `https://starter-studio.com` remain present.
- Interaction-safety markers including `ivan_debug`, `overlay-lock`, `pagehide`, and `beforeunload` remain present.
- `package-lock.json` is absent from repository and ZIP.
- Packaged CF7 and calendar bridge hashes match the protected baseline.
- `src/routeTree.gen.ts` was not modified.

## 19. Warnings And Limitations

- Live WordPress remains the final visual proof after installation.
- Local browser screenshot capture timed out during the Repertoar checkpoint. Rendered DOM and computed layout QA completed successfully for both target routes and the homepage preview.
- The temporary local Vite launcher shim was removed after packaging.
- No Git line-ending configuration was changed.
- No commit, push, or pull request action was performed.

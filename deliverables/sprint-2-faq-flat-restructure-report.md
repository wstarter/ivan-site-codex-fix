# Sprint 2 - FAQ Flat Restructure Report

## 1. Changed Files

Authored source changes:

- `src/lib/site-data.ts`
- `src/components/site/FaqAnswer.tsx`
- `src/routes/faq.tsx`
- `src/routes/index.tsx`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/functions.php`

Generated theme output refreshed by the required build:

- `dist-wp/.vite/manifest.json`
- `dist-wp/assets/index-DpygC7yN.js`
- `dist-wp/assets/styles-SHDbzZb7.css`
- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-DpygC7yN.js`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/styles-SHDbzZb7.css`
- `wordpress-theme/ivan-sedative-theme.zip`

The replaced hashed JS/CSS assets from theme `1.0.14` were removed by the build copy step.

## 2. Baseline Verification Before Changes

- Repository: `C:\Users\Nikola\Documents\Ivan-site-codex-fix`
- Existing branch: `sprint-2-faq-flat-restructure`
- Git working tree: clean before work started
- Local Git configuration preserved:
  - `core.autocrlf false`
  - `core.eol lf`
- `react`: `18.3.1`
- `react-dom`: `18.3.1`
- Starting theme version: `1.0.14`
- Starting asset cache version: `1.0.14`, not stale `1.0.0`
- `src/wp-entry.tsx` existed, used `createRoot`, and contained zero `hydrateRoot(document)` calls.
- Required runtime, bridge, mobile menu, Vite config, CF7 bridge, and calendar bridge files existed.
- `package-lock.json` was absent and remains absent.

## 3. Previous FAQ Structure

The old grouped FAQ system was found in:

- `src/lib/site-data.ts`: `faqGroups`, divided into six category objects
- `src/routes/faq.tsx`: category-section rendering with category headings
- `src/routes/index.tsx`: homepage preview sourced from `faqGroups[0].items`

## 4. Grouped Structure Removal

The old `faqGroups` and `FaqGroup` source were removed completely. The FAQ page no longer maps categories, renders category headings, or retains a hidden grouped-data tail.

Targeted source checks found:

- `faqGroups` / `FaqGroup` references: `0`
- Old unique category labels in the final built JS: absent
- Visible category headings on `/faq`: `0`

`Dodatni program` remains elsewhere as valid site navigation/content and is not used as an FAQ category heading.

## 5. New Flat FAQ Source

The new central source is:

`src/lib/site-data.ts`

```ts
export const faqItems: FaqItem[] = [...]
```

Each item contains:

- `question`
- `answer`, composed of maintainable paragraph, heading, or list blocks

The reusable renderer is:

`src/components/site/FaqAnswer.tsx`

This keeps long answers readable without hardcoding FAQ content directly in route JSX.

## 6. Final FAQ Count

The final flat FAQ contains `30` items.

## 7. Duplicate Removal

The normalized question appears exactly once:

`Šta ide prvo — prvi ples ili bidermajer?`

Malformed or duplicate `bider / bidermajer` variants are absent.

## 8. FAQ Page Rendering

`/faq` now renders one continuous accordion/list below:

`NAJČEŠĆA PITANJA I ODGOVORI`

There are no category sections, tabs, filters, or section labels.

## 9. Homepage FAQ Preview

The homepage remains a preview rather than a full FAQ render. It derives five concise items by reference from `faqItems`:

```ts
export const faqPreviewItems = [faqItems[0], faqItems[1], faqItems[4], faqItems[8], faqItems[14]];
```

This avoids duplicated answers and keeps the very long organization answer off the homepage while preserving a link to `/faq`.

## 10. Desktop And Mobile Visual QA

Local browser QA passed:

- Desktop viewport: `1440x1000`
- Mobile viewport: `390x844`
- Correct H1: `NAJČEŠĆA PITANJA I ODGOVORI`
- Accordion rows: `30`
- Visible category headings: `0`
- Horizontal overflow: `false` on desktop and mobile

The long organization answer was expanded on both desktop and mobile:

- Rendered as `26` spaced content blocks
- Includes `5` lists and `29` bullet items
- Uses the existing dark premium panel style
- Does not create horizontal overflow

The homepage mobile preview renders `5` questions and excludes the long organization answer.

## 11. Unchanged Global Systems

This sprint did not change:

- Hero
- Mobile menu
- Footer
- Metrics or glass panel
- Forms
- Calendar
- CF7 bridge
- Runtime safety
- Routing architecture
- WordPress mount architecture

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

## 12. Unchanged Repertoar And Nacin Rada

`Repertoar` and `Nacin rada` content were not modified, merged, or restructured.

## 13. Build Command

```text
npm run build:theme
```

Result: passed.

## 14. ZIP Command

```text
npm run zip:theme
```

Result: passed.

## 15. Final ZIP

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

SHA-256:

`9320BDE53C67ADF9DF6E06469B2D2AAE6875AEE6BB63C888C02119CB7E9326F0`

## 16. ZIP Verification Summary

The final install ZIP itself was inspected directly.

- Theme version is `1.0.15`.
- Asset cache version is `1.0.15`, not stale `1.0.0`.
- Manifest exists at `assets/app/.vite/manifest.json`.
- Manifest entry is `src/wp-entry.tsx`.
- Built JS is `assets/index-DpygC7yN.js`.
- Built CSS is `assets/styles-SHDbzZb7.css`.
- React runtime marker `18.3.1` is present; `package.json` still pins React and React DOM to `18.3.1`.
- `hydrateRoot(document)` count is `0`.
- `createRoot` marker is present.
- Root `/assets/` references count is `0`.
- `Allura` and cursive UI fonts are absent.
- `Bebas Neue`, `Manrope`, and the Google Fonts import remain present. The font import remains before generated CSS layers.
- `#b79775` remains present.
- `NAJČEŠĆA PITANJA I ODGOVORI` is present.
- Required long organization and duration questions are present.
- The normalized bidermajer question appears exactly once.
- Malformed bider question variants are absent.
- `saxofon` is absent; `saksofon` is present.
- `opstih` is absent; `opštih` is present.
- Old unique FAQ category labels are absent from built JS.
- `Created by Starter Studio` and `https://starter-studio.com` remain present.
- Interaction-safety markers including `ivan_debug`, `overlay-lock`, `pagehide`, and `beforeunload` remain present.
- `package-lock.json` is absent from repository and ZIP.
- Packaged CF7 and calendar bridge hashes match the protected baseline.
- `src/routeTree.gen.ts` was not modified.

## 17. Warnings And Limitations

- Live WordPress remains the final proof after installation.
- The full-repository ESLint command did not finish within two minutes and was stopped. A narrowed ESLint run over the touched TypeScript files completed and reported existing Prettier-formatting debt in legacy files, including pre-existing sections of `site-data.ts` and `index.tsx`; it did not report runtime or type failures.
- `git diff --check` passed.
- The temporary local Vite launcher shim was removed after packaging.
- No Git line-ending configuration was changed.
- No commit, push, or pull request action was performed.

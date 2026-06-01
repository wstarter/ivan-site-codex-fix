# Sprint 3.1 Report: Merge Nacin rada into Repertoar

## Scope

Sprint 3.1 merges the former `/nacin-rada` content into the existing `/repertoar` page while preserving the requested Repertoar hero title, hero eyebrow, seven genre groups, icons, runtime safety logic, WordPress bridges, forms, calendar, FAQ, and homepage composition.

## Baseline Gate

The required baseline passed before edits:

- Branch: `sprint-3-repertoar-nacin-rada`
- React: `18.3.1`
- React DOM: `18.3.1`
- Theme version before edits: `1.0.16`
- WordPress asset/cache version before edits: `1.0.16`
- `package-lock.json`: absent
- `createRoot`: present in `src/wp-entry.tsx`
- `hydrateRoot(document)`: `0`
- Root `"/assets/"` references: `0`
- Git EOL settings: `core.autocrlf=false`, `core.eol=lf`

The repository already contained the expected uncommitted Sprint 3 source and generated asset changes. Sprint 3.1 was applied on top of that source-of-truth state.

## Changed Files

Sprint 3.1 authored source changes:

- `src/components/site/PageHero.tsx`
- `src/lib/site-data.ts`
- `src/routes/nacin-rada.tsx`
- `src/routes/repertoar.tsx`
- `wordpress-theme/ivan-sedative-theme/functions.php`
- `wordpress-theme/ivan-sedative-theme/inc/spa-pages.php`
- `wordpress-theme/ivan-sedative-theme/style.css`

Generated build outputs refreshed by `npm run build:theme`:

- `dist-wp/.vite/manifest.json`
- `dist-wp/assets/index-Cl3lSA9y.js`
- `dist-wp/assets/styles-BgQafrYL.css`
- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-Cl3lSA9y.js`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/styles-BgQafrYL.css`

The previous generated Sprint 3 JS/CSS bundle files were replaced by the current hashed build.

## Repertoar Page

The `/repertoar` hero eyebrow remains exactly:

`REPERTOAR, ATMOSFERA I NAČIN RADA`

The `/repertoar` H1 remains exactly:

`REPERTOAR I ŽANROVI KOJE SVIRAMO`

The previous hero description was replaced in the hero/subhero area with the exact requested two-paragraph client copy:

> Vrlo je teško popisati kompletan repertoar koji izvodimo, jer se radi o ogromnom broju pesama. Zato je važno da prvenstveno znate žanrove koje sviramo.
>
> Za pojedinačne i precizne upite vezane za konkretne pesme, najbolje je da se dogovorimo kroz lični razgovor.

`PageHero` now accepts either one intro string or an array of paragraphs so existing pages keep their current behavior while `/repertoar` renders the client copy as two proper paragraphs.

The existing Sprint 3 intro beginning with `Nakon više od 15 godina rada...` remains in place. All seven genre groups remain:

1. Domaći pop
2. Domaći hitovi
3. Muzika 90-ih
4. Strana muzika
5. Narodna muzika
6. Kola
7. Prvi ples, ulazak i torta

Genre icons were not changed, removed, or replaced.

## Merged Nacin Rada Content

Below the genre section, `/repertoar` now contains an anchored section:

- Anchor: `#nacin-rada`
- Title: `KAKO FUNKCIONIŠE SARADNJA`
- Existing five booking steps preserved:
  - `01 Proverite dostupne termine`
  - `02 Izaberite tip događaja`
  - `03 Pošaljite upit`
  - `04 Odgovor u roku od 24h`
  - `05 Potvrda termina`

The former stacked informational blocks were consolidated into one wider premium section:

`PROFESIONALAN PRISTUP OD REPERTOARA DO REALIZACIJE`

The section concisely covers repertoire, atmosphere, protocol, timing, energy, pauses, DJ moments, quartet, additional program moments, and client coordination. It ends with the existing CTA destinations:

- `PROVERI DOSTUPNE TERMINE`
- `POŠALJI UPIT`

There is no `POGLEDAJ REPERTOAR` CTA on `/repertoar`.

## Legacy Route And Navigation

`/nacin-rada` no longer renders a separate content page. It uses a TanStack Router `beforeLoad` redirect:

`/nacin-rada` -> `/repertoar#nacin-rada`

The fallback navigation entry for `NAČIN RADA` now links to `/repertoar#nacin-rada`.

Existing WordPress Admin menu entries that still point to `/nacin-rada` are normalized by the React navigation mapper to `/repertoar#nacin-rada`. Fresh default WordPress menus created by the theme use the anchored URL directly.

The regular `REPERTOAR` item remains the active desktop route when the anchor is visited, avoiding broken or duplicated active states.

## Protected Areas

The following protected source files remain byte-for-byte unchanged:

- `src/wp-entry.tsx`
- `src/lib/interaction-safety.ts`
- `src/lib/wp-bridge.ts`
- `src/components/site/MobileMenu.tsx`
- `src/components/site/form/Cf7FormSlot.tsx`
- `src/routes/faq.tsx`
- `src/components/site/FaqAnswer.tsx`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`

FAQ data, inquiry forms, CF7 behavior, calendar behavior, runtime interaction safety, mobile menu safety, homepage hero visuals, footer content, logo, favicon, icons, and visual assets were not modified in Sprint 3.1.

## Versioning

- Theme version: `1.0.17`
- WordPress asset/cache version: `1.0.17`

## Build And Package

Required build command:

```text
npm run build:theme
```

Result: passed.

Required package command:

```text
npm run zip:theme
```

Result: passed.

The Windows environment does not expose Unix `rm` and `zip` by default, so disposable temp command wrappers were used to execute the unchanged package script. They were removed after packaging. Vite's original executable was restored and no backup or extraction directory remains.

## Browser QA

Local preview checked at `http://127.0.0.1:4173`.

Desktop `/repertoar`:

- Preserved eyebrow and H1: passed
- Two hero paragraphs: passed
- Seven genre cards: passed
- Five merged workflow steps: passed
- Consolidated professional block: passed
- Both final CTAs: passed
- Horizontal overflow: none

Mobile `/repertoar` at `390x844`:

- Document width: `390`
- Seven genre card widths: `350`
- Merged workflow width: `350`
- Five workflow steps: passed
- CTAs fit without overflow
- Body overflow: unlocked
- Body touch action: `auto`
- Horizontal overflow: none

Legacy route:

- Visiting `/nacin-rada` lands on `/repertoar#nacin-rada`
- New merged workflow renders
- Old standalone `NAČIN RADA` hero does not render
- Horizontal overflow: none

The local browser screenshot facility timed out during capture. DOM snapshots, computed layout checks, route checks, and body interaction checks completed successfully.

## ZIP Verification

Final install ZIP:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

SHA-256:

`1BDAEBA3BAB97A1FBD43C1C5E62D684C672F847BB4A7B31F9525FDEFCC480598`

The generated ZIP itself was inspected directly through archive listing and ZIP-stream reads:

- Archive entries: `37`
- Theme version `1.0.17`: passed
- Asset/cache version `1.0.17`: passed
- Manifest entry `src/wp-entry.tsx`: passed
- Manifest JS: `assets/index-Cl3lSA9y.js`
- Manifest CSS: `assets/styles-BgQafrYL.css`
- Bundled React runtime marker `18.3.1`: passed
- Source package React `18.3.1`: passed
- Source package React DOM `18.3.1`: passed
- `createRoot` marker: passed
- `hydrateRoot(document)`: `0`
- Root `"/assets/"` references: `0`
- `package-lock.json`: absent
- Requested Repertoar hero paragraphs: present
- Preserved Repertoar eyebrow and title: present
- Merged workflow title: present
- Merged workflow steps: present
- Consolidated professional block: present
- `/repertoar#nacin-rada` navigation marker: present
- Old standalone Nacin rada hero copy: absent
- Old standalone stacked-card copy: absent
- Interaction safety marker: present
- Packaged CF7 bridge hash matches protected source: passed
- Packaged calendar bridge hash matches protected source: passed

The install ZIP contains a compiled browser bundle rather than `package.json`, so the ZIP runtime check uses its bundled `18.3.1` marker. The repository package manifest separately confirms both `react` and `react-dom` remain pinned to `18.3.1`.

## Known Limitations

- Final behavior should still be smoke-tested after installing the ZIP in the live WordPress environment because live WordPress menu configuration, caching layers, and plugin state are external to the repository.
- The local in-app browser screenshot capture timed out, although DOM, route, responsive width, interaction style, and overflow checks passed.

## Delivery

- ZIP: `C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`
- Report: `C:\Users\Nikola\Documents\Ivan-site-codex-fix\deliverables\sprint-3-1-merge-repertoar-nacin-rada-report.md`

No commit, push, or pull request was created.

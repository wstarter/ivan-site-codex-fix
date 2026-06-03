# Sprint 5.3 Hybrid CF7 Adapter Report

## 1. Baseline Status

- Workspace: `C:\Users\Nikola\Documents\Ivan-site-codex-fix`
- Branch: `sprint-4-assets-page-heroes`
- Git status before edits: clean, verified with GitHub Desktop bundled Git because `git` is not on PATH.
- Theme/cache version before edits: `1.0.28`
- React / React DOM: `18.3.1` / `18.3.1`
- `package-lock.json`: absent
- `src/wp-entry.tsx`: present
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- root `/assets/` references: `0`
- `src/lib/interaction-safety.ts`: present
- `src/components/site/MobileMenu.tsx`: interaction safety markers present

## 2. Root Cause

The `1.0.28` standalone CF7 adapter carried the useful submit-flow fixes, but its CSS used a panelized section model. `.ivan-cf7-section` had padding, border, background, and inner shadow, making each form section look like a separate admin-style box. The submit wrapper was also part of the visual model instead of staying a neutral wrapper.

## 3. Files Changed

- `wordpress-theme/ivan-sedative-theme/assets/css/ivan-cf7-adapter.css`
- `wordpress-theme/ivan-sedative-theme/assets/js/ivan-cf7-adapter.js`
- `wordpress-theme/ivan-sedative-theme/functions.php`
- `wordpress-theme/ivan-sedative-theme/style.css`

Generated package:

- `wordpress-theme/ivan-sedative-theme.zip`

## 4. What Was Wrong With IJ2 CSS

The IJ2-style CSS made CF7 sections independent panels, squared off the input feel, visually separated the form into technical blocks, and made the submit area read like a large wrong light panel. That regressed the premium manual form direction.

## 5. Which Stable CSS Baseline Was Restored

The real stable manual visual source available in this repo is the committed CF7 block in `src/styles.css`, especially the Contact Form 7 selector parity and premium `.ivan-cf7-*` class system. The previous standalone adapter in Git history was inspected and rejected as the final visual source because it already contained panelized `.ivan-cf7-section` styling.

## 6. Which IJ2 JS/PHP Fixes Were Preserved

- No `stopImmediatePropagation`.
- No capture-phase submit handler that blocks CF7.
- Success modal opens only on `wpcf7mailsent`.
- `wpcf7mailfailed` and `wpcf7spam` close any success modal and never open success.
- Inline consent, email, phone, date, and required-radio helpers remain.
- `revealValidationTarget` scrolls to the relevant field instead of jumping to page top.
- PHP phone/date validation in `inc/cf7-bridge.php` remains unchanged.
- Adapter cache busting with `filemtime()` remains.

## 7. CSS Strategy

The final adapter CSS restores the stable manual form feel, then patches runtime CF7 states. The section model is now:

```css
.wpcf7-host .ivan-cf7-section {
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
}

.wpcf7-host .ivan-cf7-section + .ivan-cf7-section {
  margin-top: 30px;
  padding-top: 28px;
  border-top: 1px solid rgba(199, 164, 113, 0.16);
}
```

## 8. JS Strategy

The submit pipeline stays CF7-friendly. The adapter surfaces inline helper errors for obvious invalid values, but it does not suppress valid CF7 submissions. CF7 runtime events still own final delivery status.

## 9. normalizeSubmit Safety

`normalizeSubmit()` targets only:

```js
'.ivan-cf7-submit input[type="submit"], input.wpcf7-submit'
```

It sets the submit input value and removes decorative icons without touching wrapper `textContent`, so it cannot delete the CF7 submit input or spinner.

## 10. Success Modal Behavior

The success modal opens only from `wpcf7mailsent`. It does not open on click, submit, `wpcf7submit`, invalid, spam, or mail failed events. Modal copy remains:

- Eyebrow: `SEDATIVE BAND`
- Title: `UPIT JE USPEŠNO POSLAT`
- Actions: `POČETNA`, `INSTAGRAM`, `TERMINI`

## 11. novalidate Decision

The adapter no longer touches `novalidate` at all.

ZIP/source verification:

- `novalidate` / `noValidate` mentions in `assets/js/ivan-cf7-adapter.js`: `0`
- `setAttribute("novalidate")`: `0`
- `removeAttribute("novalidate")`: `0`

## 12. Slider Restoration

The budget slider keeps the stable premium treatment:

- gold progress fill
- gold thumb
- thin track
- min/max scale separated left/right
- JS normalization uses `500` min, `50000` max, `500` step
- displayed values use Serbian locale formatting plus euro suffix

## 13. Radio Pill Restoration

Radio/options styling is restored to one elegant pill surface per option. Checked state is handled through `:has(input:checked)` with `.is-checked` fallback from JS. Extra spacing is present between option groups and following fields:

```css
.wpcf7-host .ivan-cf7-options + .wpcf7-form-control-wrap,
.wpcf7-host .ivan-cf7-pills + .wpcf7-form-control-wrap
```

## 14. Submit Wrapper Cleanup

`.ivan-cf7-submit` is neutral:

- no visual background
- no padding panel
- no box shadow
- no wrapper text mutation

Only the actual submit input is styled as the CTA. Submit icons are hidden.

## 15. Server-Side Validation Status

`inc/cf7-bridge.php` was not changed. Existing server-side validation accepts phone numbers with 9-15 digits and common separators, and date validation accepts `dd/mm/yyyy` future dates up to 10 years ahead.

## 16. Svadba QA

Static and package checks passed for the shared adapter. Live CF7 delivery, actual email receipt, and database-configured shortcode behavior require testing inside WordPress because the local build does not include the WordPress database or Contact Form 7 runtime.

## 17. Korporativna QA

The same shared adapter applies to the corporate inquiry form by `.wpcf7-host` / `.ivan-cf7` scope. Live select placeholder, delivery, and CF7 response checks must be repeated in WordPress.

## 18. Mobile QA

The restored adapter keeps the stable mobile stack:

- two-column step/copy header row
- field spans full width below
- no section panels
- radio pills collapse to one column below 420px
- modal actions collapse to one column

Live mobile scroll and CF7 interaction should be confirmed after installing the ZIP.

## 19. ZIP Audit

Final ZIP:

- Path: `C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`
- SHA-256: `B3A597E06C744C9EA2E19B63480F3950B75AB791AC46589E5EDCE8CE21F97CCA`

Build/package commands:

- Build: `npm.cmd run build:theme`
- Required zip script attempted: `npm.cmd run zip:theme`
- `zip:theme` failed on this Windows shell because the script calls Unix `rm` and `zip`, and `zip.exe` is not installed.
- Final package command used: `tar.exe -a -cf ivan-sedative-theme.zip ...` from `wordpress-theme`

ZIP verification from the extracted final ZIP:

- Theme header version: `1.0.29`
- `IVAN_THEME_VERSION`: `1.0.29`
- React / React DOM source dependencies: `18.3.1` / `18.3.1`
- Manifest entry: `src/wp-entry.tsx`
- Built JS contains `createRoot`: yes
- `hydrateRoot(document)`: `0`
- root `/assets/` references: `0`
- Missing manifest assets: `0` by manifest/tar listing
- Allura / cursive / Lovable markers: `0`
- `package-lock.json` in ZIP: absent
- CF7 adapter CSS packaged count: `1`
- CF7 adapter JS packaged count: `1`
- Non-panelized section model: present
- Panelized `.ivan-cf7-section` model: absent
- `novalidate` JS mutations: absent
- `stopImmediatePropagation`: absent
- `window.IvanTheme` inline bridge: preserved
- CF7 shortcode bridge: preserved
- Calendar bridge: present
- Adapter CSS/JS `filemtime()` cache busting: preserved
- Adapter assets are enqueued after app assets in `inc/enqueue.php`

## 20. Live Verification Instructions

1. Install `C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`.
2. Clear all WordPress/plugin/browser cache.
3. Open `/upit/svadba` in an incognito window.
4. Confirm the form looks like the stable manual premium version, not the IJ2 panelized version.
5. Test empty form, unchecked consent, invalid/valid email, invalid/valid phone, invalid/valid future date, slider, radio buttons, and successful submit.
6. Confirm mail arrives at `info@ivansedativeband.com`.
7. Repeat the core checks on `/upit/korporativna-proslava`.
8. Test mobile around 390px width for no horizontal overflow, usable slider, clean radio wrapping, and readable modal.

## 21. Warnings / Limitations

- I did not change CF7 form-tab content, WordPress database/settings, field names, routes, email address, calendar/sidebar logic, hero assets, menu behavior, or global architecture.
- I could not perform real CF7 mail delivery testing locally because that requires the live WordPress + CF7 database/runtime.
- The repository `zip:theme` script is Unix-oriented and failed in PowerShell on this machine. The final ZIP was created with Windows `tar.exe`, then audited directly.
- No commit, push, pull request, merge, or Git config change was performed.

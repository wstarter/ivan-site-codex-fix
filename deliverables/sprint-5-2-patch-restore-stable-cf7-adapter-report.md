# Sprint 5.2 Patch - Restored Stable CF7 Adapter

## 1. Baseline status

- Repository: `C:\Users\Nikola\Documents\Ivan-site-codex-fix`
- Branch: `sprint-4-assets-page-heroes`
- HEAD checkpoint: `e11ba110eef8949bff0e50d56e476061c620e534` (`Finalize CF7 inquiry adapter`)
- Effective worktree before edits: clean. The only raw index mismatch was `.gitignore` line endings (LF in index, CRLF in the Windows worktree); `.gitattributes` uses `* text=auto`, so the normalized content was unchanged.
- Theme/cache version before patch: `1.0.26`
- React: `18.3.1`
- React DOM: `18.3.1`
- `package-lock.json`: absent
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- Root `"/assets/"` references: `0`

## 2. Root cause

The installed Sprint 5.2 checkpoint used a reduced 272-line standalone CF7 stylesheet as a partial override. It no longer owned the complete WordPress-rendered CF7 surface, so Vite CSS and CF7 wrapper markup could reintroduce small typography, weak spacing, incomplete slider styling, and under-controlled radio pills.

The JavaScript adapter also normalized `.ivan-cf7-submit` as though it were the submit input. In real CF7 markup it is a wrapper `div`; assigning wrapper `textContent` could delete the real submit input and CF7 spinner.

## 3. Files changed

Source/theme changes:

- `src/routes/hvala.tsx`
- `wordpress-theme/ivan-sedative-theme/assets/css/ivan-cf7-adapter.css`
- `wordpress-theme/ivan-sedative-theme/assets/js/ivan-cf7-adapter.js`
- `wordpress-theme/ivan-sedative-theme/inc/enqueue.php`
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php` (comment cleanup only; bridge behavior unchanged)
- `wordpress-theme/ivan-sedative-theme/functions.php`
- `wordpress-theme/ivan-sedative-theme/style.css`

Generated/package outputs refreshed:

- `dist-wp/`
- `wordpress-theme/ivan-sedative-theme/assets/app/`
- `wordpress-theme/ivan-sedative-theme.zip`

## 4. Stable adapter recovery

Local Git history did not contain a prior standalone `assets/css/ivan-cf7-adapter.css` with the reported approximately 700-line form treatment. The stable Sprint 5 form layer lived in committed `src/styles.css`.

The standalone WordPress adapter was reconstructed from that committed stable treatment and expanded into an 857-line final override. The reduced IJNOVI-style adapter was not used as the implementation base.

## 5. Reduced adapter problems

The reduced adapter omitted or weakened:

- CF7 wrapper normalization and section layout
- step circles, row spacing, label/help typography
- full input/select/textarea treatment
- complete custom range track, thumb, and progress fill
- radio pill reset, checked state, spacing, and mobile wrapping
- acceptance row treatment
- submit-wrapper specificity
- response output states
- responsive behavior

## 6. CSS strategy

The standalone adapter is loaded after app CSS and uses scoped `.wpcf7-host` selectors. It now owns the full inquiry form surface and neutralizes Vite/CF7 conflicts without changing layout architecture, routes, field names, or assets.

Typography uses the existing body/display variables with Arial fallbacks, `Bebas Neue` for display text, and no `Allura` or cursive font.

## 7. JS strategy

The standalone adapter remains scoped to `.wpcf7-host form` containing `.ivan-cf7`. It:

- prepares CF7 hosts after initial load and SPA DOM insertion
- keeps `novalidate` only with complete custom coverage
- translates CF7 response text
- reinitializes after CF7 events
- dispatches `ivan:cf7-success` before opening the fallback modal
- unlocks body/html on modal close, `pagehide`, `popstate`, and `beforeunload`

## 8. `normalizeSubmit()` fix

Normalization now targets only real inputs:

```js
root.querySelectorAll('.ivan-cf7-submit input[type="submit"], input.wpcf7-submit')
```

It sets the value to `POSALJI UPIT` (rendered with the Serbian diacritic in source), removes decorative submit icons safely, and preserves the CF7 spinner.

## 9. Success modal strategy

The React app already has `/hvala`, but no reusable global React modal listener. The adapter therefore dispatches a cancelable `ivan:cf7-success` event and uses a premium standalone fallback modal if no React handler consumes it.

Modal content now matches the thank-you route:

- eyebrow: `SEDATIVE BAND`
- title: `UPIT JE USPESNO POSLAT` (rendered with Serbian diacritics)
- actions: `POCETNA`, `INSTAGRAM`, `TERMINI`

`src/routes/hvala.tsx` was aligned to the same `SEDATIVE BAND` eyebrow.

## 10. Typography restoration

- section titles: `20px`, display font
- labels: `15.5px`
- help/note copy: `13.5px`
- inputs/selects/textareas: `14px`
- readable inline errors and response text
- no Allura/cursive frontend marker

## 11. Budget slider restoration

The adapter now provides:

- custom track and thumb styling
- progress fill through `--ivan-range-progress`
- forced `min=500`, `max=50000`, `step=500`
- nearest-500 normalization
- Serbian-formatted output such as `15.500€`
- `input`, `change`, `keyup`, and `pointerup` updates
- reinitialization after CF7 events and SPA insertion

## 12. Radio pill restoration

Radio groups now include:

- `.wpcf7-list-item` reset
- pill labels with one controlled border
- inline radio indicator
- checked state via `:has(input:checked)` and `.is-checked`
- `.ivan-cf7-required-radio` validation
- responsive wrapping and mobile stacking
- `14px` spacing before follow-up controls

## 13. Acceptance UX fix

Unchecked consent now appends:

`Potrebno je da potvrdite saglasnost pre slanja upita.`

directly under `.ivan-cf7-consent`, outside the nested checkbox label wrapper. The message and invalid state clear when consent is checked.

## 14. Email, phone, and date validation

Email:

- regex accepts ordinary TLDs including `.com` and `.rs`
- invalid message: `Unesite ispravnu email adresu.`

Phone:

- accepts digits plus common spacing and punctuation
- enforces 9-15 digits
- invalid message: `Unesite ispravan broj telefona, na primer +381 60 1234567.`

Date:

- text mask formats digits as `dd/mm/yyyy`
- validates real dates, rejects past dates, and limits future dates to ten years
- keeps `dan/mesec/godina` placeholder

Existing PHP CF7 validation hooks were preserved unchanged.

## 15. Native validation / `novalidate`

`novalidate` remains intentional because the adapter covers:

- required text inputs
- required selects
- required textareas
- required email
- required phone
- required date
- acceptance
- `.ivan-cf7-required-radio` groups
- CF7 `required`, `aria-required="true"`, and `.wpcf7-validates-as-required` markers

Basic required errors now clear on normal input/change; specialized email, phone, and date fields retain their dedicated validators.

## 16. Response output styling

The adapter styles `.wpcf7-response-output`, `.wpcf7-not-valid-tip`, success, invalid, failed, spam, and aborted states with the site palette. Default CF7 green/red box styling no longer owns the result surface.

## 17. Svadba QA

Browser harness and SPA smoke checks passed:

- empty submit shows Serbian required errors
- consent error appears under the consent row, not inside its nested label
- email matrix:
  - rejected: `test`, `test@`, `test@gmail`
  - accepted: `ime@domen.com`, `ime@domen.rs`
- phone matrix:
  - rejected: `abc`, `123`, `060`, `+381`
  - accepted: `+381 60 1234567`, `+381601234567`, `0601234567`, `060 1234567`
- date matrix:
  - rejected: `12/12/1212`, `99/99/2027`
  - accepted: `12/12/2027`
- slider changed to `15.500€` and updated progress
- radio pill checked state and `.is-checked` fallback cleared the group error
- submit preserved its spinner and removed its decorative icon
- generic forms outside `.wpcf7-host` did not open the success modal
- CF7 failure output translated to Serbian
- success modal opened and closed cleanly

## 18. Korporativna QA

`/upit/korporativna-proslava?mode=generic` rendered at mobile width with:

- body/html overflow unlocked
- no horizontal overflow
- no idle fullscreen pointer-capturing layer
- browser back returning cleanly from `/hvala`

The standalone adapter remains form-key agnostic and applies to `.ivan-cf7` hosts for both inquiry forms.

## 19. Mobile QA

At `390x844`:

- harness `scrollWidth`: `390`
- horizontal overflow: false
- idle modal count: `0`
- body/html overflow after modal close: empty
- body/html touch action after modal close: empty
- real `/upit/svadba?mode=generic` idle large fixed pointer layer count: `0`
- mobile menu open large fixed layer count: `1` (intentional visible dialog)
- mobile menu close large fixed layer count: `0`
- body lock cleared after menu close

## 20. ZIP audit

Build command:

```text
npm run build:theme
```

ZIP command:

```text
npm run zip:theme
```

Final ZIP:

`C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`

SHA-256:

`2EBC7F2215FFBF4218584CFB8D045DCCA88B527FCB51C4CA3C6DF5F5F9A31A74`

Direct ZIP audit results:

- ZIP entries: `39`
- theme header version: `1.0.27`
- theme constant version: `1.0.27`
- React / React DOM: `18.3.1` / `18.3.1`
- manifest entry: `src/wp-entry.tsx`
- built JS: `assets/index-CemobIaA.js`
- built CSS: `assets/styles-D_52SX7p.css`
- missing manifest assets: `0`
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- root `"/assets/"` references: `0`
- forbidden Allura/cursive/Lovable markers: `0`
- interaction-safety marker: present
- CF7 deferred init marker: present
- `window.IvanTheme` inline bridge marker: present
- adapter CSS packaged count: `1`
- adapter JS packaged count: `1`
- adapter enqueued after app assets: yes
- filemtime CSS/JS cache busting: present
- wrapper-safe submit normalization: present
- spinner preservation: present
- slider/radio/consent/date-mask markers: present
- premium modal markers: present
- `package-lock.json`: absent

Protected non-regression files retained their baseline SHA-256 hashes:

- `src/wp-entry.tsx`: `DF476C7B5D5F1B775319EA669492CD3F7AE031AC2E48EBED0D81BE04D9F27794`
- `src/lib/wp-bridge.ts`: `85BB91D3D741EBB0AF999DFC7F47D3276DDB0214A8851751E19811F75ACC3481`
- `src/lib/page-hero-assets.ts`: `5134EA0103A0415F33B40553FD598351219C97E041186A2751A997DB02FF9CCE`
- `src/components/site/MobileMenu.tsx`: `9C6B543D202989BA723EE0D66B5255ADDE510CB50E09B29AB00421D24FF90016`
- `src/components/site/form/Cf7FormSlot.tsx`: `89E8010ADE56D3C3908408189D1FC32C73FCD907DC6387E54204E8FE78C655F1`
- `src/routes/faq.tsx`: `94573F2C4CD7486DD02BB862AAF97CB38FCF5B72869C9F74E2AFC76523772ACE`
- `src/routes/repertoar.tsx`: `DF06938D019C72A351425D6F18BEC2FF335F20C05E04F3894D0090CFA2895A49`
- `wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php`: `B1E3E94F4F6A57A625280F76931D7C1E520C6727C07F12149FBD0AA29A8FCAA5`
- `wordpress-theme/ivan-sedative-theme/inc/ivan-theme-data.php`: `F5CC902A6C6B5B703A95D61A4B2F2D8F9712D5F66E91EB9A824B6245C7F6C127`
- `wordpress-theme/ivan-sedative-theme/inc/theme-settings.php`: `501BBA4BFC9F9BCAF9E495E3EE271BFB0F143B5B6ADC6377D1253B8A34370CDB`

This preserves the inline bridge, hero override, dynamic title/meta fix, fallback React forms, inquiry sidebar, calendar bridge, mobile menu behavior, FAQ, and Repertoar content.

## 21. Live verification instructions

1. Install `wordpress-theme/ivan-sedative-theme.zip`.
2. Clear WordPress, hosting, proxy, and browser cache.
3. Open `/upit/svadba` in an incognito window.
4. Test empty submit, unchecked consent, invalid/valid email, invalid/valid phone, invalid/valid future date, slider, radio pills, and successful submission.
5. Confirm the delivered email arrives at `info@ivansedativeband.com`.
6. Repeat the core checks on `/upit/korporativna-proslava`.
7. Repeat mobile menu, scroll, route navigation, browser back, and refresh checks on a real mobile viewport.

## 22. Warnings / limitations

- PHP CLI is not installed on this machine, so `php -l` could not run locally.
- Browser QA used the local representative CF7 harness plus local SPA route smoke checks. A real WordPress install is still required to confirm Contact Form 7 transport, server-side validation, cache invalidation, and delivery to `info@ivansedativeband.com`.
- No commit, push, pull request, merge, plugin change, database change, or Git configuration change was performed.

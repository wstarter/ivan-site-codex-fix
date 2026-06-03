# Critical CF7 Submit Flow Fix

## Summary

This patch addresses the production blocker where custom validation could interfere with the Contact Form 7 submit pipeline and where invalid fields did not reliably surface clear inline messages.

The theme package was rebuilt as version `1.0.28`.

## Files changed

- `wordpress-theme/ivan-sedative-theme/assets/js/ivan-cf7-adapter.js`
- `wordpress-theme/ivan-sedative-theme/functions.php`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/assets/app/` (rebuilt WordPress app bundle)
- `wordpress-theme/ivan-sedative-theme.zip`

Temporary QA harness files under `C:\Users\Nikola\.codex\tmp\ivan-sprint5-2-harness` were used only for local browser testing.

## Root cause

The adapter used a capture-phase submit listener and called `stopImmediatePropagation()` when custom validation failed. It also added `novalidate` to CF7 forms. That combination made the adapter too authoritative over the form lifecycle and could prevent Contact Form 7 JavaScript from owning validation/submission behavior.

## Submit flow changes

- Removed aggressive submit interception behavior.
- Removed `stopImmediatePropagation()` entirely from the adapter.
- Stopped adding `novalidate`; the adapter now removes stale `novalidate` if present.
- Submit listener now runs in the normal bubbling phase.
- If a form is a real CF7 form (`window.wpcf7` or `.wpcf7-form`), the adapter surfaces inline UX errors but does not cancel the submit event.
- If CF7 is not present, invalid submits are prevented to avoid a plain browser jump to `#`.

## Validation UX retained

The adapter still shows inline messages for:

- required fields: `Ovo polje je obavezno.`
- consent: `Potrebno je da potvrdite saglasnost pre slanja upita.`
- email: `Unesite ispravnu email adresu.`
- phone: `Unesite ispravan broj telefona, na primer +381 60 1234567.`
- date format/past/range errors
- required radio groups via `.ivan-cf7-required-radio`, `data-required="true"`, `aria-required="true"`, `data-error`, or a nearby field label containing `*`

Consent errors are still appended below `.ivan-cf7-consent`, not inside the small checkbox label wrapper.

## Success/failure behavior

- Success modal still opens only on the real CF7 `wpcf7mailsent` event.
- It does not open on submit click, `wpcf7submit`, generic forms, or `wpcf7mailfailed`.
- `wpcf7mailfailed` and `wpcf7spam` close any stale modal and show translated/styled error output.

## Server-side validation

Existing PHP hooks in `inc/cf7-bridge.php` were inspected and left in place:

- `your-phone` accepts `+381 60 1234567`, `+381601234567`, `0601234567`, `060 1234567`.
- date fields include `event-date` and accept `dd/mm/yyyy`.
- validation is scoped to configured inquiry CF7 form IDs when available.
- missing fields are not rejected by these custom hooks.

## Local QA

Harness tests:

- empty submit without CF7 runtime shows inline errors and no success modal
- consent-only invalid submit stays near the consent row and shows the consent message
- CF7-form mode allows submit to proceed instead of being cancelled by the adapter
- generic success event does not open modal
- `wpcf7mailfailed` shows Serbian failure text and no modal
- `wpcf7mailsent` opens the success modal
- `novalidate` is absent on prepared forms

ZIP audit:

- final ZIP: `C:\Users\Nikola\Documents\Ivan-site-codex-fix\wordpress-theme\ivan-sedative-theme.zip`
- SHA-256: `CBB636E574DBD9F8D1FF051F820660AA683B6D120674993B6805893F2AFC93FD`
- theme version: `1.0.28`
- manifest entry: `src/wp-entry.tsx`
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- root `"/assets/"` references: `0`
- missing manifest assets: `0`
- `stopImmediatePropagation`: `0`
- `setAttribute("novalidate")`: `0`
- adapter CSS packaged once
- adapter JS packaged once

## Live WordPress checks still required

Because CF7 Mail tab configuration and actual email delivery live in the WordPress database/server, the repository cannot prove transport delivery locally.

After installing the ZIP and clearing caches, verify:

1. `/upit/svadba` empty submit shows field-level errors.
2. Filled form without consent shows the consent message under the consent row.
3. Invalid email/phone/date values show the expected Serbian messages.
4. Valid form with consent triggers real `wpcf7mailsent`.
5. Success modal appears only after `wpcf7mailsent`.
6. Failed mail shows a styled Serbian error and no success modal.
7. Mail arrives at `info@ivansedativeband.com`.
8. Repeat the same core flow on `/upit/korporativna-proslava`.

## Limitation

PHP CLI is not available in this environment, so `php -l` could not be run. No commit, push, PR, merge, plugin change, database change, or WordPress settings change was performed.

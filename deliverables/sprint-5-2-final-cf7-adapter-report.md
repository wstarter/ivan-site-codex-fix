# Sprint 5.2 — Final CF7 Inquiry Adapter Report

## 1. Baseline status

Baseline gate passed before edits:

- Branch: `sprint-4-assets-page-heroes`
- Worktree: clean before Sprint 5.2 edits
- React: `18.3.1`
- React DOM: `18.3.1`
- Theme/cache version before edits: `1.0.25`
- `package-lock.json`: absent
- WordPress entry: `src/wp-entry.tsx`
- `createRoot`: present
- `hydrateRoot(document)`: `0`
- Root `"/assets/"` references in the WordPress bundle: `0`

Final target version is `1.0.26`.

## 2. Files changed

Source and theme files:

- `src/lib/interaction-safety.ts`
- `src/routes/hvala.tsx`
- `wordpress-theme/ivan-sedative-theme/assets/css/ivan-cf7-adapter.css` (new)
- `wordpress-theme/ivan-sedative-theme/assets/js/ivan-cf7-adapter.js` (new)
- `wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php`
- `wordpress-theme/ivan-sedative-theme/inc/enqueue.php`
- `wordpress-theme/ivan-sedative-theme/inc/pixel-bridge.php`
- `wordpress-theme/ivan-sedative-theme/functions.php`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/THEME_SETUP.md`

Generated build/package files:

- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-CHt0m9EI.js`
- `wordpress-theme/ivan-sedative-theme.zip`

## 3. Existing CF7 adapter diagnosis

The reusable WordPress adapter assets did not exist at the expected theme paths. Sprint 5 visual styles lived in `src/styles.css`, but there was no standalone inquiry-only adapter for runtime validation, translated system UX, or a consistent success modal.

The previous success flow was conditional: `inc/pixel-bridge.php` installed the `wpcf7mailsent` listener only when Pixel tracking was enabled and redirected to `/hvala`. That made thank-you behavior depend on Pixel settings.

Browser QA also caught and fixed an adapter edge during implementation: official CF7 DOM events dispatch from the `.wpcf7` wrapper, not from the nested form. The final resolver searches inside the nearest `.wpcf7-host`, so real CF7 events are handled correctly.

## 4. Success modal integration

The standalone JS adapter listens for `wpcf7mailsent` and opens the success modal only when the event belongs to a `.wpcf7-host` containing `.ivan-cf7`.

The modal is global and reusable for wedding, corporate, club, birthday, and future `.ivan-cf7` inquiry forms. It is not coupled to one CF7 ID or route.

The Pixel bridge now records `fbq('track', 'Lead')` only for a successful scoped inquiry event. It no longer redirects. The modal works independently of Pixel enablement.

The modal is removed on close button, backdrop click, `Escape`, `pagehide`, `popstate`, and `beforeunload`. Closing clears body/html overflow and touch-action locks.

## 5. Thank you modal typography changes

The modal now uses the compact premium hierarchy:

- Eyebrow: `LIVE MUSIC EXPERIENCE`
- Heading: `UPIT JE USPEŠNO POSLAT`
- Copy: `Hvala vam na poverenju. Vaš upit je primljen i javićemo se u najkraćem roku.`
- Info block: `Slanje upita ne znači automatsku rezervaciju termina. Termin se potvrđuje tek nakon dogovora, avansa i ugovora.`

The `/hvala` route was aligned to the same hierarchy. Its oversized signature treatment was removed.

## 6. CF7 response output styling

The adapter CSS styles:

- `.wpcf7-response-output`
- sent, invalid, failed, aborted, spam, and unaccepted states
- `.wpcf7-not-valid-tip`
- custom `.ivan-cf7-inline-error`

Success output uses a dark surface with gold border/accent. Error output uses a dark surface with a warm red border. While the success modal is open, the underlying sent response output is hidden.

## 7. Serbian system messages guidance

The JS adapter translates common English CF7 runtime strings inside `.ivan-cf7` hosts and normalizes English select placeholders to `Izaberite opciju`. Recommended select markup must still use `first_as_label`, never `include_blank`.

Use this CF7 **Messages** tab set:

| CF7 message | Serbian value |
| --- | --- |
| Sender's message was sent successfully | Hvala na upitu. Vaša poruka je poslata i javićemo se u najkraćem roku. |
| Sender's message failed to send | Poruka trenutno nije poslata. Molimo pokušajte ponovo ili nas kontaktirajte direktno. |
| Validation errors occurred | Molimo proverite označena polja i pokušajte ponovo. |
| Submission was referred to as spam | Poruka nije poslata jer je sistem označio pokušaj kao spam. Molimo pokušajte ponovo. |
| There are terms that the sender must accept | Potrebno je da potvrdite saglasnost pre slanja upita. |
| There is a field that the sender must fill in | Ovo polje je obavezno. |
| Input is longer than the maximum allowed length | Uneti tekst je predugačak. |
| Input is shorter than the minimum allowed length | Uneti tekst je prekratak. |
| Date format is invalid | Unesite datum u formatu dan/mesec/godina. |
| Date is earlier than minimum limit | Uneti datum je već prošao. |
| Date is later than maximum limit | Uneti datum je previše kasni datum. |
| Number format is invalid | Unesite ispravan broj. |
| Number is smaller than minimum limit | Uneta vrednost je manja od dozvoljene. |
| Number is larger than maximum limit | Uneta vrednost je veća od dozvoljene. |
| Email address is invalid | Unesite ispravnu email adresu. |
| Telephone number is invalid | Unesite ispravan broj telefona. |

Example select:

```text
[select* event-type first_as_label "Izaberite tip događaja" "Novogodišnja proslava" "Godišnjica firme"]
```

## 8. Acceptance UX fix

Submitting without consent now renders this inline below `.ivan-cf7-consent`:

`Potrebno je da potvrdite saglasnost pre slanja upita.`

The error clears when consent is checked.

## 9. Email validation

Keep:

```text
[email* your-email placeholder "Npr. ime@domen.com"]
```

The browser UX layer validates general email structure and accepts real domains such as `.rs`, `.com`, `.net`, `.org`, and `.co`. It does not force `.com`. CF7 remains the server-side email validator.

## 10. Phone validation

Recommended markup:

```text
[tel* your-phone minlength:9 maxlength:20 placeholder "Npr. +381 60 1234567"]
```

The JS layer and PHP CF7 hooks accept `+`, digits, spaces, parentheses, `.`, `/`, and `-`, with `9–15` digits after normalization. Invalid values show:

`Unesite ispravan broj telefona, na primer +381 60 1234567.`

Server hooks: `wpcf7_validate_tel` and `wpcf7_validate_tel*`.

## 11. Date validation

Recommended markup:

```text
[text* event-date class:ivan-cf7-date placeholder "dan/mesec/godina"]
```

The JS layer validates every `.ivan-cf7-date`. The PHP hook validates configured inquiry date field names. Checks cover `dd/mm/yyyy`, real calendar dates, no past dates, and a maximum of ten years ahead.

Visible custom errors:

- Format: `Unesite datum u formatu dan/mesec/godina.`
- Past: `Uneti datum je već prošao.`
- Range: `Unesite realan budući datum.`

Server hooks: `wpcf7_validate_text` and `wpcf7_validate_text*`.

## 12. Submit button cleanup

`.ivan-cf7-submit` is normalized to the text-only label:

`POŠALJI UPIT`

Nested SVG/icon markup and submit pseudo-elements are removed or suppressed.

## 13. Typography changes

The WordPress adapter adds inquiry-scoped label, help, note, budget, response, validation, and modal typography. It complements the existing `.ivan-cf7-*` visual layer without changing page layout, content, form architecture, or theme assets.

## 14. Radio/followup spacing fix

Global spacing is added after `.ivan-cf7-options` and `.ivan-cf7-pills` when a CF7 control wrapper follows the radio/pill group.

## 15. Mobile QA

Verified at `390x844` in the in-app browser:

- Success modal width: `366px` inside the `390px` viewport
- Both modal actions fit without horizontal overflow
- Modal locks body/html only while open
- Closing the modal removes it and clears overflow/touch-action
- Page scroll resumes after close
- Existing mobile menu opens, locks body while active, unmounts on close, and restores scrolling
- Existing mobile menu also closes and unlocks on route navigation to `/kontakt`

## 16. Svadba route QA

Controlled `.ivan-cf7` harness verified:

- Serbian select placeholder
- Text-only submit button
- Empty required-field messages
- Acceptance inline message
- Email rejection and valid `.rs` acceptance
- Phone rejection and valid `+381 60 1234567` acceptance
- Invalid, past, out-of-range, and valid date handling
- Scoped failure response translation
- Success modal on inquiry `wpcf7mailsent`
- No modal for an out-of-scope generic success event

Real local `/upit/svadba?mode=generic` verified the React fallback form renders with no fixed overlay or stale overflow lock.

## 17. Korporativna route QA

Real local `/upit/korporativna-proslava?mode=empty` verified:

- Corporate fallback form renders
- No `.wpcf7-host` is forced when settings HTML is absent
- No fixed fullscreen overlay remains
- Body/html overflow remain clear
- Route title remains active

The reusable adapter applies to configured corporate `.ivan-cf7` HTML by class scope, not route-specific code. Use Serbian `first_as_label` options in the CF7 form markup.

## 18. Fallback regression QA

`Cf7FormSlot.tsx` remains unchanged. Its SHA-256 matches the pre-Sprint checkpoint:

`89E8010ADE56D3C3908408189D1FC32C73FCD907DC6387E54204E8FE78C655F1`

It still:

- renders React children when CF7 is missing;
- renders React children when HTML is empty;
- rejects raw `[contact-form-7 ...]` shortcode text;
- initializes real CF7 forms asynchronously with `requestAnimationFrame` or `setTimeout(0)`;
- wraps `wpcf7.init` in `try/catch`.

## 19. Client-side navigation QA

Verified:

- SPA navigation from `/upit/svadba` back to `/`
- Mobile menu route navigation to `/kontakt`
- No stale dialog, large fixed overlay, body overflow, or touch lock after navigation
- `/hvala`, `/faq`, and `/repertoar` render with expected titles

The standalone adapter installs once through `window.__ivanCf7AdapterInstalled`, preventing duplicate listener registration.

## 20. Hero asset regression QA

Homepage hero remains present and visible in local QA. Protected bridge/source files retain their checkpoint hashes:

- `src/lib/wp-bridge.ts`: `85BB91D3D741EBB0AF999DFC7F47D3276DDB0214A8851751E19811F75ACC3481`
- `src/lib/page-hero-assets.ts`: `5134EA0103A0415F33B40553FD598351219C97E041186A2751A997DB02FF9CCE`
- `inc/ivan-theme-data.php`: `F5CC902A6C6B5B703A95D61A4B2F2D8F9712D5F66E91EB9A824B6245C7F6C127`

## 21. ZIP audit

Build command:

```text
npm run build:theme
```

ZIP command:

```text
npm run zip:theme
```

Final install ZIP:

`wordpress-theme/ivan-sedative-theme.zip`

SHA-256:

`3408A36FB713DC907489A48FFA7370A949ED142B995D3FE1C170730651ABC755`

Direct final-ZIP audit:

| Check | Result |
| --- | --- |
| Theme/cache constant | `1.0.26` |
| `style.css` header | `1.0.26` |
| React / React DOM source dependency | `18.3.1` / `18.3.1` |
| Manifest entry | `src/wp-entry.tsx` |
| Built JS | `assets/index-CHt0m9EI.js` |
| `createRoot` | present |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |
| Missing manifest assets | `0` |
| Allura / cursive / Lovable frontend markers | `0 / 0 / 0` |
| `package-lock.json` in repo / ZIP | absent / absent |
| Adapter CSS / JS in ZIP | present exactly once |
| `window.IvanTheme` inline enqueue bridge | preserved |
| Ivan Settings hero bridge | preserved |
| Dynamic route SEO source | preserved |
| CF7 `do_shortcode` bridge | preserved |
| CF7 phone/date PHP hooks | packaged |
| Pixel Lead redirect | removed; inquiry-scoped Lead tracking preserved |
| Calendar bridge | unchanged checkpoint hash |
| Mobile menu source | unchanged checkpoint hash |
| FAQ source | unchanged checkpoint hash |
| Repertoar source | unchanged checkpoint hash |

## 22. Live verification instructions

1. Install `wordpress-theme/ivan-sedative-theme.zip`.
2. Clear WordPress, plugin, CDN, and browser caches.
3. Open `/upit/svadba` in an incognito window.
4. Test empty submit, unchecked consent, invalid phone, invalid email, invalid date, and valid sending.
5. Confirm the Thank you modal appears after valid sending.
6. Confirm mail arrives at `info@ivansedativeband.com`.
7. Repeat on `/upit/korporativna-proslava`.
8. If English UI text remains, update the CF7 Messages tab and confirm every select uses `first_as_label`.

Mail tab standard for every inquiry form:

```text
To: info@ivansedativeband.com
From: Ivan Jovanović Live <info@ivansedativeband.com>
Additional headers: Reply-To: [your-email]
```

Keep the current field names tied to each Mail tab. For deliverability improvements, configure SMTP; do not change the theme email address.

## 23. Warnings / limitations

- No WordPress database changes were made.
- No plugin dependency was added.
- CF7 form markup, Messages tabs, Mail tabs, SMTP, and actual production email delivery still require live WordPress verification.
- PHP CLI is not installed in this Windows shell, so `php -l` could not run. PHP additions were inspected and verified as present in the final ZIP.
- The TanStack development server emits its existing SSR hydration warnings during local dev navigation. The packaged WordPress bundle is separately audited and uses `createRoot(#root)` with `hydrateRoot(document) = 0`.
- No commit, push, pull request, or merge was performed.

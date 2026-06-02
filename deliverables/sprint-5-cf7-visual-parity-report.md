# Sprint 5 - CF7 Visual Parity Report

## 1. Baseline status

Baseline gate passed before edits:

| Check | Result |
| --- | --- |
| Branch | `sprint-4-assets-page-heroes` |
| Worktree | Clean |
| Theme header version | `1.0.24` |
| Cache constant | `1.0.24` |
| React | `18.3.1` |
| React DOM | `18.3.1` |
| `package-lock.json` | Absent |
| WordPress entry | `src/wp-entry.tsx` |
| `createRoot` | Present |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |

The completed installer is bumped to theme/cache version `1.0.25`.

## 2. Current CF7 visual problem

The CF7 bridge was already working correctly. WordPress executes the configured shortcode server-side and injects rendered HTML into `window.IvanTheme.forms[key].html`. `Cf7FormSlot` mounts that HTML inside the inquiry card and falls back to the React form when HTML is missing or still looks like an unexecuted shortcode.

The visual issue was narrower: raw CF7 output only had a short generic CSS layer and its selectors were global. That gave the live wedding form a conventional vertical CF7 appearance instead of the premium inquiry hierarchy used by the React fallback.

## 3. Files changed

Source:

- `src/styles.css`
- `wordpress-theme/ivan-sedative-theme/style.css`
- `wordpress-theme/ivan-sedative-theme/functions.php`

Generated WordPress bundle:

- `dist-wp/.vite/manifest.json`
- `dist-wp/assets/index-DmOewDIc.js`
- `dist-wp/assets/styles-D_52SX7p.css`
- `wordpress-theme/ivan-sedative-theme/assets/app/.vite/manifest.json`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/index-DmOewDIc.js`
- `wordpress-theme/ivan-sedative-theme/assets/app/assets/styles-D_52SX7p.css`

The previous hashed JS/CSS assets were replaced by the generated files above.

## 4. CSS strategy

`src/styles.css` now has two complementary layers:

1. A safe generic CF7 layer for existing forms that still use default CF7 markup.
2. A premium `.ivan-cf7-*` class system for Form-tab markup that follows the React fallback layout more closely.

The theme keeps CF7 as the submission engine. No WordPress database values, CF7 forms, CF7 shortcodes, Mail-tab settings, bridge behavior, or React fallback fields were modified.

## 5. Generic CF7 styling scope

Generic selectors are scoped under:

```css
.wpcf7-host .wpcf7
```

`.wpcf7-host` is the existing inquiry-only wrapper emitted by `Cf7FormSlot`. The new styling does not affect CF7 forms outside inquiry pages.

The scoped layer styles:

- `form`, labels, placeholders, inputs, selects, textareas, and range controls;
- checkbox, acceptance, and list-item output;
- full-width gold CTA submit buttons;
- validation tips and response output;
- the CF7 spinner;
- width constraints that prevent horizontal overflow.

## 6. Custom `.ivan-cf7` class system

The new Form-tab classes are:

- `.ivan-cf7`
- `.ivan-cf7-section`
- `.ivan-cf7-section-title`
- `.ivan-cf7-row`
- `.ivan-cf7-step`
- `.ivan-cf7-copy`
- `.ivan-cf7-label`
- `.ivan-cf7-help`
- `.ivan-cf7-field`
- `.ivan-cf7-options`
- `.ivan-cf7-consent`
- `.ivan-cf7-submit`
- `.ivan-cf7-note`

Desktop rows use three columns: numbered step, explanatory copy, and field. Below `768px`, each field stacks below its step and copy. Option fields render as dark/gold pills, and the submit action matches the existing premium CTA direction.

## 7. Recommended CF7 markup for "Upit za svadbu"

Paste the following into **Contact Form 7 -> Upit za svadbu -> Form**:

```html
<div class="ivan-cf7">
  <section class="ivan-cf7-section">
    <h2 class="ivan-cf7-section-title">DETALJI DOGAĐAJA</h2>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">1</span>
      <div class="ivan-cf7-copy">
        <span class="ivan-cf7-label">Datum svadbe *</span>
        <p class="ivan-cf7-help">Kog datuma organizujete svadbu?</p>
      </div>
      <div class="ivan-cf7-field">[date* wedding_date]</div>
    </div>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">2</span>
      <div class="ivan-cf7-copy">
        <span class="ivan-cf7-label">Lokacija svadbe *</span>
        <p class="ivan-cf7-help">Država, grad i restoran / prostor</p>
      </div>
      <div class="ivan-cf7-field">[text* wedding_location placeholder "Npr. Srbija, Beograd, Kalemegdanska terasa"]</div>
    </div>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">3</span>
      <div class="ivan-cf7-copy">
        <span class="ivan-cf7-label">Broj gostiju *</span>
        <p class="ivan-cf7-help">Tačan ili okviran broj gostiju</p>
      </div>
      <div class="ivan-cf7-field">[text* guest_count placeholder "Npr. 150-200"]</div>
    </div>
  </section>

  <section class="ivan-cf7-section">
    <h2 class="ivan-cf7-section-title">BUDŽET</h2>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">4</span>
      <div class="ivan-cf7-copy">
        <span class="ivan-cf7-label">Koji je vaš planirani budžet? *</span>
        <p class="ivan-cf7-help">Izaberite okvirni budžet</p>
      </div>
      <div class="ivan-cf7-field">[range* budget min:500 max:50000 step:500 default:3500]</div>
    </div>
  </section>

  <section class="ivan-cf7-section">
    <h2 class="ivan-cf7-section-title">DODATNE OPCIJE</h2>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">5</span>
      <div class="ivan-cf7-copy">
        <span class="ivan-cf7-label">Dodatni muzički i show program *</span>
        <p class="ivan-cf7-help">Kvarteti za vreme skupa svatova, DJ za tortu, kabare program i dodatni sadržaj.</p>
      </div>
      <div class="ivan-cf7-field ivan-cf7-options">[radio additional_program use_label_element "Da" "Ne" "Želim preporuku"]</div>
    </div>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">6</span>
      <div class="ivan-cf7-copy">
        <span class="ivan-cf7-label">Da li očekujete veći broj stranih gostiju ili gostiju iz različitih kultura? *</span>
        <p class="ivan-cf7-help">Strani gosti, kulture i jezici</p>
      </div>
      <div class="ivan-cf7-field">
        <div class="ivan-cf7-options">[radio international_wedding use_label_element "Da" "Ne"]</div>
        [text languages placeholder "Koje kulture / jezici su važni? (opciono)"]
      </div>
    </div>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">7</span>
      <div class="ivan-cf7-copy">
        <span class="ivan-cf7-label">Posebni zahtevi i napomene</span>
        <p class="ivan-cf7-help">Pesme, želje, pitanja...</p>
      </div>
      <div class="ivan-cf7-field">[textarea notes placeholder "Unesite vaše zahteve, napomene ili pitanja..."]</div>
    </div>
  </section>

  <section class="ivan-cf7-section">
    <h2 class="ivan-cf7-section-title">KONTAKT PODACI</h2>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">8</span>
      <div class="ivan-cf7-copy"><span class="ivan-cf7-label">Ime i prezime *</span></div>
      <div class="ivan-cf7-field">[text* full_name placeholder "Vaše ime i prezime"]</div>
    </div>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">9</span>
      <div class="ivan-cf7-copy"><span class="ivan-cf7-label">Telefon (Viber / WhatsApp) *</span></div>
      <div class="ivan-cf7-field">[tel* phone placeholder "Vaš broj telefona"]</div>
    </div>

    <div class="ivan-cf7-row">
      <span class="ivan-cf7-step">10</span>
      <div class="ivan-cf7-copy"><span class="ivan-cf7-label">Email adresa *</span></div>
      <div class="ivan-cf7-field">[email* email placeholder "Vaša email adresa"]</div>
    </div>
  </section>

  <div class="ivan-cf7-consent">
    [acceptance consent] Saglasan sam da me kontaktirate u vezi upita. [/acceptance]
  </div>

  [text company_site class:ivan-honeypot autocomplete:off]
  [submit class:ivan-cf7-submit "POŠALJI UPIT"]
  <p class="ivan-cf7-note">Garantujemo odgovor i ponudu u roku od 24h od prijema upita, često i ranije.</p>
</div>
```

## 8. Why this avoids the CF7 configuration error

Complex CF7 controls are no longer wrapped by handwritten `<label>` elements.

The radio groups and acceptance field sit in neutral `<div>` containers. `use_label_element` lets CF7 generate valid option labels for each radio choice. Text, date, range, textarea, and contact fields also sit in `.ivan-cf7-field` wrappers rather than nested label structures.

If a future form uses `[select ...]` or `[checkbox ...]`, keep that tag directly inside `.ivan-cf7-field` or `.ivan-cf7-field.ivan-cf7-options`. Do not place it inside a handwritten `<label>`.

## 9. CF7 visual QA

Disposable harness QA with generic CF7 HTML passed:

- CF7 output replaced the React fallback.
- Dark text inputs, email input, select, textarea, placeholders, checkbox, and acceptance text rendered correctly.
- Submit rendered as a full-width gold CTA.
- Validation tip and response output were styled and readable.
- CF7 spinner selector is present.
- No horizontal overflow was detected.

## 10. Custom markup QA

Disposable harness QA with `.ivan-cf7` markup passed:

- Three sample sections rendered.
- Five sample rows rendered with five numbered steps.
- Desktop row grid rendered as step + copy + field columns.
- Checked option pill received the gold active treatment.
- Budget range control received scoped styling.
- Submit remained full width.
- CF7 deferred initialization was observed once after mount.

## 11. Fallback form regression QA

Passed:

- Active CF7 with empty HTML rendered the React wedding fallback.
- Raw invalid shortcode HTML rendered the React wedding fallback.
- Raw shortcode text was not shown to visitors.

## 12. Mobile QA

At `390px`:

- Generic CF7 form width: `308px` inside the inquiry card.
- Generic CF7 input width: `308px`.
- Generic CF7 submit width: `308px`.
- Generic acceptance width: `308px`.
- Custom CF7 rows stacked fields below step/copy.
- Custom submit stayed full width.
- Document width stayed `390px`.
- Horizontal overflow: none.

## 13. Client-side navigation QA

Passed:

- Homepage -> wedding CF7 route rendered exactly one `.wpcf7-host`.
- Back -> birthday inquiry route rendered the unchanged React fallback.
- Back -> wedding CF7 route rendered exactly one `.wpcf7-host` again.
- Route titles updated after navigation.
- Mobile menu opened with body lock, then closed after navigation and cleared body/html interaction locks.

## 14. Hero asset regression QA

Passed. A simulated Ivan Settings override changed the wedding hero source to the configured bridge asset while CF7 remained rendered.

## 15. ZIP audit

Final installer:

`wordpress-theme/ivan-sedative-theme.zip`

SHA-256:

`E896C49E666F1484C071BFDEAA2040B3A37134968E1BBF306D60D10F69BD1267`

Direct installer audit:

| Check | Result |
| --- | --- |
| Theme header version | `1.0.25` |
| Cache constant | `1.0.25` |
| React / React DOM | `18.3.1` / `18.3.1` |
| Manifest entry | `src/wp-entry.tsx` |
| Built JS | `assets/index-DmOewDIc.js` |
| Built CSS | `assets/styles-D_52SX7p.css` |
| Missing manifest assets | `0` |
| `createRoot` | Present |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |
| Allura markers | `0` |
| `cursive` markers | `0` |
| Lovable frontend markers | `0` |
| `package-lock.json` | Absent |
| Inline `window.IvanTheme` bridge | Preserved |
| Ivan Settings asset payload | Preserved |
| Dynamic title/meta implementation | Preserved |
| CF7 shortcode bridge | Preserved |
| React fallback form | Preserved |
| Inquiry sidebar | Preserved |
| Calendar bridge | Preserved and unchanged |
| Mobile menu | Unchanged |
| FAQ | Unchanged |
| Repertoar | Unchanged |

Commands used:

```bash
npm run build:theme
npm run zip:theme
```

## 16. Live verification instructions

1. Install `wordpress-theme/ivan-sedative-theme.zip`.
2. Open `/upit/svadba`.
3. Confirm that the existing CF7 shortcode already looks more aligned with the dark inquiry design.
4. In **Contact Form 7 -> Upit za svadbu**, replace the Form-tab content with the recommended `.ivan-cf7` markup from section 7.
5. Save the CF7 form.
6. Open `/upit/svadba` in an incognito window.
7. Confirm:
   - no CF7 configuration error;
   - the form follows the premium inquiry design;
   - the submit button is styled;
   - no horizontal overflow;
   - validation works;
   - mail delivery works after the Mail tab is configured.

## 17. Warnings / limitations

- This sprint intentionally does not modify the WordPress database or CF7 admin content.
- The recommended Form-tab markup must be pasted manually.
- Configure the CF7 Mail tab with the field names from section 7 before testing delivery.
- Keep the `company_site` honeypot handling aligned with the theme setup guidance.
- The in-app browser produced a successful generic desktop visual capture. Later custom/mobile capture attempts timed out in the browser capture channel, so those variants were verified through rendered computed geometry, DOM state, and real pointer interactions instead.
- No commit, push, pull request, or merge was performed.

# Sprint 4.4 - Fix Missing Ivan Settings Asset Payload

## 1. Baseline Status

The required gate passed before edits:

| Check | Result |
| --- | --- |
| Branch | `sprint-4-assets-page-heroes` |
| Worktree | Clean |
| Starting theme/cache version | `1.0.22` |
| React | `18.3.1` |
| React DOM | `18.3.1` |
| `package-lock.json` | Absent |
| `createRoot` | Present |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |

## 2. Root Cause

The Ivan Settings field definitions, saved option array, PHP asset map, and
frontend resolver were already correct. The failure happened later in the
WordPress enqueue pipeline.

The live `1.0.22` source was inspected before the fix. It served the current
hashed frontend assets:

```text
styles-BStCWnjc.css?ver=1.0.22
index-CHaV6v8E.js?ver=1.0.22
```

However, the live source contained no `window.IvanTheme` script at all.
Therefore it also contained no `window.IvanTheme.assets` and no asset keys such
as `formWeddingHero`, `formBirthdayHero`, `uslugeHero`, or `repertoireHero`.

`inc/enqueue.php` added the inline bridge correctly:

```php
wp_add_inline_script(
    'ivan-app',
    'window.IvanTheme = ' . wp_json_encode( $bridge ) . ';',
    'before'
);
```

But `ivan_module_script_tag()` then replaced the complete filtered WordPress
script block:

```php
$tag = '<script type="module" crossorigin src="' . esc_url( $src ) . '"></script>' . "\n";
```

Current WordPress passes inline `before` scripts inside that filtered block.
Replacing the whole block removed `window.IvanTheme`, including the complete
asset payload.

For the requested three-way classification, the live outcome is category 1:
the keys were not present in live `window.IvanTheme.assets`. More precisely,
the PHP collector did add them correctly, but the entire inline
`window.IvanTheme` block was discarded during script-tag filtering.

## 3. Files Changed

| File | Change |
| --- | --- |
| `wordpress-theme/ivan-sedative-theme/inc/enqueue.php` | Preserve WordPress inline `before` scripts while transforming only the external `ivan-app` tag into a module tag. |
| `wordpress-theme/ivan-sedative-theme/functions.php` | Bump central cache version to `1.0.23`. |
| `wordpress-theme/ivan-sedative-theme/style.css` | Bump WordPress theme header to `Version: 1.0.23`. |
| `deliverables/sprint-4-4-fix-missing-ivan-settings-asset-payload-report.md` | Add this report. |

No React source, layout, typography, content, form, calendar, FAQ, mobile-menu,
footer, CF7 bridge, or calendar bridge file was edited.

## 4. Complete Asset Map

All visual settings are saved in the single WordPress option array:

```text
ivan_theme_settings
```

| Admin label | WordPress option name | `window.IvanTheme.assets` key | Frontend route or use |
| --- | --- | --- | --- |
| Hero Ivan | `asset_hero_ivan` | `heroIvan` | Homepage portrait |
| Wedding form hero | `asset_form_wedding_hero` | `formWeddingHero` | `/upit/svadba` |
| Corporate form hero | `asset_form_corporate_hero` | `formCorporateHero` | `/upit/korporativna-proslava` |
| Club/gastro form hero | `asset_form_club_hero` | `formClubHero` | `/upit/klupska-svirka` |
| Birthday/jubilee form hero | `asset_form_birthday_hero` | `formBirthdayHero` | `/upit/rodjendan-jubilej` |
| Usluge hero | `asset_usluge_hero` | `uslugeHero` | `/usluge` |
| Način rada hero | `asset_workflow_hero` | `workflowHero` | Reserved registry key; `/nacin-rada` redirects to `/repertoar#nacin-rada` |
| Repertoar hero | `asset_repertoire_hero` | `repertoireHero` | `/repertoar` |
| Dopunski programi hero | `asset_additional_hero` | `additionalProgramsHero` | `/dopunski-programi` |
| Instagram/media hero | `asset_media_hero` | `mediaHero` | `/instagram` |
| Kontakt hero | `asset_contact_hero` | `contactHero` | `/kontakt` |
| Dostupni termini hero | `asset_calendar_hero` | `calendarHero` | `/dostupni-termini` |
| FAQ hero | `asset_faq_hero` | `faqHero` | `/faq` |
| Hvala hero | `asset_thank_you_hero` | `thankYouHero` | `/hvala` |
| OG image | `asset_og_image` | `ogImage` | SEO/Open Graph bridge |

## 5. PHP Bridge Behavior

### Before Fix

1. `theme-settings.php` rendered all 15 media fields with names such as:

   ```text
   ivan_theme_settings[asset_form_wedding_hero]
   ```

2. `ivan_sanitize_settings()` preserved known values through
   `sanitize_text_field()`.
3. `ivan_get_settings()` merged saved values with defaults.
4. `ivan_collect_assets_bridge()` produced all 15 bridge keys, including empty
   values as `{ src: "", alt: "" }`.
5. `wp_add_inline_script()` attached the serialized payload before `ivan-app`.
6. `ivan_module_script_tag()` discarded the complete inline block while
   replacing the filtered tag.

### After Fix

The module filter now modifies only the external `<script src="...">` tag with
`preg_replace_callback()`. It preserves WordPress inline `before` output,
retains WordPress attributes such as the script id, and adds or normalizes:

```html
type="module"
crossorigin
```

As a result, live WordPress output can retain:

```text
window.IvanTheme.assets.heroIvan
window.IvanTheme.assets.formWeddingHero
...
window.IvanTheme.assets.ogImage
```

## 6. Frontend Resolver Behavior

### Before Fix

The frontend resolver was already correct:

```ts
const settingsSrc = getWpAssets()?.[fallbackKey]?.src?.trim();
if (settingsSrc) return settingsSrc;

const fallbackSrc = getVisualAsset(fallbackKey).src.trim();
return fallbackSrc || undefined;
```

It applies the required priority:

1. non-empty Ivan Settings URL;
2. bundled fallback;
3. `undefined` when neither exists.

The layout components render hero images conditionally, so `undefined` does not
create a broken `<img>`.

### After Fix

No frontend edit was necessary. Restoring the missing inline payload allows the
existing resolver to receive and use Ivan Settings overrides.

## 7. Build And Package

Commands used:

```text
npm.cmd run build:theme
npm.cmd run zip:theme
```

`npm.cmd` was used because this Windows PowerShell policy blocks `npm.ps1`. The
npm scripts themselves were executed unchanged.

Manifest output:

| Item | Value |
| --- | --- |
| Manifest entry | `src/wp-entry.tsx` |
| JavaScript | `assets/index-CHaV6v8E.js` |
| CSS | `assets/styles-BStCWnjc.css` |

## 8. WordPress-Style Harness QA

The packaged production frontend was loaded in a disposable WordPress-style
HTML shell with a complete `window.IvanTheme.assets` object.

### Source And Ordering

| Check | Result |
| --- | --- |
| Inline `window.IvanTheme` position | `321` |
| App module position | `1189` |
| Inline payload before app JS | Pass |
| CSS uses `?ver=1.0.23` | Pass |
| JS uses `?ver=1.0.23` | Pass |
| `assets` object exists | Pass |
| All 15 asset keys exist, including empty values | Pass |

### Exact Injected Override Simulation

| Route | Injected value | Rendered DOM result |
| --- | --- | --- |
| `/upit/svadba` | `https://example.com/custom-wedding.jpg` | Override selected |
| `/upit/rodjendan-jubilej` | `https://example.com/custom-birthday.jpg` | Override selected |
| `/usluge` | `https://example.com/custom-usluge.jpg` | Override selected |
| `/repertoar` | `https://example.com/custom-repertoar.jpg` | Override selected |

### Fallback And Visible-Image Simulation

| Check | Result |
| --- | --- |
| Empty `formWeddingHero.src` uses bundled fallback | Pass |
| Missing `formWeddingHero` key uses bundled fallback | Pass |
| Locally served wedding override loads visibly | Pass |
| Locally served birthday override loads visibly | Pass |
| Locally served Usluge override loads visibly | Pass |
| Locally served repertoire override loads visibly | Pass |
| Mobile wedding override at `390px` | Pass |
| Mobile birthday override at `390px` | Pass |
| Mobile empty fallback at `390px` | Pass |
| Horizontal overflow at `390px` | `0` |
| Homepage smoke check | Pass |
| FAQ smoke check | Pass |
| Browser runtime errors | `0` |

## 9. Direct ZIP Audit

Final ZIP:

```text
wordpress-theme/ivan-sedative-theme.zip
```

SHA-256:

```text
10C88C463660683411524ECC194401B89B9B261834348BEB35CF693518B5ECA5
```

The final ZIP was extracted to a disposable audit directory and checked
directly.

| ZIP check | Result |
| --- | --- |
| Theme header version | `1.0.23` |
| Cache constant | `1.0.23` |
| React `18.3.1` bundle markers | `4` |
| Manifest entry | `src/wp-entry.tsx` |
| Manifest JS and CSS exist | Pass |
| Missing manifest assets | `0` |
| `createRoot` markers | `4` |
| `hydrateRoot(document)` | `0` |
| Root `"/assets/"` references | `0` |
| `package-lock.json` | Absent |
| Frontend Allura markers | `0` |
| Frontend cursive markers | `0` |
| Frontend Lovable markers | `0` |
| Inline bridge attached before `ivan-app` | Pass |
| Module filter preserves inline block | Pass |
| All 15 expected PHP payload keys | Pass |
| CF7 bridge hash unchanged | Pass |
| Calendar bridge hash unchanged | Pass |
| Mobile menu hash unchanged | Pass |
| FAQ hash unchanged | Pass |

Protected hashes:

```text
src/wp-entry.tsx
DF476C7B5D5F1B775319EA669492CD3F7AE031AC2E48EBED0D81BE04D9F27794

src/lib/interaction-safety.ts
226259CEFCC1697045B761E56F9B10D4AA8804A9127ECD1FAFE009578C992DC2

src/lib/wp-bridge.ts
85BB91D3D741EBB0AF999DFC7F47D3276DDB0214A8851751E19811F75ACC3481

src/components/site/MobileMenu.tsx
9C6B543D202989BA723EE0D66B5255ADDE510CB50E09B29AB00421D24FF90016

src/components/site/form/Cf7FormSlot.tsx
89E8010ADE56D3C3908408189D1FC32C73FCD907DC6387E54204E8FE78C655F1

src/routes/faq.tsx
94573F2C4CD7486DD02BB862AAF97CB38FCF5B72869C9F74E2AFC76523772ACE

wordpress-theme/ivan-sedative-theme/inc/cf7-bridge.php
31AC3A858BC92EB8EF5CD07F88D3FE6EC5E988168EFCFF6DE20518E62EBD41D9

wordpress-theme/ivan-sedative-theme/inc/calendar-bridge.php
B1E3E94F4F6A57A625280F76931D7C1E520C6727C07F12149FBD0AA29A8FCAA5

wordpress-theme/ivan-sedative-theme/inc/ivan-theme-data.php
F5CC902A6C6B5B703A95D61A4B2F2D8F9712D5F66E91EB9A824B6245C7F6C127

wordpress-theme/ivan-sedative-theme/inc/theme-settings.php
501BBA4BFC9F9BCAF9E495E3EE271BFB0F143B5B6ADC6377D1253B8A34370CDB
```

## 10. Live Verification Instructions

After installing the `1.0.23` ZIP:

1. Clear WordPress page cache and CDN cache, then hard refresh.
2. Open Appearance > Ivan Settings.
3. Change Wedding form hero to a clearly different image.
4. Save changes.
5. Open `/upit/svadba` in an incognito window.
6. Press `Ctrl+U`.
7. Search `formWeddingHero`.
8. Confirm `window.IvanTheme.assets.formWeddingHero.src` contains the new URL.
9. Confirm the new image is visible in the hero section.

Then test one inner page:

1. Change Usluge hero in Appearance > Ivan Settings.
2. Save changes.
3. Open `/usluge` in an incognito window.
4. Press `Ctrl+U`.
5. Search `uslugeHero`.
6. Confirm the source contains the new URL.
7. Confirm the new image is visible in the hero section.

The live page source should also contain all 15 asset keys even when some
values are empty.

## 11. Warnings And Limitations

- The live site was reachable during diagnosis and confirmed the real failure:
  current `1.0.22` JS/CSS loaded, but `window.IvanTheme` was absent.
- This environment cannot install the ZIP in the public WordPress admin.
  Final live confirmation must happen after installation and cache clearing.
- PHP CLI is not installed in this Windows environment. The loader fix was
  verified through source audit, direct ZIP audit, an isolated tag-transform
  simulation, and WordPress-style rendered HTML QA.
- No commit, push, pull request, or merge was performed.

<?php
/**
 * Contact Form 7 bridge.
 *
 * The React/Lovable design stays in place visually. In production, the actual
 * form mechanics are powered by CF7: we render the configured shortcode in PHP
 * (so do_shortcode runs server-side) and pass the resulting HTML to React via
 * `window.IvanTheme.forms[key].html`. React mounts that HTML inside its existing
 * form shell (replacing the prototype fields) so the design stays Lovable and
 * the submission/validation pipeline is CF7.
 *
 * If CF7 is not installed or the shortcode is empty, `html` is empty and React
 * falls back to its prototype form (with the placeholder LEAD logger).
 *
 * Spam / security readiness (server-side):
 *   - The frontend honeypot `company_site` is mirrored on the CF7 form template.
 *     CF7 should be configured to reject submissions where this field is filled
 *     (e.g. via "CF7 Honeypot" plugin, or the recommended snippet below).
 *   - Recommend installing one of:
 *       * Contact Form 7 — Cloudflare Turnstile
 *       * reCAPTCHA v3 integration
 *       * Akismet for CF7
 *   - Do NOT hardcode any CAPTCHA site/secret keys in the theme.
 *
 * Flamingo:
 *   - Install the Flamingo plugin. As long as form field names match (full_name,
 *     phone, email, budget, …), Flamingo stores every submission automatically.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ivan_cf7_is_active() {
	return defined( 'WPCF7_VERSION' ) || function_exists( 'wpcf7' );
}

/**
 * Numeric CF7 IDs configured for the four inquiry routes.
 */
function ivan_cf7_inquiry_form_ids() {
	$s   = ivan_get_settings();
	$ids = array();
	foreach ( array( 'cf7_wedding', 'cf7_corporate', 'cf7_club', 'cf7_birthday' ) as $key ) {
		$raw = trim( (string) ( $s[ $key ] ?? '' ) );
		if ( $raw === '' ) { continue; }
		if ( ctype_digit( $raw ) ) {
			$ids[] = (int) $raw;
		} elseif ( preg_match( '/id\s*=\s*"?(\d+)"?/', $raw, $matches ) ) {
			$ids[] = (int) $matches[1];
		}
	}
	return array_values( array_unique( $ids ) );
}

/**
 * Scope custom CF7 validation to the configured inquiry forms whenever IDs
 * are available. Field names remain the fallback for a new form before its
 * shortcode has been saved in Appearance -> Ivan Settings.
 */
function ivan_cf7_is_inquiry_validation_context() {
	$ids = ivan_cf7_inquiry_form_ids();
	if ( empty( $ids ) ) { return true; }
	if ( ! class_exists( 'WPCF7_ContactForm' ) || ! method_exists( 'WPCF7_ContactForm', 'get_current' ) ) {
		return false;
	}
	$form = WPCF7_ContactForm::get_current();
	return $form && in_array( (int) $form->id(), $ids, true );
}

function ivan_cf7_posted_value( $key ) {
	if ( ! isset( $_POST[ $key ] ) ) { return ''; }
	return trim( sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
}

function ivan_cf7_valid_phone( $value ) {
	if ( ! preg_match( '/^\+?[\d\s().\/-]+$/', $value ) ) { return false; }
	$digits = preg_replace( '/\D+/', '', $value );
	$length = strlen( $digits );
	return $length >= 9 && $length <= 15;
}

function ivan_cf7_phone_validation( $result, $tag ) {
	if ( ! ivan_cf7_is_inquiry_validation_context() || $tag->name !== 'your-phone' ) { return $result; }
	$value = ivan_cf7_posted_value( $tag->name );
	if ( $value !== '' && ! ivan_cf7_valid_phone( $value ) ) {
		$result->invalidate( $tag, 'Unesite ispravan broj telefona, na primer +381 60 1234567.' );
	}
	return $result;
}
add_filter( 'wpcf7_validate_tel', 'ivan_cf7_phone_validation', 20, 2 );
add_filter( 'wpcf7_validate_tel*', 'ivan_cf7_phone_validation', 20, 2 );

function ivan_cf7_date_error( $value ) {
	if ( ! preg_match( '/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/', $value, $matches ) ) {
		return 'Unesite datum u formatu dan/mesec/godina.';
	}
	$day   = (int) $matches[1];
	$month = (int) $matches[2];
	$year  = (int) $matches[3];
	if ( ! checkdate( $month, $day, $year ) ) {
		return 'Unesite datum u formatu dan/mesec/godina.';
	}
	$timezone = wp_timezone();
	$date     = new DateTimeImmutable( sprintf( '%04d-%02d-%02d', $year, $month, $day ), $timezone );
	$today    = new DateTimeImmutable( 'today', $timezone );
	if ( $date < $today ) {
		return 'Uneti datum je već prošao.';
	}
	if ( $date > $today->modify( '+10 years' ) ) {
		return 'Unesite realan budući datum.';
	}
	return '';
}

function ivan_cf7_date_validation( $result, $tag ) {
	$date_fields = array( 'event-date', 'wedding-date', 'birthday-date' );
	if ( ! ivan_cf7_is_inquiry_validation_context() || ! in_array( $tag->name, $date_fields, true ) ) {
		return $result;
	}
	$value = ivan_cf7_posted_value( $tag->name );
	if ( $value !== '' ) {
		$error = ivan_cf7_date_error( $value );
		if ( $error !== '' ) { $result->invalidate( $tag, $error ); }
	}
	return $result;
}
add_filter( 'wpcf7_validate_text', 'ivan_cf7_date_validation', 20, 2 );
add_filter( 'wpcf7_validate_text*', 'ivan_cf7_date_validation', 20, 2 );

/**
 * Resolve a shortcode string from a settings value that may be either a full
 * shortcode or a numeric ID.
 */
function ivan_cf7_resolve_shortcode( $raw, $title = '' ) {
	$raw = trim( (string) $raw );
	if ( $raw === '' ) { return ''; }
	if ( ctype_digit( $raw ) ) {
		$title_attr = $title ? ' title="' . esc_attr( $title ) . '"' : '';
		return '[contact-form-7 id="' . (int) $raw . '"' . $title_attr . ']';
	}
	return $raw;
}

/**
 * Build the forms portion of the bridge payload.
 */
function ivan_forms_bridge( $s ) {
	$defs = array(
		'wedding'   => array( 'title' => 'Upit za svadbu',                'setting' => 'cf7_wedding'   ),
		'corporate' => array( 'title' => 'Upit za korporativnu proslavu', 'setting' => 'cf7_corporate' ),
		'club'      => array( 'title' => 'Upit za klupsku svirku',        'setting' => 'cf7_club'      ),
		'birthday'  => array( 'title' => 'Upit za rođendan / jubilej',    'setting' => 'cf7_birthday'  ),
	);

	$out = array();
	$cf7_active = ivan_cf7_is_active();

	foreach ( $defs as $key => $def ) {
		$shortcode = ivan_cf7_resolve_shortcode( $s[ $def['setting'] ] ?? '', $def['title'] );
		$html      = '';
		if ( $shortcode && $cf7_active ) {
			$html = do_shortcode( $shortcode );
		}
		$out[ $key ] = array(
			'key'                    => $key,
			'title'                  => $def['title'],
			'shortcode'              => $shortcode,
			'html'                   => $html,
			'futureShortcodeSetting' => 'ivan_cf7_' . $key,
			'cf7Active'              => $cf7_active,
		);
	}
	return $out;
}

/**
 * Admin notice when CF7 is missing — admins only, never shown to visitors.
 */
add_action( 'admin_notices', 'ivan_cf7_admin_notice' );
function ivan_cf7_admin_notice() {
	if ( ! current_user_can( 'manage_options' ) ) { return; }
	if ( ivan_cf7_is_active() ) { return; }
	echo '<div class="notice notice-warning"><p><strong>Ivan Sedative:</strong> ' .
		esc_html__( 'Contact Form 7 is not active. Inquiry forms will fall back to the React prototype (no email delivery).', 'ivan-sedative' ) .
		'</p></div>';
}

/**
 * Recommended CF7 templates for each form. These are NOT auto-installed; copy
 * them into CF7 → Contact Forms → New. Field names match the React payload.
 *
 * SHARED:
 *   [text* your-name]
 *   [tel* your-phone minlength:9 maxlength:20]
 *   [email* your-email]
 *   [acceptance consent]
 *   [text company_site class:ivan-honeypot]   ← honeypot, hide via CSS
 *   [range* budget-range min:500 max:50000 step:500]
 *
 * WEDDING extras:
 *   wedding_date, wedding_location, guest_count, additional_program,
 *   video_call, international_wedding, languages, notes
 *
 * CORPORATE extras:
 *   corporate_location, event_date, guest_count, active_music_time, genres,
 *   additional_content, invoice_payment, dress_code, dress_code_note, notes
 *
 * CLUB extras:
 *   location, venue_name, performance_duration, performance_blocks,
 *   start_time, end_time, event_date, soundcheck_start, soundcheck_end,
 *   invoice_payment, venue_note
 *
 * BIRTHDAY extras:
 *   location, birthday_date, celebration_type, guest_count,
 *   additional_content, dress_code, dress_code_note, notes
 */

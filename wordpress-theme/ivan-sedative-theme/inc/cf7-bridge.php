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
 *   [text* full_name]
 *   [tel* phone]
 *   [email* email]
 *   [acceptance consent]
 *   [text company_site class:ivan-honeypot]   ← honeypot, hide via CSS
 *   [number budget min:500 max:50000 step:500]
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
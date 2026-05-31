<?php
/**
 * Theme settings — Appearance → Ivan Settings.
 *
 * Uses the Settings API and a single option `ivan_theme_settings` so the theme
 * works without ACF Pro. ACF Options can be added later by reading the same
 * option key inside ivan-theme-data.php.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

const IVAN_OPTION_KEY = 'ivan_theme_settings';

function ivan_default_settings() {
	return array(
		// Contact
		'contact_phone'    => '',
		'contact_email'    => '',
		'contact_instagram'=> '',
		'contact_whatsapp' => '',

		// Visual assets (URLs; admin JS attaches WP media picker)
		'asset_hero_ivan'             => '',
		'asset_form_wedding_hero'     => '',
		'asset_form_corporate_hero'   => '',
		'asset_form_club_hero'        => '',
		'asset_form_birthday_hero'    => '',
		'asset_usluge_hero'           => '',
		'asset_workflow_hero'         => '',
		'asset_repertoire_hero'       => '',
		'asset_additional_hero'       => '',
		'asset_media_hero'            => '',
		'asset_contact_hero'          => '',
		'asset_calendar_hero'         => '',
		'asset_faq_hero'              => '',
		'asset_thank_you_hero'        => '',
		'asset_og_image'              => '',

		// Forms (CF7 shortcode IDs or full shortcodes)
		'cf7_wedding'   => '',
		'cf7_corporate' => '',
		'cf7_club'      => '',
		'cf7_birthday'  => '',

		// Budget
		'budget_min'     => 500,
		'budget_max'     => 50000,
		'budget_step'    => 500,
		'budget_wedding'  => 3500,
		'budget_corporate'=> 5000,
		'budget_club'     => 3000,
		'budget_birthday' => 3000,

		// Pixel
		'pixel_id'      => '',
		'pixel_enabled' => 0,

		// Cookies
		'cookies_enabled'    => 1,
		'cookies_text'       => 'Koristimo kolačiće za poboljšanje iskustva.',
		'cookies_privacy_url'=> '/politika-privatnosti',

		// Calendar (JSON array of unavailable dates)
		'calendar_unavailable_json' => '[]',
	);
}

function ivan_get_settings() {
	$saved = get_option( IVAN_OPTION_KEY, array() );
	if ( ! is_array( $saved ) ) { $saved = array(); }
	return wp_parse_args( $saved, ivan_default_settings() );
}

function ivan_get_setting( $key, $fallback = '' ) {
	$s = ivan_get_settings();
	return array_key_exists( $key, $s ) ? $s[ $key ] : $fallback;
}

add_action( 'admin_init', 'ivan_register_settings' );
function ivan_register_settings() {
	register_setting( 'ivan_theme_settings_group', IVAN_OPTION_KEY, array(
		'type'              => 'array',
		'sanitize_callback' => 'ivan_sanitize_settings',
		'default'           => ivan_default_settings(),
	) );
}

function ivan_sanitize_settings( $input ) {
	$defaults = ivan_default_settings();
	$clean    = array();
	foreach ( $defaults as $key => $default ) {
		if ( ! isset( $input[ $key ] ) ) { $clean[ $key ] = $default; continue; }
		$val = $input[ $key ];
		if ( in_array( $key, array( 'budget_min','budget_max','budget_step','budget_wedding','budget_corporate','budget_club','budget_birthday','pixel_enabled','cookies_enabled' ), true ) ) {
			$clean[ $key ] = (int) $val;
		} elseif ( in_array( $key, array( 'cookies_text' ), true ) ) {
			$clean[ $key ] = wp_kses_post( $val );
		} elseif ( $key === 'calendar_unavailable_json' ) {
			// Validate JSON; on failure store empty array.
			$decoded = json_decode( (string) $val, true );
			$clean[ $key ] = is_array( $decoded ) ? wp_json_encode( $decoded ) : '[]';
		} else {
			$clean[ $key ] = sanitize_text_field( $val );
		}
	}
	return $clean;
}

add_action( 'admin_menu', 'ivan_register_settings_page' );
function ivan_register_settings_page() {
	add_theme_page(
		__( 'Ivan Settings', 'ivan-sedative' ),
		__( 'Ivan Settings', 'ivan-sedative' ),
		'manage_options',
		'ivan-settings',
		'ivan_render_settings_page'
	);
}

add_action( 'admin_enqueue_scripts', 'ivan_admin_assets' );
function ivan_admin_assets( $hook ) {
	if ( $hook !== 'appearance_page_ivan-settings' ) { return; }
	wp_enqueue_media();
	wp_enqueue_style( 'ivan-admin', IVAN_THEME_URI . 'assets/admin/ivan-settings.css', array(), IVAN_THEME_VERSION );
	wp_enqueue_script( 'ivan-admin', IVAN_THEME_URI . 'assets/admin/ivan-settings.js', array( 'jquery' ), IVAN_THEME_VERSION, true );
}

function ivan_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) { return; }
	$s = ivan_get_settings();
	?>
	<div class="wrap ivan-settings-wrap">
		<h1><?php esc_html_e( 'Ivan Sedative — Theme Settings', 'ivan-sedative' ); ?></h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'ivan_theme_settings_group' ); ?>

			<h2><?php esc_html_e( 'Contact', 'ivan-sedative' ); ?></h2>
			<table class="form-table"><tbody>
				<?php ivan_text_field( 'contact_phone', 'Telefon', $s ); ?>
				<?php ivan_text_field( 'contact_email', 'Email', $s ); ?>
				<?php ivan_text_field( 'contact_instagram', 'Instagram URL', $s ); ?>
				<?php ivan_text_field( 'contact_whatsapp', 'WhatsApp / Viber URL ili broj', $s ); ?>
			</tbody></table>

			<h2><?php esc_html_e( 'Visual assets', 'ivan-sedative' ); ?></h2>
			<table class="form-table"><tbody>
				<?php foreach ( array(
					'asset_hero_ivan'           => 'Hero Ivan',
					'asset_form_wedding_hero'   => 'Wedding form hero',
					'asset_form_corporate_hero' => 'Corporate form hero',
					'asset_form_club_hero'      => 'Club/gastro form hero',
					'asset_form_birthday_hero'  => 'Birthday/jubilee form hero',
					'asset_usluge_hero'         => 'Usluge hero',
					'asset_workflow_hero'       => 'Način rada hero',
					'asset_repertoire_hero'     => 'Repertoar hero',
					'asset_additional_hero'     => 'Dopunski programi hero',
					'asset_media_hero'          => 'Instagram/media hero',
					'asset_contact_hero'        => 'Kontakt hero',
					'asset_calendar_hero'       => 'Dostupni termini hero',
					'asset_faq_hero'            => 'FAQ hero',
					'asset_thank_you_hero'      => 'Hvala hero',
					'asset_og_image'            => 'OG image',
				) as $k => $label ) {
					ivan_media_field( $k, $label, $s );
				} ?>
			</tbody></table>

			<h2><?php esc_html_e( 'CF7 form shortcodes', 'ivan-sedative' ); ?></h2>
			<p class="description"><?php esc_html_e( 'Paste the CF7 shortcode (e.g. [contact-form-7 id="123" title="Wedding"]) or just the numeric ID.', 'ivan-sedative' ); ?></p>
			<table class="form-table"><tbody>
				<?php ivan_text_field( 'cf7_wedding', 'CF7 — Svadba', $s ); ?>
				<?php ivan_text_field( 'cf7_corporate', 'CF7 — Korporativna proslava', $s ); ?>
				<?php ivan_text_field( 'cf7_club', 'CF7 — Klupska svirka', $s ); ?>
				<?php ivan_text_field( 'cf7_birthday', 'CF7 — Rođendan / jubilej', $s ); ?>
			</tbody></table>

			<h2><?php esc_html_e( 'Budget', 'ivan-sedative' ); ?></h2>
			<table class="form-table"><tbody>
				<?php ivan_number_field( 'budget_min', 'Min', $s ); ?>
				<?php ivan_number_field( 'budget_max', 'Max', $s ); ?>
				<?php ivan_number_field( 'budget_step', 'Step', $s ); ?>
				<?php ivan_number_field( 'budget_wedding', 'Default svadba', $s ); ?>
				<?php ivan_number_field( 'budget_corporate', 'Default korporativna', $s ); ?>
				<?php ivan_number_field( 'budget_club', 'Default klupska', $s ); ?>
				<?php ivan_number_field( 'budget_birthday', 'Default rođendan', $s ); ?>
			</tbody></table>

			<h2><?php esc_html_e( 'Meta Pixel', 'ivan-sedative' ); ?></h2>
			<table class="form-table"><tbody>
				<?php ivan_text_field( 'pixel_id', 'Pixel ID', $s ); ?>
				<?php ivan_checkbox_field( 'pixel_enabled', 'Enable Pixel Lead event', $s ); ?>
			</tbody></table>

			<h2><?php esc_html_e( 'Cookies', 'ivan-sedative' ); ?></h2>
			<table class="form-table"><tbody>
				<?php ivan_checkbox_field( 'cookies_enabled', 'Show cookie banner', $s ); ?>
				<?php ivan_textarea_field( 'cookies_text', 'Cookie text', $s ); ?>
				<?php ivan_text_field( 'cookies_privacy_url', 'Privacy policy URL', $s ); ?>
			</tbody></table>

			<h2><?php esc_html_e( 'Calendar — unavailable dates', 'ivan-sedative' ); ?></h2>
			<p class="description"><?php esc_html_e( 'JSON array. Example: [{"date":"2026-05-03","status":"unavailable","label":"Zauzeto"}]', 'ivan-sedative' ); ?></p>
			<table class="form-table"><tbody>
				<?php ivan_textarea_field( 'calendar_unavailable_json', 'Unavailable dates (JSON)', $s, 12 ); ?>
			</tbody></table>

			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

function ivan_text_field( $key, $label, $s ) {
	printf(
		'<tr><th><label for="%1$s">%2$s</label></th><td><input type="text" id="%1$s" name="%3$s[%1$s]" value="%4$s" class="regular-text" /></td></tr>',
		esc_attr( $key ), esc_html( $label ), esc_attr( IVAN_OPTION_KEY ), esc_attr( $s[ $key ] ?? '' )
	);
}
function ivan_number_field( $key, $label, $s ) {
	printf(
		'<tr><th><label for="%1$s">%2$s</label></th><td><input type="number" id="%1$s" name="%3$s[%1$s]" value="%4$s" class="small-text" /></td></tr>',
		esc_attr( $key ), esc_html( $label ), esc_attr( IVAN_OPTION_KEY ), esc_attr( $s[ $key ] ?? '' )
	);
}
function ivan_checkbox_field( $key, $label, $s ) {
	printf(
		'<tr><th><label for="%1$s">%2$s</label></th><td><input type="checkbox" id="%1$s" name="%3$s[%1$s]" value="1" %4$s /></td></tr>',
		esc_attr( $key ), esc_html( $label ), esc_attr( IVAN_OPTION_KEY ),
		checked( 1, (int) ( $s[ $key ] ?? 0 ), false )
	);
}
function ivan_textarea_field( $key, $label, $s, $rows = 4 ) {
	printf(
		'<tr><th><label for="%1$s">%2$s</label></th><td><textarea id="%1$s" name="%3$s[%1$s]" rows="%5$d" class="large-text code">%4$s</textarea></td></tr>',
		esc_attr( $key ), esc_html( $label ), esc_attr( IVAN_OPTION_KEY ),
		esc_textarea( $s[ $key ] ?? '' ), (int) $rows
	);
}
function ivan_media_field( $key, $label, $s ) {
	$val = $s[ $key ] ?? '';
	?>
	<tr>
		<th><label for="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></label></th>
		<td>
			<input type="text" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( IVAN_OPTION_KEY ); ?>[<?php echo esc_attr( $key ); ?>]" value="<?php echo esc_attr( $val ); ?>" class="regular-text ivan-media-url" />
			<button type="button" class="button ivan-media-pick" data-target="<?php echo esc_attr( $key ); ?>"><?php esc_html_e( 'Choose image', 'ivan-sedative' ); ?></button>
		</td>
	</tr>
	<?php
}
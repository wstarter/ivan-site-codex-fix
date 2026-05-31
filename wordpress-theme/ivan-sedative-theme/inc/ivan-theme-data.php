<?php
/**
 * Build the `window.IvanTheme` payload that is injected before the React bundle.
 * Every key is fallback-safe: missing settings resolve to empty strings/arrays
 * so the React frontend's local defaults remain authoritative.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ivan_theme_data_payload() {
	$s = ivan_get_settings();

	return array(
		'siteUrl'  => home_url( '/' ),
		'themeUrl' => IVAN_THEME_URI,
		'distUrl'  => IVAN_APP_URI,
		'assetsUrl'=> IVAN_APP_URI . 'assets/',
		'restUrl'  => esc_url_raw( rest_url() ),
		'ajaxUrl'  => admin_url( 'admin-ajax.php' ),
		'nonce'    => wp_create_nonce( 'wp_rest' ),

		'primaryMenu' => ivan_menu_tree( 'primary' ),
		'footerMenu'  => ivan_menu_tree( 'footer' ),

		'contact' => array(
			'phone'     => $s['contact_phone'],
			'email'     => $s['contact_email'],
			'instagram' => $s['contact_instagram'],
			'whatsapp'  => $s['contact_whatsapp'],
		),

		'hero' => array(
			'src' => $s['asset_hero_ivan'],
			'alt' => 'Ivan Jovanović',
		),

		'assets' => ivan_collect_assets_bridge( $s ),

		'forms'        => ivan_forms_bridge( $s ),
		'availability' => ivan_availability_bridge( $s ),
		'budget'       => ivan_budget_bridge( $s ),
		'pixel'        => ivan_pixel_bridge( $s ),
		'cookies'      => array(
			'enabled'    => (bool) $s['cookies_enabled'],
			'text'       => $s['cookies_text'],
			'privacyUrl' => $s['cookies_privacy_url'],
		),
		'seo' => array(
			'siteName' => get_bloginfo( 'name' ),
			'tagline'  => get_bloginfo( 'description' ),
			'locale'   => get_locale(),
			'ogImage'  => $s['asset_og_image'],
		),
	);
}

function ivan_collect_assets_bridge( $s ) {
	$map = array(
		'heroIvan'                => 'asset_hero_ivan',
		'formWeddingHero'         => 'asset_form_wedding_hero',
		'formCorporateHero'       => 'asset_form_corporate_hero',
		'formClubHero'            => 'asset_form_club_hero',
		'formBirthdayHero'        => 'asset_form_birthday_hero',
		'uslugeHero'              => 'asset_usluge_hero',
		'workflowHero'            => 'asset_workflow_hero',
		'repertoireHero'          => 'asset_repertoire_hero',
		'additionalProgramsHero'  => 'asset_additional_hero',
		'mediaHero'               => 'asset_media_hero',
		'contactHero'             => 'asset_contact_hero',
		'calendarHero'            => 'asset_calendar_hero',
		'faqHero'                 => 'asset_faq_hero',
		'thankYouHero'            => 'asset_thank_you_hero',
		'ogImage'                 => 'asset_og_image',
	);
	$out = array();
	foreach ( $map as $bridgeKey => $optionKey ) {
		$out[ $bridgeKey ] = array(
			'src' => isset( $s[ $optionKey ] ) ? (string) $s[ $optionKey ] : '',
			'alt' => '',
		);
	}
	return $out;
}

function ivan_budget_bridge( $s ) {
	return array(
		'currency' => '€',
		'min'  => (int) $s['budget_min'],
		'max'  => (int) $s['budget_max'],
		'step' => (int) $s['budget_step'],
		'defaults' => array(
			'wedding'   => (int) $s['budget_wedding'],
			'corporate' => (int) $s['budget_corporate'],
			'club'      => (int) $s['budget_club'],
			'birthday'  => (int) $s['budget_birthday'],
		),
	);
}
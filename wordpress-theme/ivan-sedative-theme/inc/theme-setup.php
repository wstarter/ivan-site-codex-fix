<?php
/**
 * Theme setup — supports, image sizes, helpers shared across modules.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'after_setup_theme', 'ivan_theme_setup' );
function ivan_theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'script', 'style' ) );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'customize-selective-refresh-widgets' );
	load_theme_textdomain( 'ivan-sedative', IVAN_THEME_DIR . 'languages' );
}

/**
 * Return the current SPA route path (e.g. `/upit/svadba`) for debugging / body data attr.
 */
function ivan_current_route_path() {
	$path = isset( $_SERVER['REQUEST_URI'] ) ? wp_parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ) : '/';
	if ( ! is_string( $path ) || $path === '' ) { $path = '/'; }
	return $path;
}

/**
 * Canonical list of SPA routes the theme is aware of. Used by page stubs and rewrites.
 */
function ivan_spa_routes() {
	return array(
		'/'                              => 'Početna',
		'/usluge'                        => 'Usluge',
		'/nacin-rada'                    => 'Način rada',
		'/repertoar'                     => 'Repertoar',
		'/instagram'                     => 'Instagram',
		'/dopunski-programi'             => 'Dopunski programi',
		'/kontakt'                       => 'Kontakt',
		'/dostupni-termini'              => 'Dostupni termini',
		'/faq'                           => 'FAQ',
		'/hvala'                         => 'Hvala',
		'/upit'                          => 'Upit',
		'/upit/svadba'                   => 'Upit za svadbu',
		'/upit/korporativna-proslava'    => 'Upit za korporativnu proslavu',
		'/upit/klupska-svirka'           => 'Upit za klupsku svirku',
		'/upit/rodjendan-jubilej'        => 'Upit za rođendan / jubilej',
	);
}
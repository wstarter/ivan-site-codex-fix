<?php
/**
 * SEO helpers.
 *
 * We do NOT bundle a custom SEO engine. This file only:
 *  - Adds `noindex` for /hvala (thank-you).
 *  - Adds a body class with the current SPA route for plugin/debug targeting.
 *  - Leaves Yoast / Rank Math fully in charge of titles, descriptions, OG, schema.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'wp_head', 'ivan_seo_noindex_thank_you', 1 );
function ivan_seo_noindex_thank_you() {
	$path = ivan_current_route_path();
	if ( rtrim( $path, '/' ) === '/hvala' ) {
		echo "<meta name=\"robots\" content=\"noindex, nofollow\" />\n";
	}
}

add_filter( 'body_class', 'ivan_seo_body_class' );
function ivan_seo_body_class( $classes ) {
	$path = trim( ivan_current_route_path(), '/' );
	if ( $path === '' ) { $path = 'home'; }
	$classes[] = 'ivan-route-' . sanitize_html_class( str_replace( array( '/', '.' ), '-', $path ) );
	return $classes;
}
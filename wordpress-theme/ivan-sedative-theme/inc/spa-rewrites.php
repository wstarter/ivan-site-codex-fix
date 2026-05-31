<?php
/**
 * SPA fallback: serve the React shell for any front-end URL that doesn't map
 * to a real WP page, so /upit/svadba etc. resolve on direct hit / refresh.
 *
 * Exclusions are explicit so we never break admin, REST, login, real files,
 * uploads, or static assets.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'template_redirect', 'ivan_spa_fallback', 1 );
function ivan_spa_fallback() {
	if ( is_admin() ) { return; }

	$uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '/';
	$path = wp_parse_url( $uri, PHP_URL_PATH );
	if ( ! is_string( $path ) || $path === '' ) { return; }

	$excluded_prefixes = array(
		'/wp-admin', '/wp-login.php', '/wp-cron.php', '/wp-json',
		'/wp-content', '/wp-includes', '/xmlrpc.php', '/feed',
	);
	foreach ( $excluded_prefixes as $p ) {
		if ( strpos( $path, $p ) === 0 ) { return; }
	}

	// Real files with extensions (images, fonts, sitemaps, robots, etc.) — leave alone.
	if ( preg_match( '/\.[a-zA-Z0-9]{1,8}$/', $path ) ) { return; }

	// Already resolved to a real page or post.
	if ( ! is_404() ) { return; }

	// Match an SPA route → serve the shell with 200.
	status_header( 200 );
	nocache_headers();
	include IVAN_THEME_DIR . 'index.php';
	exit;
}
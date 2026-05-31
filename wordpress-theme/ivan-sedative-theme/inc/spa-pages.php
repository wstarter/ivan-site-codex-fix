<?php
/**
 * Default page stubs + primary menu.
 *
 * On theme activation (or via Tools → "Ivan: setup pages"), create a WP page
 * for every SPA route so direct URLs resolve, and build a default Primary menu
 * pointing at SPA paths. Existing pages/menus are NEVER force-deleted.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'after_switch_theme', 'ivan_setup_default_pages_and_menu' );

function ivan_setup_default_pages_and_menu() {
	$routes = ivan_spa_routes();
	$parent_ids = array();

	// First pass: create parent / single-segment pages.
	foreach ( $routes as $path => $title ) {
		if ( $path === '/' ) { continue; }
		$segments = array_values( array_filter( explode( '/', trim( $path, '/' ) ) ) );
		if ( count( $segments ) !== 1 ) { continue; }
		$slug = $segments[0];
		$id   = ivan_ensure_page( $slug, $title, 0 );
		if ( $id ) { $parent_ids[ $slug ] = $id; }
	}
	// Second pass: child pages (e.g. upit/svadba).
	foreach ( $routes as $path => $title ) {
		$segments = array_values( array_filter( explode( '/', trim( $path, '/' ) ) ) );
		if ( count( $segments ) < 2 ) { continue; }
		$parent_slug = $segments[0];
		$child_slug  = end( $segments );
		$parent_id   = $parent_ids[ $parent_slug ] ?? 0;
		ivan_ensure_page( $child_slug, $title, $parent_id );
	}

	// Set Home page if a page with slug "pocetna" exists; otherwise leave WP defaults alone.
	$home = get_page_by_path( 'pocetna' );
	if ( $home ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $home->ID );
	}

	ivan_create_default_primary_menu();
}

function ivan_ensure_page( $slug, $title, $parent_id = 0 ) {
	$existing = get_page_by_path( $parent_id ? get_post_field( 'post_name', $parent_id ) . '/' . $slug : $slug );
	if ( $existing ) { return (int) $existing->ID; }
	return wp_insert_post( array(
		'post_title'   => $title,
		'post_name'    => $slug,
		'post_status'  => 'publish',
		'post_type'    => 'page',
		'post_parent'  => $parent_id,
		'post_content' => '<!-- SPA shell. Rendered by React. -->',
	) );
}

function ivan_create_default_primary_menu() {
	$menu_name = 'Ivan Primary';
	$menu      = wp_get_nav_menu_object( $menu_name );
	if ( ! $menu ) {
		$menu_id = wp_create_nav_menu( $menu_name );
		$items = array(
			array( 'Početna',          '/' ),
			array( 'Usluge',           '/usluge' ),
			array( 'Način rada',       '/nacin-rada' ),
			array( 'Repertoar',        '/repertoar' ),
			array( 'Instagram',        '/instagram' ),
			array( 'Dostupni termini', '/dostupni-termini' ),
			array( 'FAQ',              '/faq' ),
			array( 'Kontakt',          '/kontakt' ),
		);
		foreach ( $items as $i ) {
			wp_update_nav_menu_item( $menu_id, 0, array(
				'menu-item-title'  => $i[0],
				'menu-item-url'    => home_url( $i[1] ),
				'menu-item-status' => 'publish',
				'menu-item-type'   => 'custom',
			) );
		}
		$locations = get_theme_mod( 'nav_menu_locations', array() );
		$locations['primary'] = $menu_id;
		set_theme_mod( 'nav_menu_locations', $locations );
	}
}

/** Optional manual trigger: Tools → "Ivan: setup pages". */
add_action( 'admin_menu', function () {
	add_management_page( 'Ivan: setup pages', 'Ivan: setup pages', 'manage_options', 'ivan-setup-pages', function () {
		if ( ! current_user_can( 'manage_options' ) ) { return; }
		if ( isset( $_POST['ivan_run_setup'] ) && check_admin_referer( 'ivan_run_setup' ) ) {
			ivan_setup_default_pages_and_menu();
			echo '<div class="notice notice-success"><p>Done.</p></div>';
		}
		echo '<div class="wrap"><h1>Ivan: setup pages</h1><form method="post">';
		wp_nonce_field( 'ivan_run_setup' );
		echo '<p><button class="button button-primary" name="ivan_run_setup" value="1">Create SPA pages + default menu</button></p>';
		echo '</form></div>';
	} );
} );
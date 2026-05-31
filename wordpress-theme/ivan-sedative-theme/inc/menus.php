<?php
/**
 * WordPress menus → React menu bridge.
 *
 * Exposes the editor-controlled menus to React via window.IvanTheme.primaryMenu
 * and window.IvanTheme.footerMenu. React uses SPA routing for in-app URLs.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'after_setup_theme', 'ivan_register_menus' );
function ivan_register_menus() {
	register_nav_menus( array(
		'primary' => __( 'Glavni meni', 'ivan-sedative' ),
		'footer'  => __( 'Footer meni', 'ivan-sedative' ),
	) );
}

/**
 * Return menu items in a clean, React-friendly tree.
 * Each node: { id, label, url, target, rel, classes, children }.
 */
function ivan_menu_tree( $location ) {
	$locations = get_nav_menu_locations();
	if ( empty( $locations[ $location ] ) ) { return array(); }
	$menu  = wp_get_nav_menu_object( $locations[ $location ] );
	if ( ! $menu ) { return array(); }
	$items = wp_get_nav_menu_items( $menu->term_id );
	if ( empty( $items ) ) { return array(); }

	// Index by id.
	$by_id = array();
	foreach ( $items as $item ) {
		$by_id[ (int) $item->ID ] = array(
			'id'       => (int) $item->ID,
			'parent'   => (int) $item->menu_item_parent,
			'label'    => wp_strip_all_tags( $item->title ),
			'url'      => ivan_normalize_menu_url( $item->url ),
			'target'   => $item->target ?: '_self',
			'rel'      => trim( (string) $item->xfn ),
			'classes'  => array_values( array_filter( (array) $item->classes ) ),
			'children' => array(),
		);
	}

	$tree = array();
	foreach ( $by_id as $id => &$node ) {
		if ( $node['parent'] && isset( $by_id[ $node['parent'] ] ) ) {
			$by_id[ $node['parent'] ]['children'][] = &$node;
		} else {
			$tree[] = &$node;
		}
	}
	unset( $node );

	// Drop nodes without a label or url.
	$tree = array_values( array_filter( $tree, function ( $n ) {
		return $n['label'] !== '' && $n['url'] !== '';
	} ) );

	return $tree;
}

/**
 * Convert absolute site URLs into SPA-relative paths.
 * /upit/svadba/ → /upit/svadba
 */
function ivan_normalize_menu_url( $url ) {
	$url  = (string) $url;
	$home = trailingslashit( home_url( '/' ) );
	if ( strpos( $url, $home ) === 0 ) {
		$url = '/' . ltrim( substr( $url, strlen( $home ) ), '/' );
	}
	if ( strlen( $url ) > 1 ) { $url = rtrim( $url, '/' ); }
	return $url;
}
<?php
/**
 * SPA shell — header.
 *
 * No visual rendering happens in PHP. The React/Vite app mounts into #root.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
	<link rel="profile" href="https://gmpg.org/xfn/11" />
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'ivan-spa-shell' ); ?> data-route="<?php echo esc_attr( ivan_current_route_path() ); ?>">
<?php wp_body_open(); ?>
<div id="root"></div>
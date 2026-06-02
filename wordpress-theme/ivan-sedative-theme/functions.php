<?php
/**
 * Ivan Sedative Band — theme bootstrap.
 *
 * functions.php is intentionally thin. All logic lives in /inc modules so the
 * theme stays modular, auditable, and easy to convert into a child theme later.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'IVAN_THEME_VERSION', '1.0.23' );
define( 'IVAN_THEME_DIR', trailingslashit( get_template_directory() ) );
define( 'IVAN_THEME_URI', trailingslashit( get_template_directory_uri() ) );
define( 'IVAN_APP_DIR', IVAN_THEME_DIR . 'assets/app/' );
define( 'IVAN_APP_URI', IVAN_THEME_URI . 'assets/app/' );

require_once IVAN_THEME_DIR . 'inc/theme-setup.php';
require_once IVAN_THEME_DIR . 'inc/menus.php';
require_once IVAN_THEME_DIR . 'inc/theme-settings.php';
require_once IVAN_THEME_DIR . 'inc/enqueue.php';
require_once IVAN_THEME_DIR . 'inc/cf7-bridge.php';
require_once IVAN_THEME_DIR . 'inc/calendar-bridge.php';
require_once IVAN_THEME_DIR . 'inc/pixel-bridge.php';
require_once IVAN_THEME_DIR . 'inc/ivan-theme-data.php';
require_once IVAN_THEME_DIR . 'inc/spa-pages.php';
require_once IVAN_THEME_DIR . 'inc/spa-rewrites.php';
require_once IVAN_THEME_DIR . 'inc/seo-helpers.php';

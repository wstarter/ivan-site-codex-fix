<?php
/**
 * 404 — return HTTP 200 + SPA shell so React Router can resolve the URL.
 * Real missing assets are still excluded by spa-rewrites.php.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
status_header( 200 );
nocache_headers();
get_header();
get_footer();
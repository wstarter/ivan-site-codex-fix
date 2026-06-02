<?php
/**
 * Vite/React asset loader.
 *
 * - Reads `assets/app/.vite/manifest.json` when available and enqueues the
 *   hashed JS entry as a module, plus all imported CSS files.
 * - Falls back to scanning `assets/app/assets/` for `index-*.js` / `index-*.css`
 *   if the manifest is missing (e.g. a partial build was uploaded).
 * - Injects `window.IvanTheme` BEFORE the app bundle so React can read it on mount.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Read and decode the Vite manifest, or return null.
 */
function ivan_app_manifest() {
	static $cache = null;
	if ( $cache !== null ) { return $cache ?: null; }
	$path = IVAN_APP_DIR . '.vite/manifest.json';
	if ( ! file_exists( $path ) ) {
		$path = IVAN_APP_DIR . 'manifest.json'; // legacy Vite location
	}
	if ( ! file_exists( $path ) ) { $cache = false; return null; }
	$raw  = file_get_contents( $path );
	$json = json_decode( $raw, true );
	$cache = is_array( $json ) ? $json : false;
	return $cache ?: null;
}

/**
 * Resolve the JS + CSS entries for the app.
 * Returns: [ 'js' => string|null, 'css' => string[] ]
 */
function ivan_app_entries() {
	$entries = array( 'js' => null, 'css' => array() );
	$manifest = ivan_app_manifest();

	if ( $manifest ) {
		// Find the entry chunk (isEntry === true).
		$entry_key = null;
		foreach ( $manifest as $k => $chunk ) {
			if ( ! empty( $chunk['isEntry'] ) ) {
				// Prefer an index.html/src entry, but accept any isEntry.
				if ( strpos( $k, 'index' ) !== false || $entry_key === null ) {
					$entry_key = $k;
				}
			}
		}
		if ( $entry_key && isset( $manifest[ $entry_key ] ) ) {
			$entry = $manifest[ $entry_key ];
			if ( ! empty( $entry['file'] ) ) {
				$entries['js'] = IVAN_APP_URI . ltrim( $entry['file'], '/' );
			}
			if ( ! empty( $entry['css'] ) && is_array( $entry['css'] ) ) {
				foreach ( $entry['css'] as $css ) {
					$entries['css'][] = IVAN_APP_URI . ltrim( $css, '/' );
				}
			}
		}
		// Some TanStack Start chunks emit CSS that is NOT linked from the entry
		// in the manifest (e.g. styles-*.css from the framework runtime). Walk
		// the entire manifest and pick up any CSS that the entry depends on,
		// transitively. Also union with a glob over the assets dir so any
		// orphan CSS gets enqueued.
		$seen_css = array_flip( $entries['css'] );
		foreach ( $manifest as $chunk ) {
			if ( ! empty( $chunk['css'] ) && is_array( $chunk['css'] ) ) {
				foreach ( $chunk['css'] as $css ) {
					$url = IVAN_APP_URI . ltrim( $css, '/' );
					if ( ! isset( $seen_css[ $url ] ) ) {
						$entries['css'][] = $url;
						$seen_css[ $url ] = true;
					}
				}
			}
		}
		$assets_dir = IVAN_APP_DIR . 'assets/';
		if ( is_dir( $assets_dir ) ) {
			foreach ( glob( $assets_dir . '*.css' ) ?: array() as $f ) {
				$url = IVAN_APP_URI . 'assets/' . basename( $f );
				if ( ! isset( $seen_css[ $url ] ) ) {
					$entries['css'][] = $url;
					$seen_css[ $url ] = true;
				}
			}
		}
		if ( $entries['js'] ) { return $entries; }
	}

	// Fallback (no manifest): scan assets/app/assets for the entry JS plus any CSS.
	// - JS: prefer the largest index-*.js (Vite emits the SPA entry as the heaviest
	//   chunk; smaller index-*.js files are route chunks).
	// - CSS: enqueue every *.css we find (covers index-*.css and styles-*.css).
	$assets_dir = IVAN_APP_DIR . 'assets/';
	if ( is_dir( $assets_dir ) ) {
		$candidates = glob( $assets_dir . 'index-*.js' ) ?: array();
		if ( $candidates ) {
			usort( $candidates, function ( $a, $b ) {
				return filesize( $b ) <=> filesize( $a );
			} );
			$entries['js'] = IVAN_APP_URI . 'assets/' . basename( $candidates[0] );
		}
		foreach ( glob( $assets_dir . '*.css' ) ?: array() as $f ) {
			$entries['css'][] = IVAN_APP_URI . 'assets/' . basename( $f );
		}
	}
	return $entries;
}

add_action( 'wp_enqueue_scripts', 'ivan_enqueue_app' );
function ivan_enqueue_app() {
	$entries = ivan_app_entries();

	// CSS — enqueue first so it's loaded before JS executes.
	foreach ( $entries['css'] as $i => $href ) {
		wp_enqueue_style( 'ivan-app-' . $i, $href, array(), IVAN_THEME_VERSION );
	}

	if ( ! $entries['js'] ) {
		// Surface a minimal admin notice; do not crash front-end.
		add_action( 'admin_notices', function () {
			echo '<div class="notice notice-error"><p><strong>Ivan Sedative:</strong> React/Vite build not found in <code>assets/app/</code>. Run <code>npm run build</code> and upload the output (including <code>.vite/manifest.json</code>).</p></div>';
		} );
		return;
	}

	// Attach the WordPress -> React bridge directly to the Vite entry handle.
	// WordPress reliably prints inline "before" data for the same handle
	// immediately before its hashed module script.
	$bridge = ivan_theme_data_payload();
	wp_enqueue_script( 'ivan-app', $entries['js'], array(), IVAN_THEME_VERSION, true );
	wp_add_inline_script(
		'ivan-app',
		'window.IvanTheme = ' . wp_json_encode( $bridge ) . ';',
		'before'
	);
}

/**
 * Mark the React entry as type="module" — required for Vite ESM output.
 */
add_filter( 'script_loader_tag', 'ivan_module_script_tag', 10, 3 );
function ivan_module_script_tag( $tag, $handle, $src ) {
	if ( $handle === 'ivan-app' ) {
		$tag = '<script type="module" crossorigin src="' . esc_url( $src ) . '"></script>' . "\n";
	}
	return $tag;
}

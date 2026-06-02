<?php
/**
 * Meta Pixel bridge.
 *
 * - Outputs the base Pixel snippet in <head> when enabled.
 * - Adds a small inline listener that fires `fbq('track','Lead')` only after a
 *   successful inquiry CF7 submission (`wpcf7mailsent`).
 * - NEVER fires Lead on button click, validation error, or unmounted React
 *   prototype submissions.
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ivan_pixel_bridge( $s ) {
	return array(
		'id'             => (string) $s['pixel_id'],
		'leadEnabled'    => (bool) $s['pixel_enabled'],
		'fireOn'         => 'wpcf7mailsent',
		'thankYouPath'   => '/hvala',
	);
}

add_action( 'wp_head', 'ivan_pixel_head', 1 );
function ivan_pixel_head() {
	$s = ivan_get_settings();
	if ( empty( $s['pixel_enabled'] ) || empty( $s['pixel_id'] ) ) { return; }
	$id = preg_replace( '/[^0-9]/', '', (string) $s['pixel_id'] );
	if ( ! $id ) { return; }
	?>
	<!-- Meta Pixel -->
	<script>
	!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
	n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
	document,'script','https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', '<?php echo esc_js( $id ); ?>');
	fbq('track', 'PageView');
	</script>
	<noscript><img height="1" width="1" style="display:none" alt=""
	src="https://www.facebook.com/tr?id=<?php echo esc_attr( $id ); ?>&ev=PageView&noscript=1"/></noscript>
	<!-- End Meta Pixel -->
	<?php
}

add_action( 'wp_footer', 'ivan_pixel_lead_listener', 99 );
function ivan_pixel_lead_listener() {
	$s = ivan_get_settings();
	if ( empty( $s['pixel_enabled'] ) ) { return; }

	// Collect numeric CF7 IDs from the 4 configured inquiry forms. If the
	// setting holds a full shortcode string, extract the id=".." attribute.
	$ids = array();
	foreach ( array( 'cf7_wedding', 'cf7_corporate', 'cf7_club', 'cf7_birthday' ) as $key ) {
		$raw = trim( (string) ( $s[ $key ] ?? '' ) );
		if ( $raw === '' ) { continue; }
		if ( ctype_digit( $raw ) ) { $ids[] = (int) $raw; continue; }
		if ( preg_match( '/id\s*=\s*"?(\d+)"?/', $raw, $m ) ) { $ids[] = (int) $m[1]; }
	}
	$ids_json = wp_json_encode( array_values( array_unique( $ids ) ) );
	?>
	<script>
	(function () {
		// Lead fires ONLY on a successful CF7 mail-sent event, scoped to the
		// 4 configured inquiry forms. Never on click, never on validation error.
		var IVAN_LEAD_IDS = <?php echo $ids_json ? $ids_json : '[]'; ?>;
		document.addEventListener('wpcf7mailsent', function (e) {
			var inquiry = e && e.target && e.target.closest ? e.target.closest('.wpcf7-host') : null;
			if (!inquiry || !inquiry.querySelector('.ivan-cf7')) { return; }
			var allow = true;
			if (IVAN_LEAD_IDS.length > 0) {
				var cfId = e && e.detail && e.detail.contactFormId ? parseInt(e.detail.contactFormId, 10) : 0;
				allow = IVAN_LEAD_IDS.indexOf(cfId) !== -1;
			}
			if (!allow) { return; }
			if (typeof window.fbq === 'function') { try { fbq('track', 'Lead'); } catch (err) {} }
		});
	})();
	</script>
	<?php
}

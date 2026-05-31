<?php
/**
 * Availability calendar bridge.
 *
 * The React calendar is informational only. This bridge exposes the same JSON
 * shape the frontend already expects in src/lib/calendar-config.ts:
 *
 *   window.IvanTheme.availability.unavailableDates = [
 *     { date: "YYYY-MM-DD", status: "unavailable", label: "Zauzeto",
 *       note: "", source: "manual" }
 *   ];
 *
 * @package IvanSedative
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

function ivan_availability_bridge( $s ) {
	$json    = $s['calendar_unavailable_json'] ?? '[]';
	$decoded = json_decode( (string) $json, true );
	if ( ! is_array( $decoded ) ) { $decoded = array(); }

	$out = array();
	foreach ( $decoded as $item ) {
		if ( empty( $item['date'] ) ) { continue; }
		if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', (string) $item['date'] ) ) { continue; }
		$out[] = array(
			'date'   => (string) $item['date'],
			'status' => 'unavailable',
			'label'  => isset( $item['label'] ) ? (string) $item['label'] : 'Zauzeto',
			'note'   => isset( $item['note'] )  ? (string) $item['note']  : '',
			'source' => isset( $item['source'] ) ? (string) $item['source'] : 'manual',
		);
	}

	return array( 'unavailableDates' => $out );
}

/**
 * Optional shortcode that emits a React mount container. Useful if a page is
 * built in Gutenberg and only wants the calendar widget.
 */
add_shortcode( 'ij_availability_calendar', function () {
	return '<div data-ivan-calendar-mount class="ivan-calendar-mount"></div>';
} );
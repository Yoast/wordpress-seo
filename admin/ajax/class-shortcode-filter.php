<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Ajax
 */

/**
 * Class WPSEO_Shortcode_Filter.
 *
 * Used for parsing WP shortcodes with AJAX.
 */
class WPSEO_Shortcode_Filter {

	/**
	 * Initialize the AJAX hooks.
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_filter_shortcodes', [ $this, 'do_filter' ] );
	}

	/**
	 * Parse the shortcodes.
	 */
	public function do_filter() {
		check_ajax_referer( 'wpseo-filter-shortcodes', 'nonce' );

		$shortcodes = filter_input( INPUT_POST, 'data', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		$parsed_shortcodes = [];

		foreach ( $shortcodes as $shortcode ) {
			$parsed_shortcodes[] = [
				'shortcode' => $shortcode,
				'output'    => do_shortcode( $shortcode ),
			];
		}

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: WPSEO_Utils::format_json_encode is considered safe.
		wp_die( WPSEO_Utils::format_json_encode( $parsed_shortcodes ) );
	}
}

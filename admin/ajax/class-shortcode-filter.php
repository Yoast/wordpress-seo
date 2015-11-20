<?php
/**
 * @package WPSEO\Admin|Ajax
 */

/**
 * Class WPSEO_Shortcode_Filter
 *
 * Used for parsing WP shortcodes with AJAX
 */
class WPSEO_Shortcode_Filter {

	/**
	 * Initialize the AJAX hooks
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_filter_shortcodes', array( $this, 'do_filter' ) );
	}

	/**
	 * Parse the shortcodes
	 */
	public function do_filter() {
		check_ajax_referer( 'wpseo-filter-shortcodes', 'nonce' );

		$shortcodes = filter_input( INPUT_POST, 'data', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY );

		$parsed_shortcodes = array();

		foreach ( $shortcodes as $shortcode ) {
			$parsed_shortcodes[] = array(
				'shortcode' => $shortcode,
				'output' => do_shortcode( $shortcode ),
			);
		}

		wp_die( wp_json_encode( $parsed_shortcodes ) );
	}
}

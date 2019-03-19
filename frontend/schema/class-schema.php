<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Class WPSEO_Schema
 *
 * Outputs schema code specific for Google's JSON LD stuff.
 *
 * @since 1.8
 */
class WPSEO_Schema implements WPSEO_WordPress_Integration {
	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_action( 'wpseo_head', array( $this, 'json_ld' ), 90 );
	}

	/**
	 * JSON LD output function that the functions for specific code can hook into.
	 *
	 * @since 1.8
	 */
	public function json_ld() {
		if ( ! is_404() ) {
			do_action( 'wpseo_json_ld' );
		}
	}
}
<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Deprecated
 */

if ( ! function_exists( 'initialize_wpseo_front' ) ) {
	/**
	 * Wraps frontend class.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 */
	function initialize_wpseo_front() {
		_deprecated_function( __FUNCTION__, 'WPSEO 14.0' );
	}
}

if ( ! function_exists( 'wpseo_cli_init' ) ) {
	/**
	 * Initialize the WP-CLI integration.
	 *
	 * @deprecated 19.6.1
	 * @codeCoverageIgnore
	 */
	// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
	function wpseo_cli_init() {
		_deprecated_function( __FUNCTION__, 'WPSEO 19.6.1' );
	}
}

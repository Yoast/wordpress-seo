<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// Mark this file as deprecated.
_deprecated_file( __FILE__, 'WPSEO 13.2' );

/**
 * Handles the request for getting the Ryte status.
 *
 * @deprecated 13.2
 * @codeCoverageIgnore
 */
class WPSEO_OnPage extends WPSEO_Ryte implements WPSEO_WordPress_Integration {

	/**
	 * Constructs the object.
	 *
	 * @deprecated 13.2
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 13.2', WPSEO_Ryte::class );
	}

	/**
	 * Shows a notice when the website is not indexable.
	 *
	 * @return void
	 *
	 * @deprecated 13.2
	 * @codeCoverageIgnore
	 */
	public function show_notice() {
		_deprecated_function( __METHOD__, 'WPSEO 13.2' );
	}
}

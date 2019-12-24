<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// Mark this file as deprecated.
_deprecated_file( __FILE__, 'WPSEO 12.xx' );

/**
 * Handles the request for getting the Ryte status.
 *
 * @deprecated 12.xx
 * @codeCoverageIgnore
 */
class WPSEO_OnPage extends WPSEO_Ryte implements WPSEO_WordPress_Integration {

	/**
	 * Constructs the object.
	 *
	 * @deprecated 12.xx
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 12.xx', WPSEO_Ryte::class );
	}


	/**
	 * Shows a notice when the website is not indexable.
	 *
	 * @return void
	 *
	 * @deprecated 12.xx
	 * @codeCoverageIgnore
	 */
	public function show_notice() {
		_deprecated_function( __METHOD__, 'WPSEO 12.xx' );
	}
}

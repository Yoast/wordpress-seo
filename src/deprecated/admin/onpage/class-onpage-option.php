<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// Mark this file as deprecated.
_deprecated_file( __FILE__, 'WPSEO 13.2' );

/**
 * This class handles the data for the option where the Ryte data is stored.
 *
 * @deprecated 13.2
 * @codeCoverageIgnore
 */
class WPSEO_OnPage_Option extends WPSEO_Ryte_Option {

	/**
	 * Setting the object by setting the properties.
	 *
	 * @deprecated 13.2
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		// phpcs:ignore WordPress.Security.EscapeOutput -- The WPSEO_Ryte_option::class value does not need to be escaped.
		_deprecated_function( __METHOD__, 'WPSEO 13.2', WPSEO_Ryte_Option::class );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// Mark this file as deprecated.
_deprecated_file( __FILE__, 'WPSEO xx.x' );

/**
 * This class will fetch a new status from Ryte and if it's necessary it will
 * notify the site admin by email and remove the current meta value to hide the
 * notice for all admin users.
 *
 * @deprecated xx.x
 * @codeCoverageIgnore
 */
class WPSEO_OnPage_Request extends WPSEO_Ryte_Request {

	/**
	 * Setting the request object.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', WPSEO_Ryte_Option::class );
	}
}

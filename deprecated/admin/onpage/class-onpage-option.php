<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// Mark this file as deprecated.
_deprecated_file( __FILE__, 'WPSEO 12.xx' );

/**
 * This class handles the data for the option where the Ryte data is stored.
 *
 * @deprecated 12.xx
 * @codeCoverageIgnore
 */
class WPSEO_OnPage_Option extends WPSEO_Ryte_Option  {

	/**
	 * Setting the object by setting the properties.
	 *
	 * @deprecated 12.xx
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 12.xx', WPSEO_Ryte_Option::class );
	}

}

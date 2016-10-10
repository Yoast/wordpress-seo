<?php
/**
 * @package    WPSEO
 * @subpackage Internal
 */

/**
 * Class containing method for WPSEO Features.
 */
class WPSEO_Features {

	/**
	 * Checks if the premium constant exists to make sure if plugin is the premium one.
	 *
	 * @return bool
	 */
	public function is_premium() {
		return ( defined( 'WPSEO_Premium_File' ) );
	}
}

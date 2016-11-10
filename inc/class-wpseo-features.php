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
		return ( defined( 'WPSEO_PREMIUM_FILE' ) );
	}

	/**
	 * Checks if using the free version of the plugin.
	 *
	 * @return bool
	 */
	public function is_free() {
		return ! $this->is_premium();
	}
}

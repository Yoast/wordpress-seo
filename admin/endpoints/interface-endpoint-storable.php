<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Endpoints
 */

/**
 * Dictates the required methods for a storable implementation.
 */
interface WPSEO_Endpoint_Storable {

	/**
	 * Determines whether or not data can be stored for the registered endpoints.
	 *
	 * @return bool Whether or not data can be stored.
	 */
	public function can_store_data();
}

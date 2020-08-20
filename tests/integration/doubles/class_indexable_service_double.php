<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Indexable_Service_Double extends WPSEO_Indexable_Service {

	/**
	 * Returns a provider based on the given object type.
	 *
	 * @param string $object_type The object type to get the provider for.
	 *
	 * @return WPSEO_Indexable_Service_Provider Instance of the service provider.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception The invalid argument exception.
	 */
	public function get_provider( $object_type ) {
		return parent::get_provider( $object_type );
	}

	/**
	 * Handles the situation when the object type is unknown.
	 *
	 * @param string $object_type The unknown object type.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function handle_unknown_object_type( $object_type ) {
		return parent::handle_unknown_object_type( $object_type );
	}
}

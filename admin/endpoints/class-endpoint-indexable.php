<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Endpoints
 */

/**
 * Represents an implementation of the WPSEO_Endpoint interface to register one or multiple endpoints.
 */
class WPSEO_Endpoint_Indexable implements WPSEO_Endpoint, WPSEO_Endpoint_Storable {

	/**
	 * @var string
	 */
	const REST_NAMESPACE = 'yoast/v1';

	/**
	 * @var string
	 */
	const ENDPOINT_SINGULAR = 'indexables/(?P<object_type>\w+)/(?P<object_id>\d+)';

	/**
	 * @var string
	 */
	const CAPABILITY_RETRIEVE = 'manage_options';

	/**
	 * @var string
	 */
	const CAPABILITY_STORE = 'manage_options';

	/**
	 * @var WPSEO_Indexable_Service The indexable service.
	 */
	private $service;

	/**
	 * Sets the service provider.
	 *
	 * @param WPSEO_Indexable_Service $service The service provider.
	 */
	public function __construct( WPSEO_Indexable_Service $service ) {
		$this->service = $service;
	}

	/**
	 * Registers the routes for the endpoints.
	 *
	 * @return void
	 */
	public function register() {
		$endpoints = array();

		$endpoints[] = new WPSEO_Endpoint_Factory(
			self::REST_NAMESPACE,
			self::ENDPOINT_SINGULAR,
			array( $this->service, 'get_indexable' ),
			array( $this, 'can_retrieve_data' )
		);

		$endpoints[] = new WPSEO_Endpoint_Factory(
			self::REST_NAMESPACE,
			self::ENDPOINT_SINGULAR,
			array( $this->service, 'patch_indexable' ),
			array( $this, 'can_store_data' ),
			'PATCH'
		);

		foreach ( $endpoints as $endpoint ) {
			$endpoint->register();
		}
	}

	/**
	 * Determines whether or not data can be retrieved for the registered endpoints.
	 *
	 * @return bool Whether or not data can be retrieved.
	 */
	public function can_retrieve_data() {
		return current_user_can( self::CAPABILITY_RETRIEVE );
	}

	/**
	 * Determines whether or not data can be stored for the registered endpoints.
	 *
	 * @return bool Whether or not data can be stored.
	 */
	public function can_store_data() {
		return current_user_can( self::CAPABILITY_STORE );
	}
}

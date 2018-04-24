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

	const REST_NAMESPACE = 'yoast/v1';
	const ENDPOINT_SINGULAR = 'indexables/(?P<object_type>.*)/(?P<object_id>\d+)';

	const CAPABILITY_RETRIEVE = 'manage_options';
	const CAPABILITY_STORE = 'manage_options';

	/** @var WPSEO_Indexable_Service */
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
		// Register fetch config.
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_SINGULAR, array(
			'methods'             => 'GET',
			'callback'            => array(
				$this->service,
				'get_indexable',
			),
			'permission_callback' => array(
				$this,
				'can_retrieve_data',
			),
		) );
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

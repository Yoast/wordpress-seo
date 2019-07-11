<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\OnPage
 */

/**
 * Represents an implementation of the WPSEO_Endpoint interface to register one or multiple endpoints.
 */
class WPSEO_Endpoint_Ryte implements WPSEO_Endpoint {

	/**
	 * The namespace of the REST route.
	 *
	 * @var string
	 */
	const REST_NAMESPACE = 'yoast/v1';

	/**
	 * The route of the ryte endpoint.
	 *
	 * @var string
	 */
	const ENDPOINT_RETRIEVE = 'ryte';

	/**
	 * The name of the capability needed to retrieve data using the endpoints.
	 *
	 * @var string
	 */
	const CAPABILITY_RETRIEVE = 'manage_options';

	/**
	 * Service to use.
	 *
	 * @var WPSEO_Ryte_Service
	 */
	protected $service;

	/**
	 * Constructs the WPSEO_Endpoint_Ryte class and sets the service to use.
	 *
	 * @param WPSEO_Ryte_Service $service Service to use.
	 */
	public function __construct( WPSEO_Ryte_Service $service ) {
		$this->service = $service;
	}

	/**
	 * Registers the REST routes that are available on the endpoint.
	 */
	public function register() {
		// Register fetch config.
		$route_args = array(
			'methods'             => 'GET',
			'callback'            => array( $this->service, 'get_statistics' ),
			'permission_callback' => array( $this, 'can_retrieve_data' ),
		);
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_RETRIEVE, $route_args );
	}

	/**
	 * Determines whether or not data can be retrieved for the registered endpoints.
	 *
	 * @return bool Whether or not data can be retrieved.
	 */
	public function can_retrieve_data() {
		return current_user_can( self::CAPABILITY_RETRIEVE );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Statistics
 */

/**
 * Represents an implementation of the WPSEO_Endpoint interface to register one or multiple endpoints.
 */
class WPSEO_Endpoint_Statistics implements WPSEO_Endpoint {

	/**
	 * @var string
	 */
	const REST_NAMESPACE = 'yoast/v1';

	/**
	 * @var string
	 */
	const ENDPOINT_RETRIEVE = 'statistics';

	/**
	 * @var string
	 */
	const CAPABILITY_RETRIEVE = 'read';

	/**
	 * Service to use.
	 *
	 * @var WPSEO_Statistics_Service
	 */
	protected $service;

	/**
	 * Constructs the WPSEO_Endpoint_Statistics class and sets the service to use.
	 *
	 * @param WPSEO_Statistics_Service $service Service to use.
	 */
	public function __construct( WPSEO_Statistics_Service $service ) {
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

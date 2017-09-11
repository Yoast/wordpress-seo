<?php
/**
 * @package WPSEO\Admin\Statistics
 */

/**
 * Class WPSEO_Statistics_Endpoint
 */
class WPSEO_Statistics_Endpoint {

	const REST_NAMESPACE = 'yoast/v1';
	const ENDPOINT_RETRIEVE = 'statistics';

	const CAPABILITY_RETRIEVE = 'read';

	/** @var WPSEO_Statistics_Service Service to use */
	protected $service;

	/**
	 * WPSEO_Statistics_Endpoint constructor.
	 *
	 * @param WPSEO_Statistics_Service $service Service to use.
	 */
	public function __construct( WPSEO_Statistics_Service $service ) {
		$this->service = $service;
	}

	/**
	 * Register REST routes.
	 */
	public function register() {
		// Register fetch config.
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_RETRIEVE, array(
			'methods'             => 'GET',
			'callback'            => array(
				$this->service,
				'get_statistics',
			),
			'permission_callback' => array(
				$this,
				'can_retrieve_data',
			),
		) );
	}

	/**
	 * Permission callback implementation
	 *
	 * @return bool
	 */
	public function can_retrieve_data() {
		return current_user_can( self::CAPABILITY_RETRIEVE );
	}
}

<?php
/**
 * @package WPSEO\Admin\OnPage
 */

/**
 * Class WPSEO_OnPage_Endpoint
 */
class WPSEO_Ryte_Endpoint {

	const REST_NAMESPACE = 'yoast/v1';
	const ENDPOINT_RETRIEVE = 'ryte';

	const CAPABILITY_RETRIEVE = 'manage_options';

	/** @var WPSEO_Ryte_Service Service to use */
	protected $service;

	/**
	 * WPSEO_OnPage_Endpoint constructor.
	 *
	 * @param WPSEO_Ryte_Service $service Service to use.
	 */
	public function __construct( WPSEO_Ryte_Service $service ) {
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
				'get_onpage',
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

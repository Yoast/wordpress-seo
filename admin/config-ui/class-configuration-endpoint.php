<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Endpoint.
 */
class WPSEO_Configuration_Endpoint {

	/**
	 * @var string
	 */
	const REST_NAMESPACE = 'yoast/v1';

	/**
	 * @var string
	 */
	const ENDPOINT_RETRIEVE = 'configurator';

	/**
	 * @var string
	 */
	const ENDPOINT_STORE = 'configurator';

	/**
	 * @var string
	 */
	const CAPABILITY_RETRIEVE = 'wpseo_manage_options';

	/**
	 * @var string
	 */
	const CAPABILITY_STORE = 'wpseo_manage_options';

	/**
	 * Service to use.
	 *
	 * @var WPSEO_Configuration_Service
	 */
	protected $service;

	/**
	 * Sets the service to use.
	 *
	 * @param WPSEO_Configuration_Service $service Service to use.
	 */
	public function set_service( WPSEO_Configuration_Service $service ) {
		$this->service = $service;
	}

	/**
	 * Register REST routes.
	 */
	public function register() {
		// Register fetch config.
		$route_args = array(
			'methods'             => 'GET',
			'callback'            => array( $this->service, 'get_configuration' ),
			'permission_callback' => array( $this, 'can_retrieve_data' ),
		);
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_RETRIEVE, $route_args );

		// Register save changes.
		$route_args = array(
			'methods'             => 'POST',
			'callback'            => array( $this->service, 'set_configuration' ),
			'permission_callback' => array( $this, 'can_save_data' ),
		);
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_STORE, $route_args );
	}

	/**
	 * Permission callback implementation.
	 *
	 * @return bool
	 */
	public function can_retrieve_data() {
		return current_user_can( self::CAPABILITY_RETRIEVE );
	}

	/**
	 * Permission callback implementation.
	 *
	 * @return bool
	 */
	public function can_save_data() {
		return current_user_can( self::CAPABILITY_STORE );
	}
}

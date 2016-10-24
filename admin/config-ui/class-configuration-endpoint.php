<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Endpoint
 */
class WPSEO_Configuration_Endpoint {

	const REST_NAMESPACE = 'yoast/v1';
	const ENDPOINT_RETRIEVE = 'configurator';
	const ENDPOINT_STORE = 'configurator';

	const CAPABILITY_RETRIEVE = 'manage_options';
	const CAPABILITY_STORE = 'manage_options';

	/** @var WPSEO_Configuration_Service Service to use */
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
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_RETRIEVE, array(
			'methods'             => 'GET',
			'callback'            => array(
				$this->service,
				'get_configuration',
			),
			'permission_callback' => array(
				$this,
				'can_retrieve_data',
			),
		) );

		// Register save changes.
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_STORE, array(
			'methods'             => 'POST',
			'callback'            => array(
				$this->service,
				'set_configuration',
			),
			'permission_callback' => array(
				$this,
				'can_save_data',
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

	/**
	 * Permission callback implementation
	 *
	 * @return bool
	 */
	public function can_save_data() {
		return current_user_can( self::CAPABILITY_STORE );
	}
}

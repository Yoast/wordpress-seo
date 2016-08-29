<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Endpoint
 */
class WPSEO_Configuration_Endpoint {

	const REST_NAMESPACE = 'yoast/v1';
	const ENDPOINT_RETRIEVE = 'get-config';
	const ENDPOINT_STORE = 'set-config';

	/** @var WPSEO_Configuration_Service Service to use */
	protected $service;

	/**
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
			'methods'  => 'GET',
			'callback' => array(
				$this,
				'get_configuration',
			),
			'permission_callback' => array(
				$this,
				'can_retrieve_data',
			),
		) );

		// Register save changes.
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_STORE, array(
			'methods'  => 'POST',
			'callback' => array(
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
	 * @return array
	 */
	public function get_configuration() {
		$configuration             = $this->service->get_configuration();
		$configuration['endpoint'] = $this->get_route( self::ENDPOINT_STORE );
		$configuration['nonce']    = wp_create_nonce( 'wp_rest' );

		return $configuration;
	}

	/**
	 * Get the full route path for an endpoint
	 *
	 * @param string $route Route to retrieve full path of.
	 *
	 * @return string
	 */
	protected function get_route( $route ) {
		return sprintf( '/%s/%s', self::REST_NAMESPACE, $route );
	}

	/**
	 * Permission callback implementation
	 *
	 * @return bool
	 */
	public function can_retrieve_data() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Permission callback implementation
	 *
	 * @return bool
	 */
	public function can_save_data() {
		return current_user_can( 'manage_options' );
	}
}

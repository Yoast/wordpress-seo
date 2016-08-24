<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Endpoint
 */
class WPSEO_Configuration_Endpoint {

	const REST_NAMESPACE = 'yoast/v1';

	/** @var WPSEO_Configuration_Service Service to use */
	private $service;

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
		register_rest_route( self::REST_NAMESPACE, 'get-config', array(
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
		register_rest_route( self::REST_NAMESPACE, 'set-config', array(
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
		$configuration['endpoint'] = $this->get_route( 'set-config' );
		$configuration['nonce']    = wp_create_nonce( 'yoast-config' );

		return $configuration;
	}

	/**
	 * Get the full route path for an endpoint
	 *
	 * @param string $route Route to retrieve full path of.
	 *
	 * @return string
	 */
	private function get_route( $route ) {
		return sprintf( '/%s/%s/', self::REST_NAMESPACE, $route );
	}

	/**
	 * Permission callback implementation
	 *
	 * @return bool
	 */
	public function can_retrieve_data() {
		// Todo: remove 'true' return value when cookie authentication is applied correctly.
		return true;
		return current_user_can( 'manage_options' );
	}

	/**
	 * Permission callback implementation
	 *
	 * @return bool
	 */
	public function can_save_data() {
		// Todo: remove 'true' return value when cookie authentication is applied correctly.
		return true;
		return current_user_can( 'manage_options' );
	}
}

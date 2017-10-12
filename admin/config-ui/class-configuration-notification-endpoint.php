<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Represents the endpoint for handling notification actions like dismissing.
 */
class WPSEO_Configuration_Notification_Endpoint {

	const REST_NAMESPACE = 'yoast/v1';
	const ENDPOINT_DISMISS   = 'dismiss_configurator_notice';
	const CAPABILITY_DISMISS = 'wpseo_manage_options';

	/** @var WPSEO_Configuration_Notification_Service */
	protected $service;

	/**
	 * Constructor setting the service object.
	 *
	 * @param WPSEO_Configuration_Notification_Service $service The service object.
	 */
	public function __construct( WPSEO_Configuration_Notification_Service $service ) {
		$this->service = $service;
	}

	/**
	 * Register REST routes.
	 */
	public function register() {
		// Register fetch config.
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_DISMISS, array(
			'methods'             => 'GET',
			'callback'            => array(
				$this->service,
				'dismiss',
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
		return current_user_can( self::CAPABILITY_DISMISS );
	}
}


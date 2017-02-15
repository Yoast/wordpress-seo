<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Registers the endpoint for the redirects to WordPress.
 */
class WPSEO_Premium_Redirect_EndPoint implements WPSEO_WordPress_Integration {

	const REST_NAMESPACE = 'yoast/v1';
	const ENDPOINT_QUERY = 'redirects';

	const CAPABILITY_RETRIEVE = 'edit_posts';

	/**
	 * @var WPSEO_Premium_Redirect_Service
	 */
	protected $service;

	/**
	 * Sets the service to handle the request.
	 *
	 * @param WPSEO_Premium_Redirect_Service $service The service to handle the requests to the endpoint.
	 */
	public function __construct( WPSEO_Premium_Redirect_Service $service ) {
		$this->service = $service;
	}

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'rest_api_init', array( $this, 'register' ) );
	}

	/**
	 * Register the REST endpoint to WordPress.
	 */
	public function register() {
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_QUERY, array(
			'methods'             => 'POST',
			'args'                => array(
				'origin' => array(
					'required'    => true,
					'type'        => 'string',
					'description' => 'The origin to redirect',
				),
				'target' => array(
					'required'    => false,
					'type'        => 'string',
					'description' => 'The redirect target',
				),
				'type' => array(
					'required'    => true,
					'type'        => 'integer',
					'description' => 'The redirect type',
				),
			),
			'callback'            => array(
				$this->service,
				'save',
			),
			'permission_callback' => array(
				$this,
				'can_retrieve_data',
			),
		) );
	}

	/**
	 * Determines if the current user is allowed to use this endpoint.
	 *
	 * @return bool True user is allowed to use this endpoint.
	 */
	public function can_retrieve_data() {
		return current_user_can( self::CAPABILITY_RETRIEVE );
	}
}

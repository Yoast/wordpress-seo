<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links\Reindex
 */

/**
 * Class WPSEO_Link_Reindex_Post_Endpoint
 */
class WPSEO_Link_Reindex_Post_Endpoint {

	/**
	 * @var string
	 */
	const REST_NAMESPACE = 'yoast/v1';

	/**
	 * @var string
	 */
	const ENDPOINT_QUERY = 'reindex_posts';

	/**
	 * @var string
	 */
	const CAPABILITY_RETRIEVE = 'edit_posts';

	/**
	 * @var WPSEO_Link_Reindex_Post_Service
	 */
	protected $service;

	/**
	 * WPSEO_Link_Reindex_Post_Endpoint constructor.
	 *
	 * @param WPSEO_Link_Reindex_Post_Service $service The service to handle the requests to the endpoint.
	 */
	public function __construct( WPSEO_Link_Reindex_Post_Service $service ) {
		$this->service = $service;
	}

	/**
	 * Register the REST endpoint to WordPress.
	 */
	public function register() {
		$route_args = array(
			'methods'             => 'GET',
			'callback'            => array( $this->service, 'reindex' ),
			'permission_callback' => array( $this, 'can_retrieve_data' ),
		);
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_QUERY, $route_args );
	}

	/**
	 * Determines if the current user is allowed to use this endpoint.
	 *
	 * @return bool
	 */
	public function can_retrieve_data() {
		return current_user_can( self::CAPABILITY_RETRIEVE );
	}
}


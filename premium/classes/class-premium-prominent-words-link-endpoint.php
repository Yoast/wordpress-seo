<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Registers the endpoint for the linking prominent words to a post.
 */
class WPSEO_Premium_Prominent_Words_Link_Endpoint implements WPSEO_WordPress_Integration {

	const REST_NAMESPACE = 'yoast/v1';
	const ENDPOINT_QUERY = 'prominent_words_link';

	const CAPABILITY_RETRIEVE = 'edit_posts';

	/**
	 * @var WPSEO_Premium_Prominent_Words_Link_Service
	 */
	protected $service;

	/**
	 * WPSEO_Premium_Prominent_Words_Endpoint constructor.
	 *
	 * @param WPSEO_Premium_Prominent_Words_Link_Service $service The service to handle the requests to the endpoint.
	 */
	public function __construct( WPSEO_Premium_Prominent_Words_Link_Service $service ) {
		$this->service = $service;
	}

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		add_action( 'rest_api_init', array( $this, 'register' ) );
	}

	/**
	 * Registers the REST endpoint to WordPress.
	 */
	public function register() {
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_QUERY . '/(?P<id>[\d]+)', array(
			'methods'             => 'POST',
			'args'                => array(
				WPSEO_Premium_Prominent_Words_Registration::TERM_NAME => array(
					'required'    => false,
					'type'        => 'array',
					'items'       => array( 'type' => 'integer' ),
					'description' => 'The prominent words to link',
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
	 * @return bool
	 */
	public function can_retrieve_data() {
		return current_user_can( self::CAPABILITY_RETRIEVE );
	}
}

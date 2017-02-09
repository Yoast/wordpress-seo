<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Keeps track of the prominent words version.
 */
class WPSEO_Premium_Prominent_Words_Versioning implements WPSEO_WordPress_Integration {

	const VERSION_NUMBER = 1;

	const POST_META_NAME = 'yst_prominent_words_version';

	const COLLECTION_PARAM = 'yst_prominent_words_is_unindexed';

	/**
	 * {@inheritdoc}
	 */
	public function register_hooks() {
		add_action( 'save_post', array( $this, 'save_version_number' ) );

		if ( ! $this->can_retrieve_data() ) {
			return;
		}

		foreach ( array( 'post', 'page' ) as $post_type ) {
			add_filter( 'rest_' . $post_type . '_query', array( $this, 'rest_add_query_args' ), 10, 2 );
			add_filter( 'rest_' . $post_type . '_collection_params', array( $this, 'rest_register_collection_param' ) );
		}
	}

	/**
	 * Saves the version number as a meta.
	 *
	 * @param int $post_id The post ID to save the version number for.
	 */
	public function save_version_number( $post_id ) {
		add_post_meta( $post_id, self::POST_META_NAME, self::VERSION_NUMBER, true );

		// Prevent infinite loops.
		remove_action( 'save_post', array( $this, 'save_version_number' ), 10 );
	}

	/**
	 * Adds our collection param to the array of params.
	 *
	 * @param array $query_params The previous query params.
	 *
	 * @return array The altered query params.
	 */
	public function rest_register_collection_param( $query_params ) {
		$query_params[ self::COLLECTION_PARAM ] = array(
			'description' => __( 'Limit result set to items that are unindexed.', 'wordpress-seo-premium' ),
			'type'        => 'boolean',
			'default'     => false,
		);

		return $query_params;
	}

	/**
	 * Adds query args to the query to get all rows that needs to be recalculated.
	 *
	 * @param array           $args  The previous arguments.
	 * @param WP_REST_Request $request The current request object.
	 *
	 * @return array $args The altered arguments.
	 */
	public function rest_add_query_args( $args, WP_REST_Request $request ) {
		if ( $request->get_param( self::COLLECTION_PARAM ) === true ) {
			$args['meta_query'] = array(
				'relation' => 'OR',
				array(
					'key'     => WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME,
					'value'   => WPSEO_Premium_Prominent_Words_Versioning::VERSION_NUMBER,
					'compare' => '!=',
				),
				array(
					'key'     => WPSEO_Premium_Prominent_Words_Versioning::POST_META_NAME,
					'compare' => 'NOT EXISTS',
				),
			);
		}

		return $args;
	}

	/**
	 * Determines if the current user is allowed to use this endpoint.
	 *
	 * @return bool
	 */
	public function can_retrieve_data() {
		return current_user_can( WPSEO_Premium_Prominent_Words_Endpoint::CAPABILITY_RETRIEVE );
	}
}

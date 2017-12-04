<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Keeps track of the prominent words version.
 */
class WPSEO_Premium_Prominent_Words_Versioning implements WPSEO_WordPress_Integration {

	const VERSION_NUMBER = 1;

	const POST_META_NAME = '_yst_prominent_words_version';

	const COLLECTION_PARAM = 'yst_prominent_words_is_unindexed';

	/**
	 * {@inheritdoc}
	 */
	public function register_hooks() {
		if ( ! $this->can_retrieve_data() ) {
			return;
		}

		foreach ( $this->get_post_types() as $post_type ) {
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

			$limit = 10;
			if ( ! empty( $args['posts_per_page'] ) ) {
				$limit = $args['posts_per_page'];
			}

			$prominent_words = new WPSEO_Premium_Prominent_Words_Unindexed_Post_Query();
			$post_ids        = $prominent_words->get_unindexed_post_ids( $args['post_type'], $limit );

			// Make sure WP_Query uses our list, especially when it's empty!
			if ( empty( $post_ids ) ) {
				$post_ids = array( 0 );
			}

			$args['post__in'] = $post_ids;
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

	/**
	 * Renames the meta key for the prominent words version. It was a public meta field and it has to be private.
	 */
	public static function upgrade_4_7() {
		global $wpdb;

		// The meta key has to be private, so prefix it.
		$wpdb->query(
			$wpdb->prepare(
				'UPDATE ' . $wpdb->postmeta . ' SET meta_key = %s WHERE meta_key = "yst_prominent_words_version"',
				self::POST_META_NAME
			)
		);
	}

	/**
	 * Removes the meta key for the prominent words version for the unsupported languages that might have this value
	 * set.
	 */
	public static function upgrade_4_8() {
		$language_support = new WPSEO_Premium_Prominent_Words_Language_Support();

		if ( $language_support->is_language_supported( WPSEO_Utils::get_language( get_locale() ) ) ) {
			return;
		}

		global $wpdb;

		// The remove all post metas.
		$wpdb->query(
			$wpdb->prepare(
				'DELETE FROM ' . $wpdb->postmeta . ' WHERE meta_key = %s',
				self::POST_META_NAME
			)
		);
	}

	/**
	 * Returns a list of supported post types.
	 *
	 * @return array The supported post types.
	 */
	private function get_post_types() {
		$prominent_words_support = new WPSEO_Premium_Prominent_Words_Support();

		return $prominent_words_support->get_supported_post_types();
	}
}

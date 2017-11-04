<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents the class for adding the link suggestions metabox for each post type.
 */
class WPSEO_Metabox_Link_Suggestions implements WPSEO_WordPress_Integration {

	/**
	 * Sets the hooks for adding the metaboxes.
	 */
	public function register_hooks() {
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
	}

	/**
	 * Returns the data required for the JS to function.
	 *
	 * @return false|array Either an array of cached suggestions or false.
	 */
	public function get_js_data() {
		// @codingStandardsIgnoreStart
		global $post_ID;

		$post_id = $post_ID;
		// @codingStandardsIgnoreEnd

		$service = new WPSEO_Premium_Link_Suggestions_Service();

		$prominent_words = get_the_terms( $post_id, WPSEO_Premium_Prominent_Words_Registration::TERM_NAME );

		if ( false === $prominent_words ) {
			return false;
		}

		$prominent_words = wp_list_pluck( $prominent_words, 'term_id' );

		$suggestions = get_transient( $service->get_cache_key( $prominent_words ) );
		if ( empty( $suggestions ) ) {
			$suggestions = false;
		}

		return $service->add_is_cornerstone( $suggestions );
	}

	/**
	 * Adds a meta for each public post type.
	 */
	public function add_meta_boxes() {
		$post_types = $this->get_post_types();

		array_map( array( $this, 'add_meta_box' ), $post_types );
	}

	/**
	 * Returns whether the link suggestions are available for the given post type.
	 *
	 * @param string $post_type The post type for which to check if the link suggestions are available.
	 * @return boolean Whether the link suggestions are available for the given post type.
	 */
	public function is_available( $post_type ) {
		// Consider applying a filter here, REST endpoint should be available though!
		$allowed_post_types = array( 'post', 'page' );

		return in_array( $post_type, $allowed_post_types, true );
	}

	/**
	 * Renders the content for the metabox. We leave this empty because we render with React.
	 */
	public function render_metabox_content() {
		echo '';
	}

	/**
	 * Returns all the public post types.
	 *
	 * @return array
	 */
	protected function get_post_types() {
		$post_types = get_post_types( array( 'public' => true ) );

		if ( is_array( $post_types ) && $post_types !== array() ) {
			return $post_types;
		}

		return array();
	}

	/**
	 * Returns whether or not the Link Suggestions are enabled.
	 *
	 * @return bool Whether or not the link suggestions are enabled.
	 */
	public function is_enabled() {
		$options = WPSEO_Options::get_option( 'wpseo' );
		return ( isset( $options['enable_link_suggestions'] ) && $options['enable_link_suggestions'] );
	}

	/**
	 * Returns whether or not we need to index more posts for correct link suggestion functionality
	 *
	 * @return bool Whether or not we need to index more posts.
	 */
	public function is_site_unindexed() {
		$recalculation_notifier = new WPSEO_Premium_Prominent_Words_Recalculation_Notifier();

		return $recalculation_notifier->has_notification();
	}

	/**
	 * Adds a meta box for the given post type.
	 *
	 * @param string $post_type The post type to add a meta box for.
	 */
	protected function add_meta_box( $post_type ) {
		if ( ! $this->is_available( $post_type ) || ! $this->is_enabled() ) {
			return;
		}

		$language_support = new WPSEO_Premium_Prominent_Words_Language_Support();

		if ( ! $language_support->is_language_supported( WPSEO_Utils::get_language( get_locale() ) ) ) {
			return;
		}

		if ( ! WPSEO_Utils::are_content_endpoints_available() ) {
			return;
		}

		add_meta_box(
			'yoast_internal_linking',
			sprintf(
				/* translators: %s expands to Yoast  */
				__( '%s internal linking', 'wordpress-seo-premium' ),
				'Yoast'
			),
			array( $this, 'render_metabox_content' ),
			$post_type,
			'side',
			'low'
		);
	}
}

<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents the class for adding the link suggestions metabox for each post type.
 */
class WPSEO_Metabox_Link_Suggestions {

	/**
	 * Sets the hooks for adding the metaboxes.
	 */
	public function set_hooks() {
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Adds a meta for each public post type.
	 */
	public function add_meta_boxes() {
		$post_types = $this->get_post_types();

		foreach ( $post_types as $post_type ) {
			$this->add_meta_box( $post_type );
		}
	}

	/**
	 * Renders the content for the metabox.
	 *
	 * @param WP_Post $post    The current post.
	 * @param array   $metabox With metabox id, title, callback, and args elements.
	 */
	public function render_metabox_content( WP_Post $post, $metabox ) {
		echo '';
	}

	/**
	 * Sets the link suggestions assets.
	 */
	public function enqueue_scripts() {
		wp_localize_script( WPSEO_Admin_Asset_Manager::PREFIX . 'premium-metabox', 'yoastLinkSuggestions', $this->get_localizations() );
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
	 * Adds a meta box for the given post type.
	 *
	 * @param string $post_type The post type to add a meta box for.
	 */
	protected function add_meta_box( $post_type ) {
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
			'low',
			array( 'post_type' => $post_type )
		);
	}

	/**
	 * Returns the localization string with the suggestions.
	 *
	 * @return array
	 */
	protected function get_localizations() {
		return array(
			'suggestions' => array(
				array( 'value' => 'This is a suggestion example', 'url' => home_url( 'example' ) ),
			),
		);
	}
}

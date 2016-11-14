<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Represents the class for adding the link suggestions metabox for each posttype.
 */
class WPSEO_Metabox_Link_Suggestions {

	/**
	 * Sets the hooks for adding the metaboxes.
	 */
	public function set_hooks() {
		 add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
	}

	/**
	 * Adds a meta for each public posttype.
	 */
	public function add_meta_boxes() {
		$post_types = $this->get_post_types();

		foreach( $post_types as $post_type ) {
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
		_e( 'Consider linking to these articles', 'wordpress-seo-premium' );
	}

	/**
	 * Returns all the public posttypes.
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
	 * @param string $post_type The posttype to add a meta box for.
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
}

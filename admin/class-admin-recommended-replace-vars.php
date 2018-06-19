<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Determines the recommended replacement variables based on the context.
 */
class WPSEO_Admin_Recommended_Replace_Vars {

	/**
	 * @var array The recommended replacement variables.
	 */
	protected $recommended_replace_vars = array(
		// Posts types.
		'page'                    => array( 'sitename', 'title', 'sep', 'primary_category' ),
		'post'                    => array( 'sitename', 'title', 'sep', 'primary_category' ),
		// Homepage.
		'homepage'                => array( 'sitename', 'sitedesc', 'sep' ),
		// Custom post type.
		'custom_post_type'        => array(),

		// Taxonomies.
		'category'                => array( 'sitename', 'title', 'sep' ),
		'post_tag'                => array( 'sitename', 'title', 'sep' ),
		'post_format'             => array( 'sitename', 'title', 'sep', 'page' ),

		// Custom taxonomy.
		'term-in-custom-taxomomy' => array( 'sitename', 'title', 'sep' ),

		// Settings - archive pages.
		'author_archive'          => array( 'sitename', 'title', 'sep', 'page' ),
		'date_archive'            => array( 'sitename', 'sep', 'date', 'page' ),
		'custom-taxonomy_archive' => array( 'sitename', 'title', 'sep' ),

		// Settings - special pages.
		'search'                  => array( 'sitename', 'searchphrase', 'sep', 'page' ),
		'404'                     => array( 'sitename', 'sep' ),
	);

	/**
	 * Determines the page type of the current term.
	 *
	 * @param string $taxonomy The taxonomy name.
	 *
	 * @return string The page type.
	 */
	public function determine_for_term( $taxonomy ) {
		$recommended_replace_vars = $this->get_recommended_replacevars();
		if ( array_key_exists( $taxonomy, $recommended_replace_vars ) ) {
			return $taxonomy;
		}

		return 'term-in-custom-taxomomy';
	}

	/**
	 * Determines the page type of the current post.
	 *
	 * @param WP_Post $post The WordPress global post object.
	 *
	 * @return string The page type.
	 */
	public function determine_for_post( $post ) {
		if ( $post instanceof WP_Post === false ) {
			return 'post';
		}

		if ( $post->post_type === 'page' && $this->is_homepage( $post ) ) {
			return 'homepage';
		}

		$recommended_replace_vars = $this->get_recommended_replacevars();
		if ( array_key_exists( $post->post_type, $recommended_replace_vars ) ) {
			return $post->post_type;
		}

		return 'custom_post_type';
	}

	/**
	 * Retrieves the recommended replacement variables for the given page type.
	 *
	 * @param string $page_type The page type.
	 *
	 * @return array The recommended replacement variables.
	 */
	public function get_recommended_replacevars_for( $page_type ) {
		$recommended_replace_vars = $this->get_recommended_replacevars();
		if ( ! isset( $recommended_replace_vars[ $page_type ] ) ) {
			return array();
		}

		if ( ! is_array( $recommended_replace_vars[ $page_type ] ) ) {
			return array();
		}


		return $recommended_replace_vars[ $page_type ];
	}

	/**
	 * Retrieves the recommended replacement variables.
	 *
	 * @return array The recommended replacement variables.
	 */
	public function get_recommended_replacevars() {
		/**
		 * Filter: Adds the possibility to add extra recommended replacement variables.
		 *
		 * @api array $additional_replace_vars Empty array to add the replacevars to.
		 */
		$recommended_replace_vars = apply_filters( 'wpseo_recommended_replace_vars', $this->recommended_replace_vars );

		if ( ! is_array( $recommended_replace_vars ) ) {
			return $this->recommended_replace_vars;
		}

		return $recommended_replace_vars;
	}

	/**
	 * Determines whether or not a post is the homepage.
	 *
	 * @param WP_Post $post The WordPress global post object.
	 *
	 * @return bool True if the given post is the homepage.
	 */
	private function is_homepage( $post ) {
		if ( $post instanceof WP_Post === false ) {
			return false;
		}

		/*
		 * The page on front returns a string with normal WordPress interaction, while the post ID is an int.
		 * This way we make sure we always compare strings.
		 */
		$post_id       = (int) $post->ID;
		$page_on_front = (int) get_option( 'page_on_front' );

		return get_option( 'show_on_front' ) === 'page' && $page_on_front === $post_id;
	}
}

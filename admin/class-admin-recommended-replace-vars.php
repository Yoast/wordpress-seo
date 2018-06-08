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
	protected static $recommended_replace_vars = array(
		'page'                    => array( 'sitename', 'title', 'primary_category', 'sep' ),
		'post'                    => array( 'sitename', 'title', 'primary_category', 'sep' ),

		'product'                 => array( 'sitename', 'product name', 'primary_category', 'sep' ),

		'category'                => array( 'title', 'sep', 'sitename' ),
		'tag'                     => array( 'title', 'sep', 'sitename' ),
		'post_format'             => array( 'title', 'sep', 'sitename', 'page' ),
		'product_cat'             => array( 'title', 'sep', 'sitename' ),
		'product_tag'             => array( 'title', 'sep', 'sitename' ),

		'term-in-custom-taxomomy' => array( 'title', 'sep', 'sitename' ),
		'custom_post_type'        => array(),

		'search'                  => array( 'searchphrase', 'sep', 'sitename', 'page' ),
		'404'                     => array( 'sep', 'sitename' ),
		'homepage'                => array( 'sitename', 'site description', 'sep' ),

		'author_archive'          => array( 'author name', 'sep', 'sitename', 'page' ),
		'date_archive'            => array( 'date', 'sep', 'sitename', 'page' ),
		'custom-taxonomy_archive' => array( 'taxonomy name', 'sep', 'sitename' ),
		'product_archive'         => array( 'pt_plural', 'sep', 'sitename', 'page' ),

	);

	/**
	 * Determines whether or not a post is the homepage.
	 *
	 * @param WP_Post $post The WordPress global post variable.
	 *
	 * @return bool True if the given post is the homepage.
	 */
	private static function is_homepage( $post ) {
		if ( $post instanceof WP_Post === false ) {
			return false;
		}

		return get_option( 'show_on_front' ) === 'page' && get_option( 'page_on_front' ) === $post->ID;
	}

	/**
	 * Determines the page type of the current term.
	 *
	 * @return string The page type.
	 */
	public static function determine_for_term() {
		$taxonomy = filter_input( INPUT_GET, 'taxonomy' );
		$supported_taxonomies = array( 'category', 'tag', 'post_format', 'product_cat', 'product_tag' );

		if ( in_array( $taxonomy, $supported_taxonomies, true ) ) {
			return $taxonomy;
		}

		return 'term-in-custom-taxomomy';
	}

	/**
	 * Determines the page type of the current post.
	 *
	 * @param WP_Post $post The WordPress global post variable.
	 *
	 * @return string The page type.
	 */
	public static function determine_for_post( $post ) {
		$post_type = filter_input( INPUT_GET, 'post_type' );
		if ( empty( $post_type ) ) {
			return 'post';
		}

		if ( $post_type === 'page' && self::is_homepage( $post ) ) {
			return 'homepage';
		}

		$supported_post_types = array( 'post', 'page', 'product' );
		if ( in_array( $post_type, $supported_post_types, true ) ) {
			return $post_type;
		}

		return 'custom_post_type';
	}

	/**
	 * Get the recommended replacement variables for the given page type.
	 *
	 * @param string $page_type The page type.
	 *
	 * @return array The recommended replacement variables.
	 */
	public static function get_recommended_replacevars( $page_type ) {
		if ( ! isset( self::$recommended_replace_vars[ $page_type ] ) ) {
			return array();
		}

		return self::$recommended_replace_vars[ $page_type ];

	}
}

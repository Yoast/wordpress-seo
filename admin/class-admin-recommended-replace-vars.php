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
		'page'                    => array( 'site name', 'page title', 'primary category', 'separator' ),
		'post'                    => array( 'site name', 'post title', 'primary category', 'separator' ),

		'product'                 => array( 'site name', 'product name', 'primary category', 'separator' ),

		'category'                => array( 'term title', 'separator', 'sitename' ),
		'tag'                     => array( 'term title', 'separator', 'sitename' ),
		'post_format'             => array( 'term_title', 'separator', 'sitename', 'page x/y' ),
		'product_cat'             => array( 'term title', 'separator', 'sitename' ),
		'product_tag'             => array( 'term title', 'separator', 'sitename' ),

		'term-in-custom-taxomomy' => array( 'term title', 'separator', 'sitename' ),
		'custom_post_type'        => array(),

		'search'                  => array( 'searchphrase', 'separator', 'sitename', 'page x/y' ),
		'404'                     => array( 'separator', 'sitename' ),
		'homepage'                => array( 'site name', 'site description', 'separator' ),

		'author_archive'          => array( 'author name', 'separator', 'sitename', 'page x/y' ),
		'date_archive'            => array( 'date', 'separator', 'sitename', 'page x/y' ),
		'custom-taxonomy_archive' => array( 'taxonomy name', 'separator', 'sitename' ),
		'product_archive'         => array( 'pt_plural', 'separator', 'sitename', 'page x/y' ),

	);

	/**
	 * Determines whether or not a post is the homepage.
	 *
	 * @param object $post The WordPress global post variable.
	 *
	 * @return bool True if the given post is the homepage.
	 */
	private static function is_homepage( $post ) {
		if ( get_option( 'show_on_front' ) === 'page' && get_option( 'page_on_front' ) === $post->ID ) {
			return true;
		}

		return false;
	}

	/**
	 * Determines the page type of the current term.
	 *
	 * @return string The page type.
	 */
	public static function determine_term() {
		$taxonomy = filter_input( INPUT_GET, 'taxonomy' );
		$supported_taxonomies = array( 'category', 'tag', 'post_format', 'product_cat', 'product_tag');

		if ( in_array( $taxonomy, $supported_taxonomies ) ) {
			return $taxonomy;
		}

		return 'term-in-custom-taxomomy';
	}

	/**
	 * Determines the page type of the current post.
	 *
	 * @param object $post The WordPress global post variable.
	 *
	 * @return string The page type.
	 */
	public static function determine_post( $post ) {
		$post_type = filter_input( INPUT_GET, 'post_type' );
		if ( empty( $post_type ) ) {
			return 'post';
		}

		if ( $post_type === 'page' && self::is_homepage( $post ) ) {
			return 'homepage';
		}

		$supported_post_types = array( 'post', 'page', 'product' );
		if ( in_array( $post_type, $supported_post_types ) ) {
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
		if( ! isset( self::recommended_replace_vars[ $page_type ] ) ) {
			return array();
		}

		return self::recommended_replace_vars[ $page_type ];

	}
}

global $post;

$current_term = WPSEO_Admin_Recommended_Replace_Vars::determine_term();
$current_post = WPSEO_Admin_Recommended_Replace_Vars::determine_post( $post );

$recommended_replace_vars = WPSEO_Admin_Recommended_Replace_Vars::get_recommended_replacevars( $current_term );

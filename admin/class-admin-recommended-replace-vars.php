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
		// Posts.
		'page'                    => array( 'sitename', 'title', 'sep', 'primary_category' ),
		'post'                    => array( 'sitename', 'title', 'sep', 'primary_category' ),
		// Homepage.
		'homepage'                => array( 'sitename', 'sitedesc', 'sep' ),
		// Specific custom post.
		'product'                 => array( 'sitename', 'title', 'sep', 'primary_category' ),
		// Custom post.
		'custom_post_type'        => array(),

		// Taxonomies.
		'category'                => array( 'sitename', 'title', 'sep' ),
		'post_tag'                => array( 'sitename', 'title', 'sep' ),
		// Specific custom taxonomies.
		'post_format'             => array( 'sitename', 'title', 'sep', 'page' ),
		'product_cat'             => array( 'sitename', 'title', 'sep' ),
		'product_tag'             => array( 'sitename', 'title', 'sep' ),
		'product_shipping_class'  => array( 'sitename', 'title', 'sep', 'page' ),
		'product_brand'           => array( 'sitename', 'title', 'sep' ),
		'pwb-brand'               => array( 'sitename', 'title', 'sep' ),
		// Custom taxonomy.
		'term-in-custom-taxomomy' => array( 'sitename', 'title', 'sep' ),

		// Settings - archive pages.
		'author_archive'          => array( 'sitename', 'title', 'sep', 'page' ),
		'date_archive'            => array( 'sitename', 'sep', 'date', 'page' ),
		'product_archive'         => array( 'sitename', 'sep', 'page', 'pt_plural' ),
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
		$supported_taxonomies = array( 'category', 'tag', 'post_format' );

		// Add WooCommerce specific types.
		if ( $this->is_woocommerce_active() ) {
			$supported_taxonomies[] = 'product_cat';
			$supported_taxonomies[] = 'product_tag';
			$supported_taxonomies[] = 'product_brand';
			$supported_taxonomies[] = 'product_shipping_class';
			// This is the for the plugin: Perfect WooCommerce Brands.
			$supported_taxonomies[] = 'pwb-brand';
		}

		if ( in_array( $taxonomy, $supported_taxonomies, true ) ) {
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

		$supported_page_types = array( 'post', 'page' );

		// Add WooCommerce specific types.
		if ( $this->is_woocommerce_active() ) {
			$supported_page_types[] = 'product';
		}

		if ( in_array( $post->post_type, $supported_page_types, true ) ) {
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
		if ( ! isset( $this->recommended_replace_vars[ $page_type ] ) ) {
			return array();
		}

		return $this->recommended_replace_vars[ $page_type ];
	}

	/**
	 * Retrieves the recommended replacement variables.
	 *
	 * @return array The recommended replacement variables.
	 */
	public function get_recommended_replacevars() {
		return $this->recommended_replace_vars;
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

	/**
	 * Determines whether or not the WooCommerce plugin is active.
	 *
	 * @return bool True if WooCommerce is active.
	 */
	protected function is_woocommerce_active() {
		return class_exists( 'WooCommerce' );
	}
}

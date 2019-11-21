<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * This code handles the category rewrites.
 */
class WPSEO_Rewrite {

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_filter( 'query_vars', [ $this, 'query_vars' ] );
		add_filter( 'category_link', [ $this, 'no_category_base' ] );
		add_filter( 'request', [ $this, 'request' ] );
		add_filter( 'category_rewrite_rules', [ $this, 'category_rewrite_rules' ] );

		add_action( 'created_category', [ $this, 'schedule_flush' ] );
		add_action( 'edited_category', [ $this, 'schedule_flush' ] );
		add_action( 'delete_category', [ $this, 'schedule_flush' ] );

		add_action( 'init', [ $this, 'flush' ], 999 );
	}

	/**
	 * Save an option that triggers a flush on the next init.
	 *
	 * @since 1.2.8
	 */
	public function schedule_flush() {
		update_option( 'wpseo_flush_rewrite', 1 );
	}

	/**
	 * If the flush option is set, flush the rewrite rules.
	 *
	 * @since 1.2.8
	 *
	 * @return bool
	 */
	public function flush() {
		if ( get_option( 'wpseo_flush_rewrite' ) ) {

			add_action( 'shutdown', 'flush_rewrite_rules' );
			delete_option( 'wpseo_flush_rewrite' );

			return true;
		}

		return false;
	}

	/**
	 * Override the category link to remove the category base.
	 *
	 * @param string $link Unused, overridden by the function.
	 *
	 * @return string
	 */
	public function no_category_base( $link ) {
		$category_base = get_option( 'category_base' );

		if ( empty( $category_base ) ) {
			$category_base = 'category';
		}

		/*
		 * Remove initial slash, if there is one (we remove the trailing slash
		 * in the regex replacement and don't want to end up short a slash).
		 */
		if ( '/' === substr( $category_base, 0, 1 ) ) {
			$category_base = substr( $category_base, 1 );
		}

		$category_base .= '/';

		return preg_replace( '`' . preg_quote( $category_base, '`' ) . '`u', '', $link, 1 );
	}

	/**
	 * Update the query vars with the redirect var when stripcategorybase is active.
	 *
	 * @param array $query_vars Main query vars to filter.
	 *
	 * @return array
	 */
	public function query_vars( $query_vars ) {
		if ( WPSEO_Options::get( 'stripcategorybase' ) === true ) {
			$query_vars[] = 'wpseo_category_redirect';
		}

		return $query_vars;
	}

	/**
	 * Checks whether the redirect needs to be created.
	 *
	 * @param array $query_vars Query vars to check for existence of redirect var.
	 *
	 * @return array|void The query vars.
	 */
	public function request( $query_vars ) {
		if ( ! isset( $query_vars['wpseo_category_redirect'] ) ) {
			return $query_vars;
		}

		$this->redirect( $query_vars['wpseo_category_redirect'] );
	}

	/**
	 * This function taken and only slightly adapted from WP No Category Base plugin by Saurabh Gupta.
	 *
	 * @return array
	 */
	public function category_rewrite_rules() {
		global $wp_rewrite;

		$category_rewrite = [];

		$taxonomy            = get_taxonomy( 'category' );
		$permalink_structure = get_option( 'permalink_structure' );

		$blog_prefix = '';
		if ( is_multisite() && ! is_subdomain_install() && is_main_site() && 0 === strpos( $permalink_structure, '/blog/' ) ) {
			$blog_prefix = 'blog/';
		}

		$categories = get_categories( [ 'hide_empty' => false ] );
		if ( is_array( $categories ) && $categories !== [] ) {
			foreach ( $categories as $category ) {
				$category_nicename = $category->slug;
				if ( $category->parent == $category->cat_ID ) {
					// Recursive recursion.
					$category->parent = 0;
				}
				elseif ( $taxonomy->rewrite['hierarchical'] != 0 && $category->parent !== 0 ) {
						$parents = get_category_parents( $category->parent, false, '/', true );
					if ( ! is_wp_error( $parents ) ) {
						$category_nicename = $parents . $category_nicename;
					}
					unset( $parents );
				}

				$category_rewrite = $this->add_category_rewrites( $category_rewrite, $category_nicename, $blog_prefix, $wp_rewrite->pagination_base );

				// Adds rules for the uppercase encoded URIs.
				$category_nicename_filtered = $this->convert_encoded_to_upper( $category_nicename );

				if ( $category_nicename_filtered !== $category_nicename ) {
					$category_rewrite = $this->add_category_rewrites( $category_rewrite, $category_nicename_filtered, $blog_prefix, $wp_rewrite->pagination_base );
				}
			}
			unset( $categories, $category, $category_nicename, $category_nicename_filtered );
		}

		// Redirect support from Old Category Base.
		$old_base                            = $wp_rewrite->get_category_permastruct();
		$old_base                            = str_replace( '%category%', '(.+)', $old_base );
		$old_base                            = trim( $old_base, '/' );
		$category_rewrite[ $old_base . '$' ] = 'index.php?wpseo_category_redirect=$matches[1]';

		return $category_rewrite;
	}

	/**
	 * Adds required category rewrites rules.
	 *
	 * @param array  $rewrites        The current set of rules.
	 * @param string $category_name   Category nicename.
	 * @param string $blog_prefix     Multisite blog prefix.
	 * @param string $pagination_base WP_Query pagination base.
	 *
	 * @return array The added set of rules.
	 */
	protected function add_category_rewrites( $rewrites, $category_name, $blog_prefix, $pagination_base ) {
		$rewrite_name = $blog_prefix . '(' . $category_name . ')';

		$rewrites[ $rewrite_name . '/(?:feed/)?(feed|rdf|rss|rss2|atom)/?$' ]    = 'index.php?category_name=$matches[1]&feed=$matches[2]';
		$rewrites[ $rewrite_name . '/' . $pagination_base . '/?([0-9]{1,})/?$' ] = 'index.php?category_name=$matches[1]&paged=$matches[2]';
		$rewrites[ $rewrite_name . '/?$' ]                                       = 'index.php?category_name=$matches[1]';

		return $rewrites;
	}

	/**
	 * Walks through category nicename and convert encoded parts
	 * into uppercase using $this->encode_to_upper().
	 *
	 * @param string $name The encoded category URI string.
	 *
	 * @return string The convered URI string.
	 */
	protected function convert_encoded_to_upper( $name ) {
		// Checks if name has any encoding in it.
		if ( strpos( $name, '%' ) === false ) {
			return $name;
		}

		$names = explode( '/', $name );
		$names = array_map( [ $this, 'encode_to_upper' ], $names );

		return implode( '/', $names );
	}

	/**
	 * Converts the encoded URI string to uppercase.
	 *
	 * @param string $encoded The encoded string.
	 *
	 * @return string The uppercased string.
	 */
	public function encode_to_upper( $encoded ) {
		if ( strpos( $encoded, '%' ) === false ) {
			return $encoded;
		}

		return strtoupper( $encoded );
	}

	/**
	 * Redirect the "old" category URL to the new one.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $category_redirect The category page to redirect to.
	 * @return void
	 */
	protected function redirect( $category_redirect ) {
		$catlink = trailingslashit( get_option( 'home' ) ) . user_trailingslashit( $category_redirect, 'category' );

		header( 'X-Redirect-By: Yoast SEO' );
		wp_redirect( $catlink, 301, 'Yoast SEO' );
		exit;
	}
} /* End of class */

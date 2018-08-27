<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Rewrite setup and handling for sitemaps functionality.
 */
class WPSEO_Sitemaps_Router {

	/**
	 * Sets up init logic.
	 */
	public function __construct() {

		add_action( 'yoast_add_dynamic_rewrite_rules', array( $this, 'add_rewrite_rules' ) );
		add_filter( 'query_vars', array( $this, 'add_query_vars' ) );
		add_filter( 'redirect_canonical', array( $this, 'redirect_canonical' ) );
		add_action( 'template_redirect', array( $this, 'template_redirect' ), 0 );
	}

	/**
	 * Sets up rewrite rules.
	 *
	 * @deprecated 8.4
	 *
	 * @global WP $wp WordPress core initialization object
	 */
	public function init() {
		global $wp;

		_deprecated_function( __METHOD__, 'WPSEO 8.4', 'This method is deprecated.' );

		$extra_query_vars = $this->add_query_vars( array() );
		foreach ( $extra_query_vars as $extra_query_var ) {
			$wp->add_query_var( $extra_query_var );
		}

		$this->add_rewrite_rules( Yoast_Dynamic_Rewrites::instance() );
	}

	/**
	 * Adds query variables for sitemaps.
	 *
	 * @param array $query_vars List of query variables to filter.
	 *
	 * @return array Filtered query variables.
	 */
	public function add_query_vars( array $query_vars ) {
		$query_vars[] = 'sitemap';
		$query_vars[] = 'sitemap_n';
		$query_vars[] = 'xsl';

		return $query_vars;
	}

	/**
	 * Adds rewrite routes for sitemaps.
	 *
	 * @param Yoast_Dynamic_Rewrites $dynamic_rewrites Dynamic rewrites handler instance.
	 *
	 * @return void
	 */
	public function add_rewrite_rules( Yoast_Dynamic_Rewrites $dynamic_rewrites ) {
		$dynamic_rewrites->add_rule( 'sitemap_index\.xml$', 'index.php?sitemap=1', 'top' );
		$dynamic_rewrites->add_rule( '([^/]+?)-sitemap([0-9]+)?\.xml$', 'index.php?sitemap=$matches[1]&sitemap_n=$matches[2]', 'top' );
		$dynamic_rewrites->add_rule( '([a-z]+)?-?sitemap\.xsl$', 'index.php?xsl=$matches[1]', 'top' );
	}

	/**
	 * Stop trailing slashes on sitemap.xml URLs.
	 *
	 * @param string $redirect The redirect URL currently determined.
	 *
	 * @return bool|string $redirect
	 */
	public function redirect_canonical( $redirect ) {

		if ( get_query_var( 'sitemap' ) || get_query_var( 'xsl' ) ) {
			return false;
		}

		return $redirect;
	}

	/**
	 * Redirects sitemap.xml to sitemap_index.xml.
	 */
	public function template_redirect() {
		if ( ! $this->needs_sitemap_index_redirect() ) {
			return;
		}

		header( 'X-Redirect-By: Yoast SEO' );
		wp_redirect( home_url( '/sitemap_index.xml' ), 301 );
		exit;
	}

	/**
	 * Checks whether the current request needs to be redirected to sitemap_index.xml.
	 *
	 * @global WP_Query $wp_query Current query.
	 *
	 * @return bool True if redirect is needed, false otherwise.
	 */
	public function needs_sitemap_index_redirect() {
		global $wp_query;

		$protocol = 'http://';
		if ( ! empty( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ) {
			$protocol = 'https://';
		}

		$domain = sanitize_text_field( $_SERVER['SERVER_NAME'] );
		$path   = sanitize_text_field( $_SERVER['REQUEST_URI'] );

		// Due to different environment configurations, we need to check both SERVER_NAME and HTTP_HOST.
		$check_urls = array( $protocol . $domain . $path );
		if ( ! empty( $_SERVER['HTTP_HOST'] ) ) {
			$check_urls[] = $protocol . sanitize_text_field( $_SERVER['HTTP_HOST'] ) . $path;
		}

		return $wp_query->is_404 && in_array( home_url( '/sitemap.xml' ), $check_urls, true );
	}

	/**
	 * Create base URL for the sitemap.
	 *
	 * @param string $page Page to append to the base URL.
	 *
	 * @return string base URL (incl page)
	 */
	public static function get_base_url( $page ) {

		global $wp_rewrite;

		$base = $wp_rewrite->using_index_permalinks() ? 'index.php/' : '/';

		/**
		 * Filter the base URL of the sitemaps
		 *
		 * @param string $base The string that should be added to home_url() to make the full base URL.
		 */
		$base = apply_filters( 'wpseo_sitemaps_base_url', $base );

		// Get the scheme from the configured home url instead of letting WordPress determine the scheme based on the requested URI.
		return home_url( $base . $page, wp_parse_url( get_option( 'home' ), PHP_URL_SCHEME ) );
	}
}

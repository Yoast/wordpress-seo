<?php
/**
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

		add_action( 'init', array( $this, 'init' ), 1 );
		add_filter( 'redirect_canonical', array( $this, 'redirect_canonical' ) );
		add_action( 'template_redirect', array( $this, 'template_redirect' ), 0 );
	}

	/**
	 * Sets up rewrite rules.
	 */
	public function init() {

		global $wp;

		$wp->add_query_var( 'sitemap' );
		$wp->add_query_var( 'sitemap_n' );
		$wp->add_query_var( 'xsl' );

		add_rewrite_rule( 'sitemap_index\.xml$', 'index.php?sitemap=1', 'top' );
		add_rewrite_rule( '([^/]+?)-sitemap([0-9]+)?\.xml$', 'index.php?sitemap=$matches[1]&sitemap_n=$matches[2]', 'top' );
		add_rewrite_rule( '([a-z]+)?-?sitemap\.xsl$', 'index.php?xsl=$matches[1]', 'top' );
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

		global $wp_query;

		$current_url = ( filter_input( INPUT_SERVER, 'HTTPS' ) === 'on' ) ? 'https://' : 'http://';
		$current_url .= sanitize_text_field( filter_input( INPUT_SERVER, 'SERVER_NAME' ) );
		$current_url .= sanitize_text_field( filter_input( INPUT_SERVER, 'REQUEST_URI' ) );

		if ( home_url( '/sitemap.xml' ) === $current_url && $wp_query->is_404 ) {
			wp_redirect( home_url( '/sitemap_index.xml' ), 301 );
			exit;
		}
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
		 * Filter: 'wpseo_sitemaps_base_url' - Allow developer to change the base URL of the sitemaps
		 *
		 * @api string $base The string that should be added to home_url() to make the full base URL.
		 */
		$base = apply_filters( 'wpseo_sitemaps_base_url', $base );

		// Get the scheme from the configured home url instead of letting WordPress determine the scheme based on the requested URI.
		return home_url( $base . $page, parse_url( get_option( 'home' ), PHP_URL_SCHEME ) );
	}
}

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
	 * Redirects sitemap.xml to sitemap_index.xml.
	 */
	public function template_redirect() {

		global $wp_query;

		$current_url = ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] == 'on' ) ? 'https://' : 'http://';
		$current_url .= sanitize_text_field( $_SERVER['SERVER_NAME'] ) . sanitize_text_field( $_SERVER['REQUEST_URI'] );

		if ( home_url( '/sitemap.xml' ) === $current_url && $wp_query->is_404 ) {
			wp_redirect( home_url( '/sitemap_index.xml' ), 301 );
			exit;
		}
	}
}

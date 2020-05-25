<?php
/**
 * Registers the yoast head REST field.
 * Not technically a route but behaves the same so is included here.
 *
 * @package Yoast\WP\SEO\Routes\Routes
 */

namespace Yoast\WP\SEO\Routes;

use WP_Query;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\XML_Sitemaps_Request_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;

/**
 * XML_Sitemaps_Route class
 */
class XML_Sitemaps_Route implements Route_Interface {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Yoast_Head_REST_Field constructor.
	 *
	 * @param Post_Type_Helper      $post_type_helper The post type helper.
	 * @param Taxonomy_Helper       $taxonomy_helper  The taxonomy helper.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Taxonomy_Helper $taxonomy_helper
	) {
		$this->post_type_helper = $post_type_helper;
		$this->taxonomy_helper  = $taxonomy_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function register_routes() {
		//		add_action( 'init', [ $this, 'init' ], 1 );
		add_action( 'template_redirect', [ $this, 'template_redirect' ], 0 );
		add_filter( 'redirect_canonical', [ $this, 'redirect_canonical' ] );
	}

	/**
	 * Stop trailing slashes on sitemap.xml URLs.
	 *
	 * @param string $redirect The redirect URL currently determined.
	 *
	 * @return bool|string $redirect
	 */
	public function redirect_canonical( $redirect ) {
		if ( get_query_var( 'sitemap' ) || get_query_var( 'yoast-sitemap-xsl' ) ) {
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

		wp_safe_redirect( home_url( '/sitemap_index.xml' ), 301, 'Yoast SEO' );
		exit;
	}

	/**
	 * Checks whether the current request needs to be redirected to sitemap_index.xml.
	 *
	 * @global WP_Query $wp_query Current query.
	 *
	 * @return bool True if redirect is needed, false otherwise.
	 */
	protected function needs_sitemap_index_redirect() {
		global $wp_query;

		$protocol = 'http://';
		if ( ! empty( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ) {
			$protocol = 'https://';
		}

		$domain = '';
		if ( isset( $_SERVER['SERVER_NAME'] ) ) {
			$domain = sanitize_text_field( wp_unslash( $_SERVER['SERVER_NAME'] ) );
		}

		$path = '';
		if ( isset( $_SERVER['REQUEST_URI'] ) ) {
			$path = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
		}

		// Due to different environment configurations, we need to check both SERVER_NAME and HTTP_HOST.
		$check_urls = [ $protocol . $domain . $path ];
		if ( ! empty( $_SERVER['HTTP_HOST'] ) ) {
			$check_urls[] = $protocol . sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) . $path;
		}

		return $wp_query->is_404 && in_array( home_url( '/sitemap.xml' ), $check_urls, true );
	}
}

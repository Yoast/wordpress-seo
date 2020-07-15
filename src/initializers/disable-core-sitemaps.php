<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\Sitemaps_Enabled_Conditional;

/**
 * Disables the WP core sitemaps.
 */
class Disable_Core_Sitemaps implements Initializer_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Sitemaps_Enabled_Conditional::class ];
	}

	/**
	 * Disable the WP core XML sitemaps.
	 */
	public function initialize() {
		\add_filter( 'wp_sitemaps_enabled', '__return_false' );
		\add_action( 'template_redirect', [ $this, 'template_redirect' ], 0 );
	}

	/**
	 * Redirects requests to the WordPress sitemap to the Yoast sitemap.
	 *
	 * @return void
	 */
	public function template_redirect() {
		// If there is no path, nothing to do.
		if ( ! isset( $_SERVER['REQUEST_URI'] ) ) {
			return;
		}
		$path = \sanitize_text_field( \wp_unslash( $_SERVER['REQUEST_URI'] ) );

		// If it's not a wp-sitemap request, nothing to do.
		if ( \substr( $path, 0, 11 ) !== '/wp-sitemap' ) {
			return;
		}

		$redirect = $this->get_redirect_url( $path );

		if ( ! $redirect ) {
			return;
		}

		\wp_safe_redirect( \home_url( $redirect ), 301, 'Yoast SEO' );
	}

	/**
	 * Returns the relative sitemap URL to redirect to.
	 *
	 * @param string $path The original path.
	 *
	 * @return string|false The path to redirct to. False if no redirect should be done.
	 */
	private function get_redirect_url( $path ) {
		// Start with the simple string comparison so we avoid doing unnecessary regexes.
		if ( $path === '/wp-sitemap.xml' ) {
			return '/sitemap_index.xml';
		}

		if ( \preg_match( '/^\/wp-sitemap-(posts|taxonomies)-(\w+)-(\d+).xml$/', $path, $matches ) ) {
			$index = ( $matches[3] === '1' ) ? '' : \strval( \intval( $matches[3] ) - 1 );
			return '/' . $matches[2] . '-sitemap' . $index . '.xml';
		}

		if ( \preg_match( '/^\/wp-sitemap-users-(\d+).xml/', $path, $matches ) ) {
			$index = ( $matches[1] === '1' ) ? '' : \strval( \intval( $matches[1] ) - 1 );
			return '/author-sitemap' . $index . '.xml';
		}

		return false;
	}
}

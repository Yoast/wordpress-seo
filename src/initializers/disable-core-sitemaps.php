<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Disables the WP core sitemaps.
 */
class Disable_Core_Sitemaps implements Initializer_Interface {

	use No_Conditionals;

	/**
	 * Disable the WP core XML sitemaps.
	 */
	public function initialize() {
		\add_filter( 'wp_sitemaps_enabled', '__return_false' );
		add_action( 'template_redirect', [ $this, 'template_redirect' ], 0 );
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

		\wp_safe_redirect( home_url( $this->get_redirect_url( $path ) ), 301, 'Yoast SEO' );
	}

	/**
	 * Returns the relative sitemap URL to redirect to.
	 *
	 * @param string $path The original path.
	 *
	 * @return string The path to redirct to.
	 */
	private function get_redirect_url( $path ) {
		// Start with the simple string comparison so we avoid doing unnecessary regexes.
		if ( $path === '/wp-sitemap.xml' ) {
			return '/sitemap_index.xml';
		}

		if ( \preg_match( '/^\/wp-sitemap-(posts|taxonomies)-(\w+)-(\d+)?.xml$/', $path, $matches ) ) {
			$index = ( $matches[3] === '1' ) ? '' : \strval( \intval( $matches[3] ) - 1 );
			return '/' . $matches[2] . '-sitemap' . $index . '.xml';
		}

		if ( \preg_match( '/^\/wp-sitemap-users(0\d+)?.xml/', $path, $matches ) ) {
			$index = ( $matches[3] === '1' ) ? '' : \strval( \intval( $matches[1] ) - 1 );
			return '/author-sitemap' . $index . '.xml';
		}

		// Default to the sitemap index if no patters were matches.
		return '/sitemap_index.xml';
	}
}

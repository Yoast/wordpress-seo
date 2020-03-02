<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Integrations
 */

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\WPML_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class WPML
 *
 * @package Yoast\WP\SEO\Integration\Third_Party
 */
class WPML implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_action( 'wpseo_home_url', [ $this, 'filter_home_url_before' ] );
		add_filter( 'home_url', [ $this, 'filter_home_url_after' ], 100 );
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ WPML_Conditional::class ];
	}

	/**
	 * Adds a filter to WPML's wpml_get_home_url filter to ensure we get the unmanipulated home URL.
	 */
	public function filter_home_url_before() {
		add_filter( 'wpml_get_home_url', [ $this, 'wpml_get_home_url' ], 10, 2 );
	}

	/**
	 * Removes the wpml_get_home_url filter to return the WPML, language-enriched home URL.
	 *
	 * @param string $home_url The filtered home URL.
	 *
	 * @return string The unfiltered home URL.
	 */
	public function filter_home_url_after( $home_url ) {
		remove_filter( 'wpml_get_home_url', [ $this, 'wpml_get_home_url' ], 10 );

		return $home_url;
	}

	/**
	 * Returns the original URL instead of the language-enriched URL.
	 * This method gets automatically triggered by the wpml_get_home_url filter.
	 *
	 * @param string $home_url The url altered by WPML. Unused.
	 * @param string $url      The url that isn't altered by WPML.
	 *
	 * @return string The original url.
	 */
	public function wpml_get_home_url( $home_url, $url ) {
		return $url;
	}
}

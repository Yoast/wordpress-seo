<?php namespace Yoast\WP\Free\Integrations\Compatibility;

use WPSEO_Utils;
use Yoast\WP\Free\Conditionals\WPML_Conditional;
use Yoast\WP\Free\Integrations\Integration_Interface;

/**
 * Class WPML
 * @package Yoast\WP\Free\Integration\Compatibility
 */
class WPML implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_action( 'wpseo_home_url', 	[ $this, 'filter_home_url_before' ] );
		add_filter( 'home_url', 		[ $this, 'filter_home_url_after' ], 100 );
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ WPML_Conditional::class ];
	}

	/**
	 * Returns the home url with the following modifications:
	 *
	 * In case of a multisite setup we return the network_home_url.
	 * In case of no multisite setup we return the home_url while overriding the WPML filter.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The home url.
	 */
	public function filter_home_url_before() {
		add_filter( 'wpml_get_home_url', [ $this, 'wpml_get_home_url' ], 10, 2 );
	}

	/**
	 * Removes the wpml_get_home_url filter to return the WPML, language-enrichted home URL.
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
	 * @codeCoverageIgnore
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

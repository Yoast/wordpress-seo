<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

use Yoast\WP\SEO\Main;

/**
 * Retrieves the main instance.
 *
 * @return Main The main instance.
 */
function YoastSEO() { // @codingStandardsIgnoreLine
 	static $main;

	if ( $main === null ) {
		$main = new Main();
		$main->load();
	}

	return $main;
}

class_alias( '\Yoast\WP\SEO\Initializers\Initializer_Interface', '\Yoast\WP\SEO\WordPress\Initializer' );
class_alias( '\Yoast\WP\SEO\Loadable_Interface', '\Yoast\WP\SEO\WordPress\Loadable' );
class_alias( '\Yoast\WP\SEO\Integrations\Integration_Interface', '\Yoast\WP\SEO\WordPress\Integration' );

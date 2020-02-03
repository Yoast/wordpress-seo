<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\SEO\Config;

/**
 * Makes sure the dependencies are loaded and the environment is prepared to use them.
 * This is achieved by setting up class aliases and defines required constants.
 */
class Dependency_Management {

	/**
	 * Checks if the prefixes are available.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True if prefixes are available.
	 */
	public function prefixed_available() {
		static $available = null;

		if ( $available === null ) {
			$available = \is_file( \WPSEO_PATH . \YOAST_VENDOR_PREFIX_DIRECTORY . '/dependencies-prefixed.txt' );
		}

		return $available;
	}
}

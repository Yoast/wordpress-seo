<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

use Yoast\WP\SEO\Integrations\Admin\Ryte_Integration;

/**
 * Test Helper Class.
 */
class WPSEO_Ryte_Double extends Ryte_Integration {

	/**
	 * Overwrite the request_indexibility method, because it uses a dependency.
	 *
	 * @return int
	 */
	protected function request_indexability() {
		if ( home_url() === 'http://example.org' ) {
			return 1;
		}

		return 0;
	}
}

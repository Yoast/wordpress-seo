<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Admin;

use WPSEO_Gutenberg_Compatibility;

/**
 * Class Gutenberg_Compatibility_Double.
 */
class Gutenberg_Compatibility_Double extends WPSEO_Gutenberg_Compatibility {

	/**
	 * Sets the installed version for easier testing.
	 *
	 * @param string|null $version The version to set.
	 *
	 * @return void
	 */
	public function set_installed_gutenberg_version( $version = null ) {
		if ( $version === null ) {
			$version = $this->detect_installed_gutenberg_version();
		}

		$this->current_version = $version;
	}
}

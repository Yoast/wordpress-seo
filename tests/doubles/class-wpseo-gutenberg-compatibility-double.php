<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Class WPSEO_Gutenberg_Compatibility_Double
 */
class WPSEO_Gutenberg_Compatibility_Double extends WPSEO_Gutenberg_Compatibility {

	/**
	 * Sets the installed version for easier testing.
	 *
	 * @param $version The version to set.
	 *
	 * @return void
	 */
	public function set_installed_gutenberg_version( $version  ) {
		$this->current_version = $version;
	}

}

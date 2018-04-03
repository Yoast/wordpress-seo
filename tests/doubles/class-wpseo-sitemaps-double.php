<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Overwrite couple functions of the WPSEO Sitemaps class for testing
 */
class WPSEO_Sitemaps_Double extends WPSEO_Sitemaps {

	/**
	 * Class constructor
	 */
	public function __construct() {
		parent::__construct();

		$this->init_sitemaps_providers();
	}

	/**
	 * Overwrite sitemap_close() so we don't die on outputting the sitemap
	 */
	public function sitemap_close() {
		remove_all_actions( 'wp_footer' );
	}

	/**
	 * Reset
	 */
	public function reset() {
		$this->bad_sitemap = false;
		$this->sitemap     = '';
	}
}

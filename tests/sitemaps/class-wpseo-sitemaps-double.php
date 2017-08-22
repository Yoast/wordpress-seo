<?php
/**
 * @package WPSEO\Unittests
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
	function sitemap_close() {
		remove_all_actions( 'wp_footer' );
	}

	/**
	 * Reset
	 */
	function reset() {
		$this->bad_sitemap = false;
		$this->sitemap = '';
	}
}

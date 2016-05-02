<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Exposes the protected functions of the WPSEO Twitter class for testing
 */
class WPSEO_Sitemaps_Double extends WPSEO_Sitemaps {

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

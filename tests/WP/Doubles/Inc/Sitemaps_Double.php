<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Sitemaps;

/**
 * Overwrite couple functions of the WPSEO Sitemaps class for testing.
 */
final class Sitemaps_Double extends WPSEO_Sitemaps {

	/**
	 * Class constructor.
	 */
	public function __construct() {
		parent::__construct();

		$this->init_sitemaps_providers();
	}

	/**
	 * Overwrite sitemap_close() so we don't die on outputting the sitemap.
	 *
	 * @return void
	 */
	public function sitemap_close() {
		\remove_all_actions( 'wp_footer' );
	}

	/**
	 * Reset.
	 *
	 * @return void
	 */
	public function reset() {
		$this->bad_sitemap = false;
		$this->sitemap     = '';
	}
}

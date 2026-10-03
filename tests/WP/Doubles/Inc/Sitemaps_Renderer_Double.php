<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Sitemaps_Renderer;

/**
 * Test Helper Class.
 */
final class Sitemaps_Renderer_Double extends WPSEO_Sitemaps_Renderer {

	/**
	 * Returns the XSL URL.
	 *
	 * @return string
	 */
	public function get_xsl_url() {
		return parent::get_xsl_url();
	}
}

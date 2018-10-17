<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Sitemaps_Renderer_Double extends WPSEO_Sitemaps_Renderer {

	/**
	 * Returns the XSL URL
	 *
	 * @return string
	 */
	public function get_xsl_url() {
		return parent::get_xsl_url();
	}
}

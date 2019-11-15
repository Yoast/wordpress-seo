<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Sitemap_Image_Parser_Double extends WPSEO_Sitemap_Image_Parser {

	/**
	 * Parse gallery shortcodes in a given content.
	 *
	 * @param string $content Content string.
	 * @param int    $id      Optional. ID of post being parsed.
	 *
	 * @return array Set of attachment objects.
	 */
	public function parse_galleries( $content, $id = 0 ) {
		return parent::parse_galleries( $content, $id );
	}
}

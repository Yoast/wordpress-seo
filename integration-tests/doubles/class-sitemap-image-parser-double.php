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
	 * @inheritdoc
	 */
	public function parse_galleries( $content, $id = 0 ) {
		return parent::parse_galleries( $content, $id );
	}
}

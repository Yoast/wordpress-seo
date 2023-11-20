<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Sitemap_Image_Parser;

/**
 * Test Helper Class.
 */
class Sitemap_Image_Parser_Double extends WPSEO_Sitemap_Image_Parser {

	/**
	 * Parse gallery shortcodes in a given content.
	 *
	 * @param string $content Content string.
	 * @param int    $post_id Optional. ID of post being parsed.
	 *
	 * @return array Set of attachment objects.
	 */
	public function parse_galleries( $content, $post_id = 0 ) {
		return parent::parse_galleries( $content, $post_id );
	}
}

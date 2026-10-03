<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Content_Images;

/**
 * Test Helper Class.
 */
final class Content_Images_Double extends WPSEO_Content_Images {

	/**
	 * Grabs the images from the content.
	 *
	 * @param string $content The post content string.
	 *
	 * @return array An array of image URLs.
	 */
	public function get_images_from_content( $content ) {
		return parent::get_images_from_content( $content );
	}
}

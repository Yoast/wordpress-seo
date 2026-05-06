<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Inc;

use WPSEO_Image_Utils;

/**
 * Test Helper Class.
 */
final class Image_Utils_Double extends WPSEO_Image_Utils {

	/**
	 * Retrieves the first possible image url from an array of images.
	 *
	 * @param array $images The array to extract image url from.
	 *
	 * @return string|null The extracted image url when found, null when not found.
	 */
	public static function get_first_image( $images ) {
		return parent::get_first_image( $images );
	}

	/**
	 * Exposes the protected get_full_size_image_data so its memoisation
	 * behaviour can be exercised from a unit test.
	 *
	 * @param int $attachment_id Attachment ID.
	 *
	 * @return array|false Array when there is a full size image, false if not.
	 */
	public static function call_get_full_size_image_data( $attachment_id ) {
		return parent::get_full_size_image_data( $attachment_id );
	}
}

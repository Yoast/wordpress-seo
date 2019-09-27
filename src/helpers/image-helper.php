<?php
/**
 * A helper object for images.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use WPSEO_Image_Utils;

/**
 * Class Image_Helper
 */
class Image_Helper {

	/**
	 * Gets the post's first usable content image. Null if none is available.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return string|null The image URL.
	 */
	public function get_first_usable_content_image_for_post( $post_id = null ) {
		return WPSEO_Image_Utils::get_first_usable_content_image_for_post( $post_id );
	}
}

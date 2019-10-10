<?php
/**
 * A helper object for Twitter images.
 *
 * @package \Yoast\WP\Free\Helpers\Twitter
 */

namespace Yoast\WP\Free\Helpers\Twitter;

/**
 * Class Image_Helper
 */
class Image_Helper {

	/**
	 * The image size to use for Twitter.
	 *
	 * @return string Image size string.
	 */
	public function get_image_size() {
		/**
		 * Filter: 'wpseo_twitter_image_size' - Allow changing the Twitter Card image size.
		 *
		 * @api string $featured_img Image size string.
		 */
		return (string) \apply_filters( 'wpseo_twitter_image_size', 'full' );
	}
}

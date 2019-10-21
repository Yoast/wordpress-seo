<?php
/**
 * A helper object for Twitter images.
 *
 * @package \Yoast\WP\Free\Helpers\Twitter
 */

namespace Yoast\WP\Free\Helpers\Twitter;

use Yoast\WP\Free\Helpers\Image_Helper as Base_Image_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;

/**
 * Class Image_Helper
 */
class Image_Helper {

	/**
	 * @var Base_Image_Helper
	 */
	private $image;

	/**
	 * Image_Helper constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Base_Image_Helper $image_helper The image helper.
	 */
	public function __construct( Base_Image_Helper $image_helper ) {
		$this->image = $image_helper;
	}

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

	/**
	 * Retrieves an image url by its id.
	 *
	 * @param int $image_id The image id.
	 *
	 * @return string The image url.
	 */
	public function get_by_id( $image_id ) {
		return $this->image->get_attachment_image_source( $image_id, $this->get_image_size() );
	}
}

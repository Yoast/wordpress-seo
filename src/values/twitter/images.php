<?php
/**
 * Value object for the Twitter Images.
 *
 * @package Yoast\WP\Free\Values
 */

namespace Yoast\WP\Free\Values\Twitter;

use Yoast\WP\Free\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\Free\Values\Images as Base_Images;

/**
 * Class Images
 */
class Images extends Base_Images {

	/**
	 * @var Twitter_Image_Helper
	 */
	protected $twitter_image;

	/**
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore - Is handled by DI-container.
	 *
	 * @required
	 *
	 * @param Twitter_Image_Helper $twitter_image Image helper for OpenGraph.
	 */
	public function set_helpers( Twitter_Image_Helper $twitter_image ) {
		$this->twitter_image = $twitter_image;
	}

	/**
	 * Adds an image to the list by image ID.
	 *
	 * @param int $image_id The image ID to add.
	 *
	 * @return void
	 */
	public function add_image_by_id( $image_id ) {
		$image = $this->image->get_attachment_image_src( $image_id, $this->twitter_image->get_image_size() );
		if ( $image ) {
			$this->add_image( $image );
		}
	}
}


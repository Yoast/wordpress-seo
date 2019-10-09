<?php
/**
 * Value object for the Images.
 *
 * @package Yoast\WP\Free\Values
 */

namespace Yoast\WP\Free\Values;

use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;

/**
 * Class Images
 *
 * @package Yoast\WP\Free\Values
 */
class Images {

	/**
	 * Holds the images that have been put out as OG image.
	 *
	 * @var array
	 */
	protected $images = [];

	/**
	 * @var Image_Helper
	 */
	protected $image;

	/**
	 * @var Url_Helper
	 */
	private $url;

	/**
	 * Images constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Image_Helper $image The image helper.
	 * @param Url_Helper   $url   The url helper.
	 */
	public function __construct( Image_Helper $image, Url_Helper $url ) {
		$this->image = $image;
		$this->url   = $url;
	}

	/**
	 * Return the images array.
	 *
	 * @return array The images.
	 */
	public function get_images() {
		return $this->images;
	}

	/**
	 * Check whether we have images or not.
	 *
	 * @return bool True if we have images, false if we don't.
	 */
	public function has_images() {
		return ! empty( $this->images );
	}

	/**
	 * Adds an image based on a given URL, and attempts to be smart about it.
	 *
	 * @param string $url The given URL.
	 *
	 * @return null|number Returns the found attachment ID if it exists. Otherwise -1.
	 *                     If the URL is empty we return null.
	 */
	public function add_image_by_url( $url ) {
		if ( empty( $url ) ) {
			return null;
		}

		$attachment_id = $this->image->get_attachment_by_url( $url );

		if ( $attachment_id ) {
			$this->add_image_by_id( $attachment_id );

			return $attachment_id;
		}

		$this->add_image( $url );

		return -1;
	}

	/**
	 * Adds an images to the local storage.
	 *
	 * @param string|array $image Image array.
	 *
	 * @return void
	 */
	public function add_image( $image ) {
		if ( is_string( $image ) ) {
			$image = [ 'url' => $image ];
		}

		if ( ! is_array( $image ) || empty( $image['url'] ) ) {
			return;
		}

		if ( $this->url->is_relative( $image['url'] ) ) {
			$image['url'] = $this->url->get_relative_path( $image['url'] );
		}

		if ( array_key_exists( $image['url'], $this->images ) ) {
			return;
		}

		$this->images[ $image['url'] ] = $image;
	}
}

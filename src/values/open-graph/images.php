<?php
/**
 * Value object for the OpenGraph Images.
 *
 * @package Yoast\WP\Free\Values
 */

namespace Yoast\WP\Free\Values\Open_Graph;

use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;

/**
 * Class WPSEO_OpenGraph_Image.
 */
class Images {

	/**
	 * Holds the images that have been put out as OG image.
	 *
	 * @var array
	 */
	protected $images = [];

	/**
	 * @var Open_Graph_Image_Helper
	 */
	protected $open_graph_image_helper;

	/**
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * Images constructor.
	 *
	 * @param Open_Graph_Image_Helper $open_graph_image_helper Image helper for OpenGraph.
	 * @param Image_Helper            $image_helper            The image helper.
	 */
	public function __construct(
		Open_Graph_Image_Helper $open_graph_image_helper,
		Image_Helper $image_helper
	) {
		$this->open_graph_image_helper = $open_graph_image_helper;
		$this->image_helper            = $image_helper;
	}

	/**
	 * Outputs the images.
	 *
	 * @return void
	 */
	public function show() {

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
	 * Display an OpenGraph image tag.
	 *
	 * @param string|array $attachment Attachment array.
	 *
	 * @return void
	 */
	public function add_image( $attachment ) {
		// In the past `add_image` accepted an image url, so leave this for backwards compatibility.
		if ( is_string( $attachment ) ) {
			$attachment = array( 'url' => $attachment );
		}

		if ( ! is_array( $attachment ) || empty( $attachment['url'] ) ) {
			return;
		}

		if ( array_key_exists( $attachment['url'], $this->images ) ) {
			return;
		}

		$this->images[ $attachment['url'] ] = $attachment;
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

		$attachment_id = $this->image_helper->get_attachment_by_url( $url );

		if ( $attachment_id ) {
			$this->add_image_by_id( $attachment_id );

			return $attachment_id;
		}

		$this->add_image( $url );

		return -1;
	}

	/**
	 * Adds an image to the list by attachment ID.
	 *
	 * @param int $attachment_id The attachment ID to add.
	 *
	 * @return void
	 */
	public function add_image_by_id( $attachment_id ) {
		$attachment = $this->open_graph_image_helper->get_image_url_by_id( $attachment_id );

		if ( $attachment ) {
			$this->add_image( $attachment );
		}
	}
}

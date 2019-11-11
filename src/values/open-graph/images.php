<?php
/**
 * Value object for the OpenGraph Images.
 *
 * @package Yoast\WP\Free\Values
 */

namespace Yoast\WP\Free\Values\Open_Graph;

use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\Free\Values\Images as Base_Images;

/**
 * Class WPSEO_OpenGraph_Image.
 */
class Images extends Base_Images {

	/**
	 * @var Open_Graph_Image_Helper
	 */
	protected $open_graph_image;

	/**
	 * @required
	 *
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore - Is handled by DI-container.
	 *
	 * @param Open_Graph_Image_Helper $open_graph_image Image helper for OpenGraph.
	 */
	public function set_helpers( Open_Graph_Image_Helper $open_graph_image ) {
		$this->open_graph_image = $open_graph_image;
	}

	/**
	 * Outputs the images.
	 *
	 * @codeCoverageIgnore - The method is empty, nothing to test.
	 *
	 * @return void
	 */
	public function show() {

	}

	/**
	 * Adds an image to the list by image ID.
	 *
	 * @param int $image_id The image ID to add.
	 *
	 * @return void
	 */
	public function add_image_by_id( $image_id ) {
		$attachment = $this->open_graph_image->get_image_url_by_id( $image_id );

		if ( $attachment ) {
			$this->add_image( $attachment );
		}
	}
}

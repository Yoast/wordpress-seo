<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Open_Graph_Conditional;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Open_Graph_OEmbed.
 */
class Open_Graph_OEmbed implements Integration_Interface {

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, Open_Graph_Conditional::class ];
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_filter( 'oembed_response_data', [ $this, 'set_oembed_data' ], 10, 2 );
	}

	/**
	 * Open_Graph_OEmbed constructor.
	 *
	 * @codeCoverageIgnore It only sets dependencies
	 *
	 * @param Image_Helper $image The image helper.
	 */
	public function __construct( Image_Helper $image ) {
		$this->image = $image;
	}

	/**
	 * Callback function to pass to the oEmbed's response data that will enable
	 * support for using the image and title set by the WordPress SEO plugin's fields. This
	 * address the concern where some social channels/subscribed use oEmebed data over Open Graph data
	 * if both are present.
	 *
	 * @param array    $data The oEmbed data.
	 * @param \WP_Post $post The current Post object.
	 *
	 * @return array $filter_data - An array of oEmbed data with modified values where appropriate.
	 * @link https://developer.wordpress.org/reference/hooks/oembed_response_data/ for hook info.
	 *
	 */
	public function set_oembed_data( $data, $post ) {
		// Data to be returned.
		$filter_data = $data;

		$filter_data = $this->set_title_description( $filter_data, $post->ID );
		$filter_data = $this->set_image( $filter_data, $post->ID );

		return $filter_data;
	}

	/**
	 * Sets the OpenGraph title and description if they have been configured.
	 *
	 * @param array $data    The data.
	 * @param int   $post_id The post id.
	 *
	 * @return array The modified data array.
	 */
	protected function set_title_description( array $data, $post_id ) {
		$opengraph_title       = YoastSEO()->meta->for_post( $post_id )->open_graph_title;
		$opengraph_description = YoastSEO()->meta->for_post( $post_id )->open_graph_description;

		if ( ! empty( $opengraph_title ) ) {
			$data['title'] = $opengraph_title;
		}

		if ( ! empty( $opengraph_description ) ) {
			$data['description'] = $opengraph_description;
		}

		return $data;
	}

	/**
	 * Sets the image if it has been configured.
	 *
	 * @param array $data    The data.
	 * @param int   $post_id The post id.
	 *
	 * @return array The modified data array.
	 */
	protected function set_image( array $data, $post_id ) {
		$image = $this->get_image( $post_id );

		if ( empty( $image ) ) {
			return $data;
		}

		// Update the oEmbed data.
		$data['thumbnail_url'] = $image['url'];

		if ( empty( $image['id'] ) ) {
			return $data;
		}

		$data = $this->set_image_meta_data( $data, $image['id'] );

		return $data;
	}

	/**
	 * Determines which image details we should use.
	 *
	 * @param int $post_id The post id.
	 *
	 * @return array The image details to use.
	 */
	protected function get_image( $post_id ) {
		$images   = YoastSEO()->meta->for_post( $post_id )->open_graph_images;
		$image_id = $images[ array_key_first( $images ) ]['id'];
		if ( ! empty( $image_id ) ) {
			return [
				'id'  => $image_id,
				'url' => $this->image->get_attachment_image_source( $image_id ),
			];
		}

		return [];
	}

	/**
	 * Retrieves the height and width for the given image.
	 *
	 * @param array $data     The data.
	 * @param int   $image_id The image id.
	 *
	 * @return array The modified data array.
	 */
	protected function set_image_meta_data( array $data, $image_id ) {
		// Gets the image's info from it's ID.
		$image_info = \wp_get_attachment_metadata( $image_id );

		if ( ! empty( $image_info['height'] ) ) {
			$data['thumbnail_height'] = $image_info['height'];
		}

		if ( ! empty( $image_info['width'] ) ) {
			$data['thumbnail_width'] = $image_info['width'];
		}

		return $data;
	}
}

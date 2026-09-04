<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use WP_Post;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Open_Graph_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * Class Open_Graph_OEmbed.
 */
class Open_Graph_OEmbed implements Integration_Interface {

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, Open_Graph_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'oembed_response_data', [ $this, 'set_oembed_data' ], 10, 2 );
	}

	/**
	 * Open_Graph_OEmbed constructor.
	 *
	 * @param Meta_Surface $meta The meta surface.
	 */
	public function __construct( Meta_Surface $meta ) {
		$this->meta = $meta;
	}

	/**
	 * Callback function to pass to the oEmbed's response data that will enable
	 * support for using the image and title set by the WordPress SEO plugin's fields. This
	 * address the concern where some social channels/subscribed use oEmebed data over Open Graph data
	 * if both are present.
	 *
	 * @link https://developer.wordpress.org/reference/hooks/oembed_response_data/ for hook info.
	 *
	 * @param array   $data The oEmbed data.
	 * @param WP_Post $post The current Post object.
	 *
	 * @return array An array of oEmbed data with modified values where appropriate.
	 */
	public function set_oembed_data( $data, $post ) {
		$post_meta = $this->meta->for_post( $post->ID );

		if ( ! empty( $post_meta ) ) {
			$data = $this->set_title( $data, $post_meta );
			$data = $this->set_description( $data, $post_meta );
			$data = $this->set_image( $data, $post_meta );
		}

		return $data;
	}

	/**
	 * Sets the OpenGraph title if configured.
	 *
	 * @param array $data      The oEmbed data.
	 * @param Meta  $post_meta The post meta to read the title from.
	 *
	 * @return array The oEmbed data with the title set where appropriate.
	 */
	protected function set_title( $data, $post_meta ) {
		$opengraph_title = $post_meta->open_graph_title;

		if ( ! empty( $opengraph_title ) ) {
			$data['title'] = $opengraph_title;
		}

		return $data;
	}

	/**
	 * Sets the OpenGraph description if configured.
	 *
	 * @param array $data      The oEmbed data.
	 * @param Meta  $post_meta The post meta to read the description from.
	 *
	 * @return array The oEmbed data with the description set where appropriate.
	 */
	protected function set_description( $data, $post_meta ) {
		$opengraph_description = $post_meta->open_graph_description;

		if ( ! empty( $opengraph_description ) ) {
			$data['description'] = $opengraph_description;
		}

		return $data;
	}

	/**
	 * Sets the image if it has been configured.
	 *
	 * @param array $data      The oEmbed data.
	 * @param Meta  $post_meta The post meta to read the image from.
	 *
	 * @return array The oEmbed data with the image set where appropriate.
	 */
	protected function set_image( $data, $post_meta ) {
		$images = $post_meta->open_graph_images;

		if ( ! \is_array( $images ) ) {
			return $data;
		}

		$image = \reset( $images );

		if ( empty( $image ) || ! isset( $image['url'] ) ) {
			return $data;
		}

		$data['thumbnail_url'] = $image['url'];

		if ( isset( $image['width'] ) ) {
			$data['thumbnail_width'] = $image['width'];
		}

		if ( isset( $image['height'] ) ) {
			$data['thumbnail_height'] = $image['height'];
		}

		return $data;
	}
}

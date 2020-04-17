<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Integrations\Front_End;

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
	 * The oEmbed data.
	 *
	 * @var array
	 */
	private $data;

	/**
	 * The post ID for the current post.
	 *
	 * @var int
	 */
	private $post_id;

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
	 * @param Meta_Surface $meta  The meta surface.
	 */
	public function __construct( Meta_Surface $meta ) {
		$this->meta  = $meta;
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
	 */
	public function set_oembed_data( $data, $post ) {
		// Data to be returned.
		$this->data    = $data;
		$this->post_id = $post->ID;

		$this->set_title();
		$this->set_description();
		$this->set_image();

		return $this->data;
	}

	/**
	 * Sets the OpenGraph title if configured.
	 */
	protected function set_title() {
		$opengraph_title = $this->meta->for_post( $this->post_id )->open_graph_title;

		if ( ! empty( $opengraph_title ) ) {
			$this->data['title'] = $opengraph_title;
		}
	}

	/**
	 * Sets the OpenGraph description if configured.
	 */
	protected function set_description() {
		$opengraph_description = $this->meta->for_post( $this->post_id )->open_graph_description;

		if ( ! empty( $opengraph_description ) ) {
			$this->data['description'] = $opengraph_description;
		}
	}

	/**
	 * Sets the image if it has been configured.
	 */
	protected function set_image() {
		$images = $this->meta->for_post( $this->post_id )->open_graph_images;
		$image  = reset( $images );

		if ( empty( $image ) ) {
			return;
		}

		if ( ! isset( $image['url'] ) ) {
			return;
		}

		$this->data['thumbnail_url'] = $image['url'];

		if ( isset( $image['width'] ) ) {
			$this->data['thumbnail_width'] = $image['width'];
		}

		if ( isset( $image['height'] ) ) {
			$this->data['thumbnail_height'] = $image['height'];
		}
	}
}

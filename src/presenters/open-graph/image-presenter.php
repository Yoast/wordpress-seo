<?php
/**
 * Presenter class for the OpenGraph image.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;
use Yoast\WP\Free\Values\Open_Graph\Images;

/**
 * Class Image_Presenter
 */
class Image_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * @var Open_Graph_Image_Helper
	 */
	protected $open_graph_image_helper;

	/**
	 * Image tags that we output for each image.
	 *
	 * @var array
	 */
	protected static $image_tags = [
		'width'     => 'width',
		'height'    => 'height',
		'mime-type' => 'type',
	];

	/**
	 * Image_Presenter constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Open_Graph_Image_Helper $open_graph_image_helper The image helper.
	 */
	public function __construct( Open_Graph_Image_Helper $open_graph_image_helper ) {
		$this->open_graph_image_helper = $open_graph_image_helper;
	}

	/**
	 * Returns the image for a post.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The image tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$open_graph_images = new Images( $this->open_graph_image_helper );

		/**
		 * Filter: wpseo_add_opengraph_images - Allow developers to add images to the OpenGraph tags.
		 *
		 * @api WPSEO_OpenGraph_Image The current object.
		 */
		do_action( 'wpseo_add_opengraph_images', $open_graph_images );

		$images = (array) $presentation->og_images;

		array_walk( $images, [ $open_graph_images, 'add_image' ] );

		/**
		 * Filter: wpseo_add_opengraph_additional_images - Allows to add additional images to the OpenGraph tags.
		 *
		 * @api WPSEO_OpenGraph_Image The current object.
		 */
		do_action( 'wpseo_add_opengraph_additional_images', $open_graph_images );

		$images = array_map( [ $this->open_graph_image_helper, 'format_image' ], $images );
		$images = array_filter( $images, [ $this->open_graph_image_helper, 'is_image_url_valid' ] );
		$images = array_map( [ $this, 'filter' ], $images );

		if ( empty( $images ) ) {
			return '';
		}

		$return = '';
		foreach ( $images as $image_index => $image_meta ) {
			$image_url = $image_meta['url'];

			$return .= '<meta property="og:image" value="' . esc_url( $image_url ) . '"/>';

			// Adds secure URL if detected. Not all services implement this, so the regular one also needs to be rendered.
			if ( strpos( $image_url, 'https://' ) === 0 ) {
				$return .= '<meta property="og:image:secure_url" value="' . esc_url( $image_url ) . '"/>';
			}

			foreach ( static::$image_tags as $key => $value ) {
				if ( empty( $image_meta[ $key ] ) ) {
					continue;
				}

				$return .= '<meta property="og:image:' . esc_attr( $key ) . '" value="' . $image_meta[ $key ] . '"/>';
			}
		}

		return $return;
	}

	/**
	 * Run the image content through the `wpseo_opengraph_image` filter.
	 *
	 * @param array $image The image to filter.
	 *
	 * @return array The filtered image.
	 */
	protected function filter( array $image ) {
		/**
		 * Filter: 'wpseo_opengraph_image' - Allow changing the OpenGraph image.
		 *
		 * @api string - The URL of the OpenGraph image.
		 */
		$image_url = \trim( \apply_filters( 'wpseo_opengraph_image', $image['url'] ) );
		if ( ! empty( $image_url ) && \is_string( $image_url ) ) {
			$image['url'] = $image_url;
		}

		return $image;
	}
}

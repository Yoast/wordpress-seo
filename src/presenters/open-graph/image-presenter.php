<?php

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Presenter class for the Open Graph image.
 */
class Image_Presenter extends Abstract_Indexable_Presenter {

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
	 * Returns the image for a post.
	 *
	 * @return string The image tag.
	 */
	public function present() {
		$images = $this->get();

		if ( empty( $images ) ) {
			return '';
		}

		$return = '';
		foreach ( $images as $image_index => $image_meta ) {
			$image_url = $image_meta['url'];

			$return .= '<meta property="og:image" content="' . \esc_url( $image_url ) . '" />';

			foreach ( static::$image_tags as $key => $value ) {
				if ( empty( $image_meta[ $key ] ) ) {
					continue;
				}

				$return .= \PHP_EOL . "\t" . '<meta property="og:image:' . \esc_attr( $key ) . '" content="' . $image_meta[ $key ] . '" />';
			}
		}

		return $return;
	}

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return array The raw value.
	 */
	public function get() {
		$images = [];

		foreach ( $this->presentation->open_graph_images as $open_graph_image ) {
			$images[] = $this->filter( $open_graph_image );
		}

		return \array_filter( $images );
	}

	/**
	 * Run the image content through the `wpseo_opengraph_image` filter.
	 *
	 * @param array $image The image.
	 *
	 * @return array The filtered image.
	 */
	protected function filter( $image ) {
		/**
		 * Filter: 'wpseo_opengraph_image' - Allow changing the Open Graph image.
		 *
		 * @api string - The URL of the Open Graph image.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		$image_url = \trim( \apply_filters( 'wpseo_opengraph_image', $image['url'], $this->presentation ) );
		if ( ! empty( $image_url ) && \is_string( $image_url ) ) {
			$image['url'] = $image_url;
		}

		return $image;
	}
}

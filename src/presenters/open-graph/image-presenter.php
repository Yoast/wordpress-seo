<?php
/**
 * Presenter class for the OpenGraph image.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Image_Presenter
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
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The image tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$images = [];

		foreach ( $presentation->og_images as $og_image ) {
			$images[] = $this->filter( $og_image, $presentation );
		}

		$images = \array_filter( $images );

		if ( empty( $images ) ) {
			return '';
		}

		$return = '';
		foreach ( $images as $image_index => $image_meta ) {
			$image_url = $image_meta['url'];

			$return .= '<meta property="og:image" value="' . \esc_url( $image_url ) . '"/>';

			// Adds secure URL if detected. Not all services implement this, so the regular one also needs to be rendered.
			if ( \strpos( $image_url, 'https://' ) === 0 ) {
				$return .= PHP_EOL . '<meta property="og:image:secure_url" value="' . \esc_url( $image_url ) . '"/>';
			}

			foreach ( static::$image_tags as $key => $value ) {
				if ( empty( $image_meta[ $key ] ) ) {
					continue;
				}

				$return .= PHP_EOL . '<meta property="og:image:' . \esc_attr( $key ) . '" value="' . $image_meta[ $key ] . '"/>';
			}
		}

		return $return;
	}

	/**
	 * Run the image content through the `wpseo_opengraph_image` filter.
	 *
	 * @param array                  $image        The image.
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return array The filtered image.
	 */
	protected function filter( $image, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_opengraph_image' - Allow changing the OpenGraph image.
		 *
		 * @api string - The URL of the OpenGraph image.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		$image_url = \trim( \apply_filters( 'wpseo_opengraph_image', $image['url'], $presentation ) );
		if ( ! empty( $image_url ) && \is_string( $image_url ) ) {
			$image['url'] = $image_url;
		}

		return $image;
	}
}

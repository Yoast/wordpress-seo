<?php
/**
 * Presenter class for the OpenGraph image.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\Free\Presenters\Open_Graph;

use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Image_Presenter
 */
class Image_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * @var Url_Helper
	 */
	protected $url_helper;

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
	 * @param Image_Helper $image_helper The image helper.
	 * @param Url_Helper   $url_helper   The url helper.
	 */
	public function __construct( Image_Helper $image_helper, Url_Helper $url_helper ) {
		$this->image_helper = $image_helper;
		$this->url_helper   = $url_helper;
	}

	/**
	 * Returns the image for a post.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The image tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$return = '';
		$images = (array) $presentation->og_images;
		$images = array_map( [ $this, 'format_image' ], $images );
		$images = array_filter( $images, [ $this, 'is_image_url_valid' ] );

		$images = array_map( [ $this, 'filter' ], $images );
		foreach ( $images as $image_index => $image_meta ) {
			$image_url = $image_meta['url'];

			$return .= '<meta property="og:image" value="' . esc_url( $image_url ) . '"/>';

			// Adds secure URL if detected. Not all services implement this, so the regular one also needs to be rendered.
			if ( strpos( $image_meta['url'], 'https://' ) === 0 ) {
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
	 * Formats the image. To have all images the same format.
	 *
	 * @param array|string $image The attachment to format.
	 *
	 * @return array|string The formatted attachment.
	 */
	protected function format_image( $image ) {
		// In the past `add_image` accepted an image url, so leave this for backwards compatibility.
		if ( is_string( $image ) && $image !== '' ) {
			$image = [ 'url' => $image ];
		}

		if ( $this->url_helper->is_relative( $image['url'] ) ) {
			$image['url'] = $this->url_helper->get_relative_path( $image['url'] );
		}

		return $image;
	}

	/**
	 * Determines whether the passed URL is considered valid.
	 *
	 * @param array $image The image array.
	 *
	 * @return bool Whether or not the URL is a valid image.
	 */
	protected function is_image_url_valid( array $image ) {
		if ( empty( $image['url'] ) || ! is_string( $image['url'] ) ) {
			return false;
		}

		$image_extension = $this->get_extension_from_url( $image['url'] );
		$is_valid        = $this->image_helper->is_extension_valid( $image_extension );

		/**
		 * Filter: 'wpseo_opengraph_is_valid_image_url' - Allows extra validation for an image url.
		 *
		 * @api bool - Current validation result.
		 *
		 * @param string $url The image url to validate.
		 */
		return apply_filters( 'wpseo_opengraph_is_valid_image_url', $is_valid, $image['url'] );
	}

	/**
	 * Run the image content through the `wpseo_opengraph_image` filter.
	 *
	 * @param array $image The image to filter.
	 *
	 * @return array The filtered image.
	 */
	private function filter( array $image ) {
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

	/**
	 * Determines the file extension of the passed URL.
	 *
	 * @param string $url The URL.
	 *
	 * @return string The extension.
	 */
	protected function get_extension_from_url( $url ) {
		$extension = '';
		$path      = $this->get_image_url_path( $url );

		if ( $path === '' ) {
			return $extension;
		}

		$parts = explode( '.', $path );

		if ( ! empty( $parts ) ) {
			$extension = end( $parts );
		}

		return $extension;
	}


	/**
	 * Gets the image path from the passed URL.
	 *
	 * @param string $url The URL to get the path from.
	 *
	 * @return string The path of the image URL. Returns an empty string if URL parsing fails.
	 */
	protected function get_image_url_path( $url ) {
		return (string) wp_parse_url( $url, PHP_URL_PATH );
	}
}

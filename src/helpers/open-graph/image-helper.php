<?php
/**
 * A helper object for OpenGraph images.
 *
 * @package \Yoast\WP\Free\Helpers\Open_Graph
 */

namespace Yoast\WP\Free\Helpers\Open_Graph;

use Yoast\WP\Free\Helpers\Url_Helper;

/**
 * Class Image_Helper
 */
class Image_Helper {

	/**
	 * @var Url_Helper
	 */
	private $url_helper;
	/**
	 * @var \Yoast\WP\Free\Helpers\Image_Helper
	 */
	private $image_helper;

	/**
	 * Image_Helper constructor.
	 *
	 * @codeCoverageIgnore 
	 *
	 * @param Url_Helper                          $url_helper   The url helper.
	 * @param \Yoast\WP\Free\Helpers\Image_Helper $image_helper The image helper.
	 */
	public function __construct( Url_Helper $url_helper, \Yoast\WP\Free\Helpers\Image_Helper $image_helper ) {
		$this->url_helper   = $url_helper;
		$this->image_helper = $image_helper;
	}

	/**
	 * Formats the image. To have all images the same format.
	 *
	 * @param array|string $image The attachment to format.
	 *
	 * @return array|string The formatted attachment.
	 */
	public function format_image( $image ) {
		// In the past `add_image` accepted an image url, so leave this for backwards compatibility.
		if ( \is_string( $image ) && $image !== '' ) {
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
	public function is_image_url_valid( array $image ) {
		if ( empty( $image['url'] ) || ! is_string( $image['url'] ) ) {
			return false;
		}

		$image_extension = $this->url_helper->get_extension_from_url( $image['url'] );
		$is_valid        = $this->image_helper->is_extension_valid( $image_extension );

		/**
		 * Filter: 'wpseo_opengraph_is_valid_image_url' - Allows extra validation for an image url.
		 *
		 * @api bool - Current validation result.
		 *
		 * @param string $url The image url to validate.
		 */
		return (bool) apply_filters( 'wpseo_opengraph_is_valid_image_url', $is_valid, $image['url'] );
	}
}

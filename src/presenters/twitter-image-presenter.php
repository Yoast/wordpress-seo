<?php
/**
 * Presenter class for the Twitter image.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Twitter_Image_Presenter
 */
class Twitter_Image_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * The url helper.
	 *
	 * @var Url_Helper
	 */
	private $url_helper;

	/**
	 * Sets the url helper as dependency.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Url_Helper $url_helper
	 */
	public function __construct( Url_Helper $url_helper ) {
		$this->url_helper = $url_helper;
	}

	/**
	 * Presents a presentation.
	 * @param Indexable_Presentation $presentation The presentation to present.
	 *
	 * @return string The template.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$twitter_image = $this->format( $presentation->twitter_image );
		$twitter_image = $this->filter( $twitter_image );
		$twitter_image = \esc_url( $twitter_image );

		if ( is_string( $twitter_image ) && $twitter_image !== '' ) {
			return '<meta name="twitter:image" content="' . $twitter_image . '" />';
		}

		return '';
	}

	/**
	 * Run the Twitter image value through the `wpseo_twitter_image` filter.
	 *
	 * @param string $twitter_image The Twitter image to filter.
	 *
	 * @return string The filtered Twitter image.
	 */
	private function filter( $twitter_image ) {
		/**
		 * Filter: 'wpseo_twitter_image' - Allow changing the Twitter Card image.
		 *
		 * @api string $img Image URL string.
		 */
		return (string) apply_filters( 'wpseo_twitter_image', $twitter_image );
	}

	/**
	 * Formats the Twitter images to make sure we have an absolute image url.
	 *
	 * @param string $twitter_image The Twitter image to format.
	 *
	 * @return string The formatted Twitter image.
	 */
	private function format( $twitter_image ) {
		if ( $this->url_helper->is_relative( $twitter_image ) === true && \strpos( $twitter_image, '/' ) === 0 ) {
			$parsed_url    = \wp_parse_url( \home_url() );
			$twitter_image = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $twitter_image;
		}

		return $twitter_image;
	}
}

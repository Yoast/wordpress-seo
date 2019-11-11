<?php
/**
 * Presenter class for the Twitter image.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\Free\Presenters\Twitter;

use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Image_Presenter
 */
class Image_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * The url helper.
	 *
	 * @var Url_Helper
	 */
	private $url_helper;

	/**
	 * Sets the url helper as dependency.
	 *
	 * @param Url_Helper $url_helper The url helper.
	 */
	public function __construct( Url_Helper $url_helper ) {
		$this->url_helper = $url_helper;
	}

	/**
	 * Presents a presentation.
	 *
	 * @param Indexable_Presentation $presentation The presentation to present.
	 *
	 * @return string The template.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$twitter_image = $this->filter( $presentation->twitter_image );
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
}

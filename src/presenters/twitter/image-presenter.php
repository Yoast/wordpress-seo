<?php
/**
 * Presenter class for the Twitter image.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Image_Presenter
 */
class Image_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Presents a presentation.
	 *
	 * @param Indexable_Presentation $presentation The presentation to present.
	 *
	 * @return string The template.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$twitter_image = $this->filter( $presentation->twitter_image, $presentation );
		$twitter_image = \esc_url( $twitter_image );

		if ( \is_string( $twitter_image ) && $twitter_image !== '' ) {
			return '<meta name="twitter:image" content="' . $twitter_image . '" />';
		}

		return '';
	}

	/**
	 * Run the Twitter image value through the `wpseo_twitter_image` filter.
	 *
	 * @param string                 $twitter_image The Twitter image to filter.
	 * @param Indexable_Presentation $presentation  The presentation of an indexable.
	 *
	 * @return string The filtered Twitter image.
	 */
	private function filter( $twitter_image, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_twitter_image' - Allow changing the Twitter Card image.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 *
		 * @api string $twitter_image Image URL string.
		 *
		 */
		return (string) \apply_filters( 'wpseo_twitter_image', $twitter_image, $presentation );
	}
}

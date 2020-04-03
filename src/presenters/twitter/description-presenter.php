<?php
/**
 * Presenter class for the Twitter description.
 *
 * @package Yoast\YoastSEO\Presenters|Twitter
 */

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Description_Presenter
 */
class Description_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Presents a presentation.
	 *
	 * @return string The template.
	 */
	public function present() {
		$twitter_description = $this->replace_vars( $this->presentation->twitter_description );
		$twitter_description = $this->filter( $twitter_description );

		if ( $twitter_description ) {
			return '<meta name="twitter:description" content="' . \esc_attr( $twitter_description ) . '" />';
		}

		return '';
	}

	/**
	 * Run the Twitter description through the `wpseo_twitter_description` filter.
	 *
	 * @param string $twitter_description The Twitter description to filter.
	 *
	 * @return string The filtered Twitter description.
	 */
	private function filter( $twitter_description ) {
		/**
		 * Filter: 'wpseo_twitter_description' - Allow changing the Twitter description as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $twitter_description The description string.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \apply_filters( 'wpseo_twitter_description', $twitter_description, $this->presentation );
	}
}

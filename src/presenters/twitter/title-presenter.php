<?php
/**
 * Presenter class for the Twitter title.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\Free\Presenters\Twitter;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Title_Presenter
 */
class Title_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Returns the Twitter title.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The Twitter title tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$twitter_title = (string) $this->filter( $presentation->twitter_title );

		if ( $twitter_title !== '' ) {
			return \sprintf( '<meta name="twitter:title" content="%s" />', $twitter_title );
		}

		return '';
	}

	/**
	 * Run the Twitter title through the `wpseo_twitter_title` filter.
	 *
	 * @param string $twitter_title The Twitter title to filter.
	 *
	 * @return string The filtered Twitter title.
	 */
	private function filter( $twitter_title ) {
		/**
		 * Filter: 'wpseo_twitter_title' - Allow changing the Twitter title.
		 *
		 * @api string $twitter_title The Twitter title.
		 */
		return \trim( \apply_filters( 'wpseo_twitter_title', $twitter_title ) );
	}
}

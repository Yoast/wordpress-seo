<?php
/**
 * Presenter class for the Open Graph title.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Card_Presenter
 */
class Card_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Presents the Twitter card meta tag.
	 *
	 * @return string The Twitter card tag.
	 */
	public function present() {
		$card_type = $this->filter();

		if ( \is_string( $card_type ) && $card_type !== '' ) {
			return \sprintf( '<meta name="twitter:card" content="%s" />', \esc_attr( $card_type ) );
		}

		return '';
	}

	/**
	 * Runs the card type through the `wpseo_twitter_card_type` filter.
	 *
	 * @return string $card_type The filtered card type.
	 */
	private function filter() {
		/**
		 * Filter: 'wpseo_twitter_card_type' - Allow changing the Twitter card type.
		 *
		 * @api string $card_type The card type.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \trim( \apply_filters( 'wpseo_twitter_card_type', $this->presentation->twitter_card, $this->presentation ) );
	}
}

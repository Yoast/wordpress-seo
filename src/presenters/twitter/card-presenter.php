<?php
/**
 * Presenter class for the OpenGraph title.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\Free\Presenters\Twitter;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Card_Presenter
 */
class Card_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Presents the Twitter card meta tag.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The Twitter card tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$card_type = $this->filter( $presentation->twitter_card, $presentation );

		if ( \is_string( $card_type ) && $card_type !== '' ) {
			return \sprintf( '<meta name="twitter:card" content="%s" />', \esc_attr( $card_type ) );
		}

		return '';
	}

	/**
	 * Runs the card type through the `wpseo_twitter_card_type` filter.
	 *
	 * @param string                 $card_type    The card type to filter.
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string $card_type The filtered card type.
	 */
	private function filter( $card_type, Indexable_Presentation $presentation ) {
		/**
		 * Filter: 'wpseo_twitter_card_type' - Allow changing the Twitter card type.
		 *
		 * @api string $card_type The card type.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \trim( \apply_filters( 'wpseo_twitter_card_type', $card_type, $presentation ) );
	}
}

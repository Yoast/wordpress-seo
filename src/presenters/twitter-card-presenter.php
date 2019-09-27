<?php
/**
 * Presenter class for the OpenGraph title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Abstract_Title_Presenter
 */
class Twitter_Card_Presenter extends Abstract_Indexable_Presenter {
	/**
	 * Presents the twitter card meta tag.
	 *
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 *
	 * @return string The twitter card tag.
	 */
	public function present( Indexable_Presentation $presentation ) {
		$card_type = $this->filter( $presentation->twitter_card );
		if ( is_string( $card_type ) && $card_type !== '' ) {
			return sprintf( '<meta name="twitter:card" content="%s" />', $card_type );
		}

		return '';
	}

	/**
	 * Run the card type through the `wpseo_twitter_card_type` filter.
	 *
	 * @param string $card_type The card type to filter.
	 *
	 * @return string $card_type The filtered card type.
	 */
	private function filter( $card_type ) {
		/**
		 * Filter: 'wpseo_twitter_card_type' - Allow changing the Twitter card type.
		 *
		 * @api string $card_type The card type.
		 */
		return (string) trim( \apply_filters( 'wpseo_twitter_card_type', $card_type ) );
	}
}

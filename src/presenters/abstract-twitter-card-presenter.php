<?php
/**
 * Abstract presenter class for the OpenGraph title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Models\Indexable;

/**
 * Class Abstract_Title_Presenter
 */
abstract class Abstract_Twitter_Card_Presenter implements Presenter_Interface {
	/**
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The twitter card tag.
	 */
	public function present( Indexable $indexable ) {
		$card_type = $this->filter( $this->generate( $indexable ) );
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

	/**
	 * Generates the twitter card type for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title.
	 */
	abstract public function generate( Indexable $indexable );
}

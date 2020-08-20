<?php
/**
 * Presenter class for the Open Graph title.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Class Card_Presenter
 */
class Card_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="twitter:card" content="%s" />';

	/**
	 * Runs the card type through the `wpseo_twitter_card_type` filter.
	 *
	 * @return string $card_type The filtered card type.
	 */
	public function get() {
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

<?php

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Presenter class for the Twitter Card tag.
 */
class Card_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag key name.
	 *
	 * @var string
	 */
	protected $key = 'twitter:card';

	/**
	 * Runs the card type through the `wpseo_twitter_card_type` filter.
	 *
	 * @return string The filtered card type.
	 */
	public function get() {
		/**
		 * Filter: 'wpseo_twitter_card_type' - Allow changing the Twitter card type.
		 *
		 * @deprecated 19.8
		 *
		 * @param string $card_type The card type.
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		\apply_filters_deprecated( 'wpseo_twitter_card_type', [ $this->presentation->twitter_card, $this->presentation ], 'WPSEO 19.8', '', 'The only supported value is summary_large_image' );

		return $this->presentation->twitter_card;
	}
}

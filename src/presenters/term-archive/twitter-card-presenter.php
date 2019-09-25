<?php
/**
 * Presenter of the twitter card for terms.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Term_Archive;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Twitter_Card_Presenter;

/**
 * Class Twitter_Card_Presenter
 */
class Twitter_Card_Presenter extends Abstract_Twitter_Card_Presenter {
	/**
	 * Generates the twitter card for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The twitter card.
	 */
	public function generate( Indexable $indexable ) {
		if ( $indexable->twitter_card ) {
			return $indexable->twitter_card;
		}

		// @todo THIS IS WRONG, AND JUST EXAMPLE CODE

		return '';
	}
}

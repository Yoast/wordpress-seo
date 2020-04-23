<?php
/**
 * Presenter class for the Twitter title.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Class Title_Presenter
 */
class Title_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="twitter:title" content="%s" />';

	/**
	 * Run the Twitter title through replace vars and the `wpseo_twitter_title` filter.
	 *
	 * @return string The filtered Twitter title.
	 */
	public function get() {
		/**
		 * Filter: 'wpseo_twitter_title' - Allow changing the Twitter title.
		 *
		 * @api string $twitter_title The Twitter title.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \trim( \apply_filters( 'wpseo_twitter_title', $this->replace_vars( $this->presentation->twitter_title ), $this->presentation ) );
	}
}

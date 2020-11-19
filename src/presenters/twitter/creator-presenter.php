<?php

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Presenter class for the Twitter creator.
 */
class Creator_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="twitter:creator" content="%s" />';

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string The raw value.
	 */
	public function get() {
		return $this->presentation->twitter_creator;
	}
}

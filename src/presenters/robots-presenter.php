<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Presenter class for the robots output.
 */
class Robots_Presenter extends Abstract_Cached_Indexable_Tag_Presenter {

	const KEY = 'robots';

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string The raw value.
	 */
	public function refresh() {
		$robots = $this->presentation->robots;

		return \implode( ', ', $robots );
	}

	public function get_raw() {
		return $this->presentation->robots;
	}
}

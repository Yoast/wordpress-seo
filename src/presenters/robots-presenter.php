<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Presenter class for the robots output.
 */
class Robots_Presenter extends Abstract_Indexable_Tag_Presenter {

	const KEY = 'robots';

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string The raw value.
	 */
	public function get() {
		$robots = $this->presentation->robots;

		return \implode( ', ', $robots );
	}
}

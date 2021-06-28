<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Presenter class for the robots output.
 */
class Robots_Presenter extends Abstract_Cached_Indexable_Tag_Presenter {

	/**
	 * The tag key name.
	 *
	 * @var string
	 */
	protected $key = 'robots';

	/**
	 * Gets the value of the robot tags presentation.
	 *
	 * @return string The comma separated list of robot tags.
	 */
	public function refresh() {
		$robots = $this->get_raw();

		return \implode( ', ', $robots );
	}

	/**
	 * Gets the raw robot tags.
	 *
	 * @return array The array of robot tags.
	 */
	public function get_raw() {
		return $this->presentation->robots;
	}
}

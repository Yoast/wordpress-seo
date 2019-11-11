<?php
/**
 * A helper object for the robots meta tag.
 *
 * @package Yoast\WP\Free\Helpers
 */

namespace Yoast\WP\Free\Helpers;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class Robots_Helper
 */
class Robots_Helper {

	/**
	 * Sets the robots index to no index.
	 *
	 * @param string                 $robots       The current robots value.
	 * @param Indexable_Presentation $presentation Presentation.
	 *
	 * @return string The altered robots string.
	 */
	public function set_robots_no_index( $robots, Indexable_Presentation $presentation ) {
		if ( in_array( 'noindex', $presentation->robots, true ) ) {
			return $robots;
		}

		$new_robots          = $presentation->robots;
		$new_robots['index'] = 'noindex';

		return implode( ',', $new_robots );
	}
}

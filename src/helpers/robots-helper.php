<?php
/**
 * A helper object for the robots meta tag.
 *
 * @package Yoast\WP\SEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

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
		$new_robots          = \array_filter( $new_robots );

		return implode( ',', $new_robots );
	}
}

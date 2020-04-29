<?php
/**
 * A helper object for the robots meta tag.
 *
 * @package Yoast\WP\SEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

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
		// When robots is null just return the default but with noindex: `noindex, follow`.
		if ( ! \is_string( $robots ) ) {
			return 'noindex, follow';
		}

		// Already noindex.
		if ( \strpos( $robots, 'noindex' ) !== false ) {
			return $robots;
		}

		// Replace index with noindex.
		if ( \strpos( $robots, 'index' ) !== false ) {
			return \str_replace( 'index', 'noindex', $robots );
		}

		// Add noindex.
		return 'noindex, ' . $robots;
	}
}

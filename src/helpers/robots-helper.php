<?php
/**
 * A helper object for the robots meta tag.
 *
 * @package Yoast\WP\SEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

/**
 * Class Robots_Helper
 */
class Robots_Helper {

	/**
	 * Sets the robots index to noindex.
	 *
	 * @param array $robots The current robots value.
	 *
	 * @return array The altered robots string.
	 */
	public function set_robots_no_index( $robots ) {
		if ( ! \is_array( $robots ) ) {
			\_deprecated_argument( __METHOD__, '14.1', '$robots has to be a key-value paired array.' );
			return $robots;
		}

		$robots['index'] = 'noindex';

		return $robots;
	}
}

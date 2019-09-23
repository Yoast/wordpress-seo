<?php

namespace Yoast\WP\Free\Wrappers;

use WP_Query;

class WP_Query_Wrapper {
	/**
	 * Returns the global WP_Query object.
	 *
	 * @return WP_Query The WP_Query object.
	 */
	public function get_query() {
		return $GLOBALS['wp_query'];
	}

	/**
	 * Sets the global WP_Query object.
	 *
	 * @param WP_Query $wp_query
	 */
	public function set_query( WP_Query $wp_query ) {
		$GLOBALS['wp_query'] = $wp_query;
	}

	/**
	 * Resets the global WP_Query object.
	 */
	public function reset_query() {
		\wp_reset_query();
	}
}

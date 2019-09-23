<?php

namespace Yoast\WP\Free\Wrappers;

use WP_Query;

class WP_Query_Wrapper {
	public function get_query() {
		return $GLOBALS['wp_query'];
	}

	public function set_query( WP_Query $wp_query ) {
		$GLOBALS['wp_query'] = $wp_query;
	}
}

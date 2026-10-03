<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for route handling.
 */
class Route_Helper {

	/**
	 * Gets the route from a name, rewrite and rest_base.
	 *
	 * @param string $name      The name.
	 * @param array  $rewrite   The rewrite data.
	 * @param string $rest_base The rest base.
	 *
	 * @return string The route.
	 */
	public function get_route( $name, $rewrite, $rest_base ) {
		$route = $name;
		if ( isset( $rewrite['slug'] ) ) {
			$route = $rewrite['slug'];
		}
		if ( ! empty( $rest_base ) ) {
			$route = $rest_base;
		}
		// Always strip leading slashes.
		while ( \substr( $route, 0, 1 ) === '/' ) {
			$route = \substr( $route, 1 );
		}

		return $route;
	}
}

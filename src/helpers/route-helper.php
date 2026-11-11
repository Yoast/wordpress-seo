<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for route handling.
 */
class Route_Helper {

	/**
	 * Gets the route from a name and rest_base.
	 *
	 * The post type or taxonomy name is used as the route by default, because it is unique and
	 * stable. The rewrite slug is deliberately not used: it is not guaranteed to be unique (a
	 * custom type can reuse a built-in type's rewrite slug) and it can change, which would make
	 * the settings section unreachable or its URL unstable. See https://github.com/Yoast/wordpress-seo/issues/20864.
	 *
	 * @param string $name      The name.
	 * @param string $rest_base The rest base.
	 *
	 * @return string The route.
	 */
	public function get_route( $name, $rest_base ) {
		$route = $name;
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

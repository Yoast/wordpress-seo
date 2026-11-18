<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Routes;

use Yoast\WP\SEO\Routes\Abstract_Indexation_Route;

/**
 * Represents the Abstract_Indexation_Route mock.
 */
final class Abstract_Indexation_Route_Mock extends Abstract_Indexation_Route {

	/**
	 * Responds to an indexation request.
	 *
	 * @param array  $objects  The objects that have been indexed.
	 * @param string $next_url The url that should be called to continue reindexing. False if done.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function respond_with( $objects, $next_url ) {
		return parent::respond_with( $objects, $next_url );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {}
}

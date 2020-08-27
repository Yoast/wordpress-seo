<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Routes;

use Yoast\WP\SEO\Routes\Abstract_Indexation_Route;

/**
 * Represents the Abstract_Indexation_Route mock.
 */
class Abstract_Indexation_Route_Mock extends Abstract_Indexation_Route {

	/**
	 * @inheritDoc
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
	public function register_routes() {
		// Do nothing...
	}
}

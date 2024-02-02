<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_Primary_Term;

/**
 * Test Helper Class.
 */
final class Primary_Term_Double extends WPSEO_Primary_Term {

	/**
	 * Overwrite the get_terms method, because it uses a dependency.
	 *
	 * @return array
	 */
	protected function get_terms() {
		return [
			(object) [
				'term_id' => 54,
			],
		];
	}
}

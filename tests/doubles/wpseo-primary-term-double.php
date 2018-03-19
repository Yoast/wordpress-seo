<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Primary_Term_Double extends WPSEO_Primary_Term {

	/**
	 * Overwrite the get_terms method, because it uses a dependency
	 *
	 * @return array
	 */
	protected function get_terms() {
		return array(
			(object) array(
				'term_id' => 54,
			),
		);
	}
}

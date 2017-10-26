<?php
/**
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Export_Keywords_Term_Query_Double extends WPSEO_Export_Keywords_Term_Query {

	/**
	 * Retrieve the database columns to select in the query, an array of strings.
	 *
	 * @return array
	 */
	public function get_selects() {
		return $this->selects;
	}
}

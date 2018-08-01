<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Export_Keywords_Post_Query_Double extends WPSEO_Export_Keywords_Post_Query {

	/**
	 * Retrieve the database columns to select in the query.
	 *
	 * @return array
	 */
	public function get_selects() {
		return $this->selects;
	}

	/**
	 * Retrieve the database tables to join in the query.
	 *
	 * @return array
	 */
	public function get_joins() {
		return $this->joins;
	}

	/**
	 * Adds an aliased join to the $wpdb->postmeta table so that multiple meta values can be selected in a single row.
	 *
	 * While this function should never be used with user input,
	 * all non-word non-digit characters are removed from both params for increased robustness.
	 *
	 * @param string $alias The alias to use in our query output.
	 * @param string $key   The meta_key to select.
	 */
	public function run_add_meta_join( $alias, $key ) {
		$this->add_meta_join( $alias, $key );
	}
}

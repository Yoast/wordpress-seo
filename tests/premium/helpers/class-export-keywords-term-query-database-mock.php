<?php
/**
 * @package WPSEO\Tests\Premium\Helpers
 */

/**
 * Test Helper Class.
 */
class WPSEO_Export_Keywords_Term_Query_Database_Mock {
	/** @var string */
	public $prefix = 'bamboozled';

	/** @var string */
	public $query;

	/** @var string */
	public $type;

	/**
	 * Set properties.
	 *
	 * @param string $query Query.
	 * @param string $type  Output type.
	 */
	public function get_results( $query, $type ) {
		$this->query = $query;
		$this->type  = $type;
	}

	/**
	 * Prepare an SQL query.
	 *
	 * @param string $query SQL query.
	 * @param mixed  $args  Variable number of replacement arguments.
	 *
	 * @return string
	 */
	public function prepare( $query, $args ) {
		global $wpdb;

		$args = func_get_args();
		array_shift( $args );
		if ( isset( $args[0] ) && is_array( $args[0] ) ) {
			$args = $args[0];
		}
		return $wpdb->prepare( $query, $args );
	}
}

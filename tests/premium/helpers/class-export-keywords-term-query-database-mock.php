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
}

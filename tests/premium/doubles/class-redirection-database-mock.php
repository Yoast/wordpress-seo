<?php
/**
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Redirection_Database_Mock {
	/** @var string */
	public $prefix = 'bamboozled';

	/** @var array */
	private $results;

	/**
	 * Constructor.
	 *
	 * @param array $results Results.
	 */
	public function __construct( $results ) {
		$this->results = $results;
	}

	/**
	 * Mock retrieving results.
	 *
	 * @param string $query Query.
	 *
	 * @return array
	 */
	public function get_results( $query ) {
		return $this->results;
	}
}

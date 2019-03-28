<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Collects the data from the added collection objects.
 */
class WPSEO_Collector {

	/**
	 * @var WPSEO_Collection[]
	 */
	protected $collections = array();

	/**
	 * Adds a collection object to the collections.
	 *
	 * @param WPSEO_Collection $collection The collection object to add.
	 */
	public function add_collection( WPSEO_Collection $collection ) {
		$this->collections[] = $collection;
	}

	/**
	 * Collects the data from the collection objects.
	 *
	 * @return array The collected data.
	 */
	public function collect() {
		$data = array();

		foreach ( $this->collections as $collection ) {
			$data = array_merge( $data, $collection->get() );
		}

		return $data;
	}

	/**
	 * Returns the collected data as a JSON encoded string.
	 *
	 * @return false|string The encode string.
	 */
	public function get_as_json() {
		return WPSEO_Utils::format_json_encode( $this->collect() );
	}
}

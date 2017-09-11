<?php
/**
 * @package WPSEO\Premium\Classes\Export
 */

/**
 * Interface WPSEO_Export_Keywords_Query
 *
 * Creates a SQL query to gather all data for a keywords export.
 */
interface WPSEO_Export_Keywords_Query {
	/**
	 * Returns the page size for the query.
	 *
	 * @return int Page size that is being used.
	 */
	public function get_page_size();

	/**
	 * Constructs the query and executes it, returning an array of objects containing the columns this object was constructed with.
	 * Every object will always contain the ID column.
	 *
	 * @param int $page Paginated page to retrieve.
	 *
	 * @return array An array of associative arrays containing the keys as requested in the constructor.
	 */
	public function get_data( $page = 1 );

	/**
	 * Prepares the necessary selects and joins to get all data in a single query.
	 *
	 * @param array $columns   The columns we want our query to return.
	 */
	public function set_columns( array $columns );
}

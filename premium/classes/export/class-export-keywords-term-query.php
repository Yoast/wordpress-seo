<?php
/**
 * @package WPSEO\Premium\Classes\Export
 */

/**
 * Class WPSEO_Export_Keywords_Term_Query
 *
 * Creates an SQL query to gather all term data for a keywords export.
 */
class WPSEO_Export_Keywords_Term_Query implements WPSEO_Export_Keywords_Query {

	/** @var wpdb The WordPress database object. */
	protected $wpdb;

	/** @var array The columns to query for, an array of strings. */
	protected $columns;

	/** @var array The database columns to select in the query, an array of strings. */
	protected $selects;

	/** @var int Number of items to fetch per page */
	protected $page_size;

	/**
	 * WPSEO_Export_Keywords_Query constructor.
	 *
	 * Supported values for columns are 'title', 'url', 'keywords', 'readability_score' and 'keywords_score'.
	 * Requesting 'keywords_score' will always also return 'keywords'.
	 *
	 * @param wpdb  $wpdb      A WordPress Database object.
	 * @param array $columns   List of columns that need to be retrieved.
	 * @param int   $page_size Number of items to retrieve.
	 */
	public function __construct( $wpdb, array $columns, $page_size = 1000 ) {
		$this->wpdb      = $wpdb;
		$this->page_size = max( 1, (int) $page_size );
		$this->set_columns( $columns );
	}

	/**
	 * Returns the page size for the query.
	 *
	 * @return int Page size that is being used.
	 */
	public function get_page_size() {
		return $this->page_size;
	}

	/**
	 * Constructs the query and executes it, returning an array of objects containing the columns this object was constructed with.
	 * Every object will always contain the ID column.
	 *
	 * @param int $page Paginated page to retrieve.
	 *
	 * @return array An array of associative arrays containing the keys as requested in the constructor.
	 */
	public function get_data( $page = 1 ) {

		if ( $this->columns === array() ) {
			return array();
		}

		$escaped_taxonomies = $this->get_escaped_taxonomies();
		if ( empty( $escaped_taxonomies ) ) {
			return array();
		}

		// Construct the query.
		$query = 'SELECT ' . implode( ', ', $this->selects ) . ' FROM ' . $this->wpdb->prefix . 'terms AS terms' .
				 ' INNER JOIN ' . $this->wpdb->prefix . 'term_taxonomy AS taxonomies' .
				 ' ON terms.term_id = taxonomies.term_id AND taxonomies.taxonomy IN ("' . $escaped_taxonomies . '")';

		// Pages have a starting index of 1, we need to convert to a 0 based offset.
		$offset_multiplier = max( 0, ( $page - 1 ) );

		$query .= ' LIMIT ' . $this->page_size . ' OFFSET ' . ( $offset_multiplier * $this->page_size );

		return $this->wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * Prepares the necessary selects and joins to get all data in a single query.
	 *
	 * @param array $columns The columns we want our query to return.
	 */
	public function set_columns( array $columns ) {
		$this->columns = $columns;

		$this->selects = array( 'terms.term_id', 'taxonomies.taxonomy' );

		if ( in_array( 'title', $this->columns, true ) ) {
			$this->selects[] = 'terms.name';
		}
	}

	/**
	 * Retrieves a list of taxonomies to be used in a query.
	 *
	 * @return string List of escaped taxonomies to use in a query.
	 */
	protected function get_escaped_taxonomies() {
		static $escaped = null;

		if ( $escaped === null ) {
			$taxonomies = get_taxonomies( array( 'public' => true, 'show_ui' => true ), 'names' );
			$escaped    = implode( '", "', array_map( 'esc_sql', $taxonomies ) );
		}

		return $escaped;
	}
}

<?php
/**
 * @package WPSEO\Premium\Classes\Export
 */

/**
 * Class WPSEO_Export_Keywords_Query
 *
 * Creates an SQL query to gather all post data for a keywords export.
 */
class WPSEO_Export_Keywords_Post_Query implements WPSEO_Export_Keywords_Query {

	/** @var wpdb The WordPress database object. */
	protected $wpdb;

	/** @var array The columns to query for. */
	protected $columns;

	/** @var array The database columns to select in the query. */
	protected $selects;

	/** @var array The database tables to join in the query. */
	protected $joins = array();

	/** @var int Number of items to fetch per page */
	protected $page_size;

	/** @var  string Escaped list of post types */
	protected $escaped_post_types;

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

		$post_types = WPSEO_Post_Type::get_accessible_post_types();
		if ( empty( $post_types ) ) {
			return array();
		}

		// Pages have a starting index of 1, we need to convert to a 0 based offset.
		$offset_multiplier = max( 0, ( $page - 1 ) );

		$replacements   = $post_types;
		$replacements[] = $this->page_size;
		$replacements[] = ( $offset_multiplier * $this->page_size );

		// Construct the query.
		$query = $this->wpdb->prepare(
			'SELECT ' . implode( ', ', $this->selects )
				. ' FROM ' . $this->wpdb->prefix . 'posts AS posts '
				. implode( ' ', $this->joins )
				. ' WHERE posts.post_status = "publish" AND posts.post_type IN ('
				. implode( ',', array_fill( 0, count( $post_types ), '%s' ) ) . ')'
				. ' LIMIT %d OFFSET %d',
			$replacements
		);

		return $this->wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * Prepares the necessary selects and joins to get all data in a single query.
	 *
	 * @param array $columns The columns we want our query to return.
	 */
	public function set_columns( array $columns ) {
		$this->columns = $columns;

		$this->joins   = array();
		$this->selects = array( 'posts.ID', 'posts.post_type' );

		if ( in_array( 'title', $this->columns, true ) ) {
			$this->selects[] = 'posts.post_title';
		}

		// If we're selecting keywords_score then we always want the keywords as well.
		if ( in_array( 'keywords', $this->columns, true ) || in_array( 'keywords_score', $this->columns, true ) ) {
			$this->add_meta_join( 'primary_keyword', WPSEO_Meta::$meta_prefix . 'focuskw' );
			$this->add_meta_join( 'other_keywords', WPSEO_Meta::$meta_prefix . 'focuskeywords' );
		}

		if ( in_array( 'readability_score', $this->columns, true ) ) {
			$this->add_meta_join( 'readability_score', WPSEO_Meta::$meta_prefix . 'content_score' );
		}

		if ( in_array( 'keywords_score', $this->columns, true ) ) {
			// Score for other keywords is already in the other_keywords select so only join for the primary_keyword_score.
			$this->add_meta_join( 'primary_keyword_score', WPSEO_Meta::$meta_prefix . 'linkdex' );
		}
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
	 * Adds an aliased join to the $wpdb->postmeta table so that multiple meta values can be selected in a single row.
	 *
	 * While this function should never be used with user input,
	 * all non-word non-digit characters are removed from both params for increased robustness.
	 *
	 * @param string $alias The alias to use in our query output.
	 * @param string $key   The meta_key to select.
	 */
	protected function add_meta_join( $alias, $key ) {
		$alias = preg_replace( '/[^\w\d]/', '', $alias );
		$key   = preg_replace( '/[^\w\d]/', '', $key );

		$this->selects[] = $alias . '_join.meta_value AS ' . $alias;
		$this->joins[]   = 'LEFT OUTER JOIN ' . $this->wpdb->prefix . 'postmeta AS ' . $alias . '_join '
			. 'ON ' . $alias . '_join.post_id = posts.ID '
			. 'AND ' . $alias . '_join.meta_key = "' . $key . '"';
	}

	/**
	 * Escapes the post types to be used in an SQL list.
	 *
	 * @deprecated 5.8.0
	 *
	 * @return string Escaped post types.
	 */
	protected function get_escaped_post_types() {
		_deprecated_function( __METHOD__, 'WPSEO 5.8.0' );

		static $escaped = null;

		if ( $escaped === null ) {
			// Get all public post types and run esc_sql on them.
			$escaped = implode( '", "', array_map( 'esc_sql', WPSEO_Post_Type::get_accessible_post_types() ) );
		}

		return $escaped;
	}

}

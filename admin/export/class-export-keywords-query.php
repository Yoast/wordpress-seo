<?php
/**
 * @package WPSEO\Admin\Export
 */

/**
 * Class WPSEO_Export_Keywords_Query
 *
 * Creates a SQL query to gather all data for a keywords export.
 */
class WPSEO_Export_Keywords_Query {

	/**
	 * @var wpdb wpdb The WordPress database object.
	 */
	protected $wpdb;

	/**
	 * @var array The columns to query for, an array of strings.
	 */
	protected $columns;

	/**
	 * @var array The database columns to select in the query, an array of strings.
	 */
	protected $selects;

	/**
	 * @var array The database tables to join in the query, an array of strings.
	 */
	protected $joins = array();

	/**
	 * WPSEO_Export_Keywords_Query constructor.
	 *
	 * Supported values for columns are 'post_title', 'post_url', 'keywords', 'seo_score' and 'keywords_score'.
	 * Requesting 'keywords_score' will always also return 'keywords'.
	 *
	 * @param array $columns The columns we want our query to return.
	 * @param wpdb  $wpdb    A WordPress Database object.
	 */
	public function __construct( $columns, $wpdb ) {
		$this->columns = $columns;
		$this->wpdb = $wpdb;
	}

	/**
	 * Constructs the query and executes it, returning an array of objects containing the columns this object was constructed with.
	 * Every object will always contain the ID column.
	 *
	 * @return array An array of associative arrays containing the keys as requested in the constructor.
	 */
	public function get_data() {
		$this->set_columns();

		// Get all public post types and run esc_sql on them.
		$post_types = join( '", "', array_map( 'esc_sql', get_post_types( array( 'public' => true ), 'names' ) ) );

		// Construct the query.
		$query = 'SELECT ' . join( ', ', $this->selects ) . ' FROM ' . $this->wpdb->prefix . 'posts ' . join( ' ', $this->joins ) .
				 ' WHERE ' . $this->wpdb->prefix . 'posts.post_status = "publish" AND ' . $this->wpdb->prefix . 'posts.post_type IN ("' . $post_types . '");';

		return $this->wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * Prepares the necessary selects and joins to get all data in a single query.
	 */
	protected function set_columns() {
		$this->selects = array( $this->wpdb->prefix . 'posts.ID' );

		if ( in_array( 'post_title', $this->columns, true ) ) {
			$this->selects[] = $this->wpdb->prefix . 'posts.post_title';
		}

		// If we're selecting keywords_score then we always want the keywords as well.
		if ( in_array( 'keywords', $this->columns, true ) || in_array( 'keywords_score', $this->columns, true ) ) {
			$this->add_meta_join( 'primary_keyword', WPSEO_Meta::$meta_prefix . 'focuskw' );
			$this->add_meta_join( 'other_keywords', WPSEO_Meta::$meta_prefix . 'focuskeywords' );
		}

		if ( in_array( 'seo_score', $this->columns, true ) ) {
			$this->add_meta_join( 'seo_score', WPSEO_Meta::$meta_prefix . 'content_score' );
		}

		if ( in_array( 'keywords_score', $this->columns, true ) ) {
			// Score for other keywords is already in the other_keywords select so only join for the primary_keyword_score.
			$this->add_meta_join( 'primary_keyword_score', WPSEO_Meta::$meta_prefix . 'linkdex' );
		}
	}

	/**
	 * Adds an aliased join to the $wpdb->postmeta table so that multiple meta values can be selected in a single row.
	 * While this function should never be used with user input all non-word non-digit characters are removed from both params for increased robustness.
	 *
	 * @param string $alias The alias to use in our query output.
	 * @param string $key The meta_key to select.
	 */
	protected function add_meta_join( $alias, $key ) {
		$alias = preg_replace( '/[^\w\d]/', '', $alias );
		$key = preg_replace( '/[^\w\d]/', '', $key );

		$this->selects[] = $alias . '_join.meta_value AS ' . $alias;
		$this->joins[] = 'LEFT OUTER JOIN ' . $this->wpdb->prefix . 'postmeta AS ' . $alias . '_join ' .
						 'ON ' . $alias . '_join.post_id = ' . $this->wpdb->prefix . 'posts.ID ' .
						 'AND ' . $alias . '_join.meta_key = "' . $key . '"';
	}
}

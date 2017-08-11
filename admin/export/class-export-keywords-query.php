<?php
/**
 * @package WPSEO\Admin\Export
 */

class WPSEO_Export_Keywords_Query {

	/**
	 * @var array[int]string The columns to query for, an array of strings.
	 */
	private $columns;

	/**
	 * @var array[int][string]string The results of the query, an array of associative arrays.
	 */
	private $results;

	/**
	 * @var array[int]string The database columns to select in the query, an array of strings.
	 */
	private $selects;

	/**
	 * @var array[int]string The database tables to join in the query, an array of strings.
	 */
	private $joins = array();

	/**
	 * WPSEO_Export_Keywords_Query constructor.
	 *
	 * Supported values for columns are 'post_title', 'post_url', 'keywords', 'seo_score' and 'keywords_score'.
	 * Requesting 'keywords_score' will always also return 'keywords'.
	 *
	 * @param array[int]string $columns The columns we want our query to return.
	 */
	public function __construct( $columns ) {
		$this->columns = $columns;
	}

	/**
	 * @return array[int]string The columns to query for, an array of strings.
	 */
	public function get_columns() {
		return $this->columns;
	}

	/**
	 * Constructs the query and executes it, returning an array of objects containing the columns this object was constructed with.
	 * Every object will always contain the ID column.
	 *
	 * @return array[int][tring]string array of associative arrays containing the keys as requested in the constructor.
	 */
	public function get_data() {
		global $wpdb;

		$this->set_columns();

		$post_types = join('", "', array_map( 'esc_sql', get_post_types( array( 'public' => true ), 'names' ) ) );
		$query = 'SELECT ' . join( ', ', $this->selects ) . ' FROM ' . $wpdb->prefix . 'posts ' . join( ' ', $this->joins ) .
				 ' WHERE ' . $wpdb->prefix . 'posts.post_status = "publish" AND ' . $wpdb->prefix . 'posts.post_type IN ("' . $post_types . '");';
		$this->results = $wpdb->get_results( $query, ARRAY_A );

		// If post urls were selected we need to add them to our results.
		if ( in_array( 'post_url', $this->columns ) ) {
			$this->add_post_urls();
		}

		// If keywords were selected we need to convert them to a better format.
		if ( in_array( 'keywords', $this->columns ) || in_array( 'keywords_score', $this->columns ) ) {
			$this->convert_result_keywords();
		}

		return $this->results;
	}

	/**
	 * Constructs our query by preparing the necessary selects and joins to get all our data in a single query.
	 */
	protected function set_columns() {
		global $wpdb;

		$this->selects = array( $wpdb->prefix . 'posts.ID' );

		if ( in_array( 'post_title', $this->columns ) ) {
			array_push( $this->selects, $wpdb->prefix . 'posts.post_title' );
		}

		// If we're selecting keywords_score then we always want the keywords as well.
		if ( in_array( 'keywords', $this->columns ) || in_array( 'keywords_score', $this->columns ) ) {
			$this->add_meta_join( 'primary_keyword', WPSEO_Meta::$meta_prefix . 'focuskw' );
			$this->add_meta_join( 'other_keywords', WPSEO_Meta::$meta_prefix . 'focuskeywords' );
		}

		if ( in_array( 'seo_score', $this->columns ) ) {
			$this->add_meta_join( 'seo_score', WPSEO_Meta::$meta_prefix . 'content_score' );
		}

		if ( in_array( 'keywords_score', $this->columns ) ) {
			$this->add_meta_join( 'primary_keyword_score', WPSEO_Meta::$meta_prefix . 'linkdex' );
			// Score for other keywords is already in the other_keywords select.
		}
	}

	/**
	 * Adds an aliased join to the $wpdb->postmeta table so that multiple meta values can be selected in a single row.
	 * While this function should never be used with user input all non-word non-digit characters are removed from both params to be idiot-proof.
	 *
	 * @param string $alias The alias to use in our query output.
	 * @param string $key The meta_key to select.
	 */
	protected function add_meta_join( $alias, $key ) {
		global $wpdb;

		$alias = preg_replace( '/[^\w\d]/', '', $alias );
		$key = preg_replace( '/[^\w\d]/', '', $key );

		array_push( $this->selects, $alias . '_join.meta_value AS ' . $alias );
		array_push( $this->joins,
			'LEFT OUTER JOIN ' . $wpdb->prefix . 'postmeta AS ' . $alias . '_join ' .
			'ON ' . $alias . '_join.post_id = ' . $wpdb->prefix . 'posts.ID AND ' . $alias . '_join.meta_key = "' . $key . '"');
	}

	/**
	 * Add post URLs to all results.
	 */
	protected function add_post_urls() {
		$converted = array();

		foreach ( $this->results as $result ) {
			$result['post_url'] = get_permalink( $result['ID'] );

			$converted[] = $result;
		}

		$this->results = $converted;
	}

	/**
	 * Converts the results of the query from strings and JSON string to keyword arrays.
	 */
	protected function convert_result_keywords() {
		$converted = array();

		foreach ( $this->results as $result ) {
			$result['keywords'] = array( $result['primary_keyword'] );

			if ( in_array( 'keywords_score', $this->columns ) ) {
				$result['keywords_score'] = array( $this->get_rating_from_int_score( $result['primary_keyword_score'] ) );
			}

			// Convert multiple keywords from the Premium plugin from json to string arrays.
			if ( array_key_exists( 'other_keywords', $result ) && $result['other_keywords'] ) {
				$keywords = json_decode( $result['other_keywords'], true );
				foreach( $keywords as $keyword ) {
					$result['keywords'][] = $keyword['keyword'];
					if ( in_array( 'keywords_score', $this->columns ) ) {
						$result['keywords_score'][] = $this->get_rating_from_string_score( $keyword['score'] );
					}
				}
			}

			// Unset all old variables, if they do not exist nothing will happen.
			unset( $result['primary_keyword'] );
			unset( $result['primary_keyword_score'] );
			unset( $result['other_keywords'] );

			$converted[] = $result;
		}

		$this->results = $converted;
	}

	/**
	 * Converts an integer keyword score to a friendly rating.
	 *
	 * @param int $score A score, normally from 0 to 100.
	 *
	 * @return string
	 */
	protected function get_rating_from_int_score( $score ) {
		if ( $score > 0 && $score <= 40 ) {
			return __( "needs improvement" );
		}

		if ( $score > 40 && $score <= 70 ) {
			return __( "ok" );
		}

		if ( $score > 70 ) {
			return __( "good" );
		}

		return __( "none" );
	}

	/**
	 * Converts an unfriendly integer keyword score to a friendly rating.
	 *
	 * @param string $score A score, normally 'na', 'bad', 'ok' or 'good'.
	 *
	 * @return string
	 */
	protected function get_rating_from_string_score( $score ) {
		if ( $score === 'bad' ) {
			return __( "needs improvement" );
		}

		if ( $score === 'ok' ) {
			return __( 'ok' );
		}

		if ( $score === 'good' ) {
			return __( 'good' );
		}

		return __( 'none' );
	}
}

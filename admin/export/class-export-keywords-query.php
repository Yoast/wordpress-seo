<?php
/**
 * @package WPSEO\Admin\Export
 */

class WPSEO_Export_Keywords_Query {

	/**
	 * @var wpdb The wordpress database object.
	 */
	protected $wpdb;

	/**
	 * @var array[int]string The columns to query for, an array of strings.
	 */
	protected $columns;

	/**
	 * @var array[int]string The database columns to select in the query, an array of strings.
	 */
	protected $selects;

	/**
	 * @var array[int]string The database tables to join in the query, an array of strings.
	 */
	protected $joins = array();

	/**
	 * WPSEO_Export_Keywords_Query constructor.
	 *
	 * Supported values for columns are 'post_title', 'post_url', 'keywords', 'seo_score' and 'keywords_score'.
	 * Requesting 'keywords_score' will always also return 'keywords'.
	 *
	 * @param array[int]string $columns The columns we want our query to return.
	 */
	public function __construct( $columns, $wpdb ) {
		$this->columns = $columns;
		$this->wpdb = $wpdb;
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
		$this->set_columns();

		// Get all public post types and run esc_sql on them.
		$post_types = join('", "', array_map( 'esc_sql', get_post_types( array( 'public' => true ), 'names' ) ) );

		// Construct the query.
		$query = 'SELECT ' . join( ', ', $this->selects ) . ' FROM ' . $this->wpdb->prefix . 'posts ' . join( ' ', $this->joins ) .
				 ' WHERE ' . $this->wpdb->prefix . 'posts.post_status = "publish" AND ' . $this->wpdb->prefix . 'posts.post_type IN ("' . $post_types . '");';

		$results = $this->wpdb->get_results( $query, ARRAY_A );

		return array_map( array( $this, 'result_mapper' ), $results );
	}

	/**
	 * Constructs our query by preparing the necessary selects and joins to get all our data in a single query.
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
		$alias = preg_replace( '/[^\w\d]/', '', $alias );
		$key = preg_replace( '/[^\w\d]/', '', $key );

		$this->selects[] = $alias . '_join.meta_value AS ' . $alias;
		$this->joins[] = 'LEFT OUTER JOIN ' . $this->wpdb->prefix . 'postmeta AS ' . $alias . '_join ' .
						 'ON ' . $alias . '_join.post_id = ' . $this->wpdb->prefix . 'posts.ID ' .
						 'AND ' .$alias . '_join.meta_key = "' . $key . '"';
	}

	/**
	 * Updates a result by modifying and adding the requested fields.
	 *
	 * @param array[string]string $result The result to modify.
	 *
	 * @return array[string]string The modified result.
	 */
	protected function result_mapper( $result ) {
		// If post titles were selected run their filters.
		if ( in_array( 'post_title', $this->columns, true ) ) {
			$result['post_title'] = apply_filters( 'the_title', $result['post_title'], $result['ID'] );
		}

		// If post urls were selected add them to our results.
		if ( in_array( 'post_url', $this->columns, true ) ) {
			$result['post_url'] = get_permalink( $result['ID'] );
		}

		// If SEO scores were selected convert them to nice ratings.
		if ( in_array( 'seo_score', $this->columns, true ) ) {
			$result['seo_score'] = $this->get_rating_from_int_score( intval( $result['seo_score']) );
		}

		// If keywords were selected we need to convert them to a better format.
		if ( in_array( 'keywords', $this->columns, true ) || in_array( 'keywords_score', $this->columns, true ) ) {
			$result = $this->convert_result_keywords( $result );
		}

		return $result;
	}

	/**
	 * Converts the results of the query from strings and JSON string to keyword arrays.
	 *
	 * @param array[string]string $result The result to convert.
	 *
	 * @return array[string]string The converted result.
	 */
	protected function convert_result_keywords( $result ) {
		if ( $result['primary_keyword'] ) {
			$result['keywords'] = array( $result['primary_keyword'] );

			if ( in_array( 'keywords_score', $this->columns, true ) ) {
				$result['keywords_score'] = array( $this->get_rating_from_int_score( intval( $result['primary_keyword_score'] ) ) );
			}

			// Convert multiple keywords from the Premium plugin from json to string arrays.
			if ( array_key_exists( 'other_keywords', $result ) && $result['other_keywords'] ) {
				$keywords = json_decode( $result['other_keywords'], true );
				if ( $keywords ) {
					foreach( $keywords as $keyword ) {
						$result['keywords'][] = $keyword['keyword'];
						if ( in_array( 'keywords_score', $this->columns, true ) ) {
							$result['keywords_score'][] = $this->get_rating_from_string_score( $keyword['score'] );
						}
					}
				}
			}
		}

		// Unset all old variables, if they do not exist nothing will happen.
		unset( $result['primary_keyword'] );
		unset( $result['primary_keyword_score'] );
		unset( $result['other_keywords'] );

		return $result;
	}

	/**
	 * Converts an integer keyword score to a friendly rating.
	 *
	 * @param int $score A score, normally from 0 to 100.
	 *
	 * @return string
	 */
	protected function get_rating_from_int_score( $score ) {
		if ( ! is_int( $score ) ) {
			return __( 'none' );
		}

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
		if ( ! is_string( $score ) ) {
			return __( 'none' );
		}

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

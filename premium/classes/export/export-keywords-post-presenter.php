<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes\Export
 */

/**
 * Class WPSEO_Export_Keywords_Presenter
 *
 * Readies data as returned by WPSEO_Export_Keywords_Post_Query for exporting.
 */
class WPSEO_Export_Keywords_Post_Presenter implements WPSEO_Export_Keywords_Presenter {

	/**
	 * The columns to query for.
	 *
	 * @var array
	 */
	protected $columns;

	/**
	 * WPSEO_Export_Keywords_Post_Presenter constructor.
	 *
	 * Supported values for columns are 'title', 'url', 'keywords', 'readability_score' and 'keywords_score'.
	 * Requesting 'keywords_score' will always also return 'keywords'.
	 *
	 * @param array $columns The columns we want our query to return.
	 */
	public function __construct( array $columns ) {
		$this->columns = array_filter( $columns, 'is_string' );
	}

	/**
	 * Creates a presentable result by modifying and adding the requested fields.
	 *
	 * @param array $result The result to modify.
	 *
	 * @return array The modified result or an empty array if the result is considered invalid.
	 */
	public function present( array $result ) {
		if ( ! $this->validate_result( $result ) ) {
			return array();
		}

		foreach ( $this->columns as $column ) {
			$result = $this->prepare_column_result( $result, $column );
		}

		$result['type'] = $result['post_type'];
		unset( $result['post_type'] );

		return $result;
	}

	/**
	 * Prepares the passed result to make it more presentable.
	 *
	 * @param array  $result The result to modify.
	 * @param string $column The requested column.
	 *
	 * @return array The prepared result.
	 */
	protected function prepare_column_result( array $result, $column ) {
		switch ( $column ) {
			case 'title':
				$result['title'] = apply_filters( 'the_title', $result['post_title'], $result['ID'] );
				unset( $result['post_title'] );
				break;
			case 'url':
				$result['url'] = get_permalink( $result['ID'] );
				break;
			case 'readability_score':
				$result['readability_score'] = WPSEO_Rank::from_numeric_score( (int) $result['readability_score'] )->get_label();
				break;
			case 'keywords':
				$result = $this->convert_result_keywords( $result );
				break;
		}

		return $result;
	}

	/**
	 * Returns whether a result to present is a valid result.
	 *
	 * @param array $result The result to validate.
	 *
	 * @return bool True for a value valid result.
	 */
	protected function validate_result( array $result ) {
		// If there is no ID then it's not valid.
		if ( ! array_key_exists( 'ID', $result ) ) {
			return false;
		}

		// If a title is requested but not present then it's not valid.
		if ( $this->column_is_present( 'title' ) && $this->has_title( $result ) === false ) {
			return false;
		}

		return true;
	}

	/**
	 * Determines if the result contains a valid title.
	 *
	 * @param array $result The result array to check for a title.
	 *
	 * @return bool Whether or not a title is valid.
	 */
	protected function has_title( $result ) {
		if ( ! is_array( $result ) || ! array_key_exists( 'post_title', $result ) ) {
			return false;
		}

		return is_string( $result['post_title'] );
	}

	/**
	 * Determines if the wanted column exists within the $this->columns class variable.
	 *
	 * @param string $column The column to search for.
	 *
	 * @return bool Whether or not the column exists.
	 */
	protected function column_is_present( $column ) {
		if ( ! is_string( $column ) ) {
			return false;
		}

		return in_array( $column, $this->columns, true );
	}

	/**
	 * Converts the results of the query from strings and JSON string to keyword arrays.
	 *
	 * @param array $result The result to convert.
	 *
	 * @return array The converted result.
	 */
	protected function convert_result_keywords( array $result ) {
		$result['keywords'] = array();

		if ( $this->column_is_present( 'keywords_score' ) ) {
			$result['keywords_score'] = array();
		}

		if ( $this->has_primary_keyword( $result ) ) {
			$result['keywords'][] = $result['primary_keyword'];

			// Convert multiple keywords from the Premium plugin from json to string arrays.
			$keywords = $this->parse_result_keywords_json( $result, 'other_keywords' );

			$other_keywords     = wp_list_pluck( $keywords, 'keyword' );
			$result['keywords'] = array_merge( $result['keywords'], $other_keywords );

			if ( $this->column_is_present( 'keywords_score' ) ) {
				$result['keywords_score'] = $this->get_result_keywords_scores( $result, $keywords );
			}
		}

		// Unset all old variables, if they do not exist nothing will happen.
		unset( $result['primary_keyword'], $result['primary_keyword_score'], $result['other_keywords'] );

		return $result;
	}

	/**
	 * Determines whether there's a valid primary keyword present in the result array.
	 *
	 * @param array $result The result array to check for the primary_keyword key.
	 *
	 * @return bool Whether or not a valid primary keyword is present.
	 */
	protected function has_primary_keyword( $result ) {
		if ( ! is_array( $result ) || ! array_key_exists( 'primary_keyword', $result ) ) {
			return false;
		}

		return is_string( $result['primary_keyword'] ) && ! empty( $result['primary_keyword'] );
	}
	/**
	 * Parses then keywords JSON string in the result object for the specified key.
	 *
	 * @param array  $result The result object.
	 * @param string $key    The key containing the JSON.
	 *
	 * @return array The parsed keywords.
	 */
	protected function parse_result_keywords_json( array $result, $key ) {
		if ( empty( $result[ $key ] ) ) {
			return array();
		}

		$parsed = json_decode( $result[ $key ], true );

		if ( ! $parsed ) {
			return array();
		}

		return $parsed;
	}

	/**
	 * Returns an array of all scores from the result object and the parsed keywords JSON.
	 *
	 * @param array $result   The result object.
	 * @param array $keywords The parsed keywords.
	 *
	 * @return array  The keyword scores.
	 */
	protected function get_result_keywords_scores( array $result, $keywords ) {
		$scores = array();

		$rank     = WPSEO_Rank::from_numeric_score( (int) $result['primary_keyword_score'] );
		$scores[] = $rank->get_label();

		foreach ( $keywords as $keyword ) {
			$rank     = new WPSEO_Rank( $keyword['score'] );
			$scores[] = $rank->get_label();
		}

		return $scores;
	}
}

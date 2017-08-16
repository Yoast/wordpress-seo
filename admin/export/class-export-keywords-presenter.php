<?php
/**
 * @package WPSEO\Admin\Export
 */

/**
 * Class WPSEO_Export_Keywords_Presenter
 *
 * Readies data as returned by WPSEO_Export_Keywords_Query for exporting.
 */
class WPSEO_Export_Keywords_Presenter {
	/**
	 * @var array[int]string The columns to query for, an array of strings.
	 */
	protected $columns;

	/**
	 * WPSEO_Export_Keywords_Presenter constructor.
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
	 * Updates a result by modifying and adding the requested fields.
	 *
	 * @param array[string]string $result The result to modify.
	 *
	 * @return bool|array[string]string The modified result, false if the result could not be modified.
	 */
	public function present( $result ) {
		if ( ! $this->validate_result( $result ) ) {
			return false;
		}

		foreach ( $this->columns as $column ) {
			if ( ! is_string( $column ) ) {
				continue;
			}
			switch ( $column ) {
				case 'post_title':
					$result['post_title'] = apply_filters( 'the_title', $result['post_title'], $result['ID'] );
					break;
				case 'post_url':
					$result['post_url'] = get_permalink( $result['ID'] );
					break;
				case 'seo_score':
					$result['seo_score'] = WPSEO_Rank::from_numeric_score( intval( $result['seo_score'] ) )->get_rank();
					break;
				case 'keywords':
					$result = $this->convert_result_keywords( $result );
					break;
			}
		}

		return $result;
	}

	/**
	 * Returns whether a result to present is a valid result by doing a simple check.
	 *
	 * @param array[string]string $result The result to validate.
	 *
	 * @return bool
	 */
	protected function validate_result( $result ) {
		// If there is no ID then it's not valid.
		if ( ! is_array( $result ) || ! array_key_exists( 'ID', $result ) ) {
			return false;
		}

		// If a post_title is requested but not present then it's not valid.
		if ( in_array( 'post_title', $this->columns, true ) ) {
			if ( ! array_key_exists( 'post_title', $result ) || ! is_string( $result['post_title'] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Converts the results of the query from strings and JSON string to keyword arrays.
	 *
	 * @param array[string]string $result The result to convert.
	 *
	 * @return array[string]string The converted result.
	 */
	protected function convert_result_keywords( $result ) {
		$result['keywords'] = array();
		if ( in_array( 'keywords_score', $this->columns, true ) ) {
			$result['keywords_score'] = array();
		}

		if ( array_key_exists( 'primary_keyword', $result ) && $result['primary_keyword'] ) {
			$result['keywords'][] = $result['primary_keyword'];

			// Convert multiple keywords from the Premium plugin from json to string arrays.
			$keywords = $this->parse_result_keywords_json( $result, 'other_keywords' );
			foreach ( $keywords as $keyword ) {
				$result['keywords'][] = $keyword['keyword'];
			}

			if ( in_array( 'keywords_score', $this->columns, true ) ) {
				$rank = WPSEO_Rank::from_numeric_score( intval( $result['primary_keyword_score'] ) );
				$result['keywords_score'][] = $rank->get_rank();
				foreach ( $keywords as $keyword ) {
					$rank = new WPSEO_Rank( $keyword['score'] );
					$result['keywords_score'][] = $rank->get_rank();
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
	 * Parses keywords JSON in the result object from the specified key.
	 *
	 * @param array[string]string $result The result object.
	 * @param string              $key    The key containing the JSON.
	 *
	 * @return array[string]string The parsed keywords.
	 */
	protected function parse_result_keywords_json( $result, $key ) {
		if ( array_key_exists( $key, $result ) && $result[ $key ] ) {
			$parsed = json_decode( $result[ $key ], true );
			if ( $parsed ) {
				return $parsed;
			}
		}

		return array();
	}
}

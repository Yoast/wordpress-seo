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
		// If our input is malformed return false.
		if ( ! is_array( $result) || ! array_key_exists( 'ID', $result ) ) {
			return false;
		}

		// If post titles were selected run their filters.
		if ( in_array( 'post_title', $this->columns, true ) ) {
			if ( ! array_key_exists( 'post_title', $result ) || ! is_string( $result['post_title'] ) ) {
				return false;
			}

			$result['post_title'] = apply_filters( 'the_title', $result['post_title'], $result['ID'] );
		}

		// If post urls were selected add them to our results.
		if ( in_array( 'post_url', $this->columns, true ) ) {
			$result['post_url'] = get_permalink( $result['ID'] );
		}

		// If SEO scores were selected convert them to nice ratings.
		if ( in_array( 'seo_score', $this->columns, true ) ) {
			$result['seo_score'] = WPSEO_Rank::from_numeric_score( intval( $result['seo_score'] ) )->get_rank();
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
		$result['keywords'] = array();
		if ( in_array( 'keywords_score', $this->columns, true ) ) {
			$result['keywords_score'] = array();
		}

		if ( $result['primary_keyword'] ) {
			$result['keywords'][] = $result['primary_keyword'];

			if ( in_array( 'keywords_score', $this->columns, true ) ) {
				$result['keywords_score'][] = WPSEO_Rank::from_numeric_score( intval( $result['primary_keyword_score'] ) )->get_rank();
			}

			// Convert multiple keywords from the Premium plugin from json to string arrays.
			if ( array_key_exists( 'other_keywords', $result ) && $result['other_keywords'] ) {
				$keywords = json_decode( $result['other_keywords'], true );
				if ( $keywords ) {
					foreach( $keywords as $keyword ) {
						$result['keywords'][] = $keyword['keyword'];
						if ( in_array( 'keywords_score', $this->columns, true ) ) {
							$rank = new WPSEO_Rank( $keyword['score'] );
							$result['keywords_score'][] = $rank->get_rank();
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
}

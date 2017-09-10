<?php
/**
 * @package WPSEO\Premium\Classes\Export
 */

/**
 * Class WPSEO_Export_Keywords_Term_Presenter
 *
 * Readies data as returned by WPSEO_Export_Keywords_Term_Query for exporting.
 */
class WPSEO_Export_Keywords_Term_Presenter implements WPSEO_Export_Keywords_Presenter {

	/**
	 * @var array The columns to query for.
	 */
	protected $columns;

	/**
	 * WPSEO_Export_Keywords_Term_Presenter constructor.
	 *
	 * Supported values for columns are 'title', 'url', 'keywords', 'seo_score' and 'keywords_score'.
	 * Requesting 'keywords_score' will always also return 'keywords'.
	 *
	 * @param array $columns The columns we want our query to return.
	 */
	public function __construct( array $columns ) {
		$this->columns = array_filter( $columns, 'is_string' );
	}

	/**
	 * Updates a result by modifying and adding the requested fields.
	 *
	 * @param array $result The result to modify.
	 *
	 * @return array The modified result.
	 */
	public function present( array $result ) {
		if ( ! $this->validate_result( $result ) ) {
			return array();
		}

		$result['ID'] = (int) $result['term_id'];
		unset( $result['term_id'] );

		foreach ( $this->columns as $column ) {
			$result = $this->populate_column( $result, $column );
		}

		$result['type'] = $result['taxonomy'];
		unset( $result['taxonomy'] );

		return $result;
	}

	/**
	 * Updates a result by modifying and adding the requested column.
	 *
	 * @param array  $result The result to modify.
	 * @param string $column The requested column.
	 *
	 * @return array The modified result.
	 */
	protected function populate_column( array $result, $column ) {
		switch ( $column ) {
			case 'title':
				$result['title'] = $result['name'];
				unset( $result['name'] );
				break;
			case 'url':
				$result['url'] = get_term_link( $result['ID'], $result['taxonomy'] );
				break;
			case 'seo_score':
				$content_score = WPSEO_Taxonomy_Meta::get_term_meta( $result['ID'], $result['taxonomy'], 'content_score' );
				$result['seo_score'] = WPSEO_Rank::from_numeric_score( (int) $content_score )->get_label();
				break;
			case 'keywords':
				$result['keywords'] = $this->get_result_keywords( $result );
				break;
			case 'keywords_score':
				$result['keywords_score'] = $this->get_result_keywords_score( $result );
				break;
		}

		return $result;
	}

	/**
	 * Returns whether a result to present is a valid result.
	 *
	 * @param array $result The result to validate.
	 *
	 * @return bool True if the result is validated.
	 */
	protected function validate_result( array $result ) {
		// If there is no ID then it's not valid.
		if ( ! array_key_exists( 'term_id', $result ) ) {
			return false;
		}

		// If a title is requested but not present then it's not valid.
		if ( in_array( 'title', $this->columns, true ) ) {
			if ( ! array_key_exists( 'name', $result ) || ! is_string( $result['name'] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Gets the result keywords from WPSEO_Taxonomy_Meta.
	 *
	 * @param array $result The result to get the keywords for.
	 *
	 * @return array The keywords.
	 */
	protected function get_result_keywords( array $result ) {
		$keyword = WPSEO_Taxonomy_Meta::get_term_meta( $result['ID'], $result['taxonomy'], 'focuskw' );

		if ( $keyword === false || empty( $keyword ) ) {
			return array();
		}

		return array( (string) $keyword );
	}

	/**
	 * Gets the result keyword scores from WPSEO_Taxonomy_Meta.
	 *
	 * @param array $result The result to get the keyword scores for.
	 *
	 * @return array The keyword scores.
	 */
	protected function get_result_keywords_score( array $result ) {
		$keyword_score = WPSEO_Taxonomy_Meta::get_term_meta( $result['ID'], $result['taxonomy'], 'linkdex' );

		if ( $keyword_score === false || empty( $keyword_score ) ) {
			return array();
		}

		$keyword_score_label = WPSEO_Rank::from_numeric_score( (int) $keyword_score )->get_label();
		return array( $keyword_score_label );
	}
}

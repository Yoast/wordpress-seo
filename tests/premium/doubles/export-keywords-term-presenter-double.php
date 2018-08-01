<?php
/**
 * WPSEO Premium plugin test file.
 *
 * @package WPSEO\Tests\Premium\Doubles
 */

/**
 * Class WPSEO_Export_Keywords_Presenter_Double
 *
 * A double for testing protected method.
 */
class WPSEO_Export_Keywords_Term_Presenter_Double extends WPSEO_Export_Keywords_Term_Presenter {

	/**
	 * Returns whether a result to present is a valid result.
	 *
	 * @param array $result The result to validate.
	 *
	 * @return bool True if the result is validated.
	 */
	public function return_validate_result( $result ) {
		return $this->validate_result( $result );
	}

	/**
	 * Gets the result keywords from WPSEO_Taxonomy_Meta.
	 *
	 * @param array $result The result to get the keywords for.
	 *
	 * @return array The keywords.
	 */
	public function return_get_result_keywords( $result ) {
		return $this->get_result_keywords( $result );
	}

	/**
	 * Gets the result keyword scores from WPSEO_Taxonomy_Meta.
	 *
	 * @param array $result The result to get the keyword scores for.
	 *
	 * @return array The keyword scores.
	 */
	public function return_get_result_keywords_score( $result ) {
		return $this->get_result_keywords_score( $result );
	}
}

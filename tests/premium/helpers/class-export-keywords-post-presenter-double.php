<?php
/**
 * @package WPSEO\Tests\Premium\Helpers
 */

/**
 * Class WPSEO_Export_Keywords_Presenter_Double
 *
 * A double for testing protected method.
 */
class WPSEO_Export_Keywords_Post_Presenter_Double extends WPSEO_Export_Keywords_Post_Presenter {

	/**
	 * Returns whether a result to present is a valid result.
	 *
	 * @param array $result The result to validate.
	 *
	 * @return bool True for a value valid result.
	 */
	public function return_validate_result( $result ) {
		return $this->validate_result( $result );
	}

	/**
	 * Converts the results of the query from strings and JSON string to keyword arrays.
	 *
	 * @param array $result The result to convert.
	 *
	 * @return array The converted result.
	 */
	public function return_convert_result_keywords( $result ) {
		return $this->convert_result_keywords( $result );
	}
}

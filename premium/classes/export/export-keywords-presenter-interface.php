<?php
/**
 * @package WPSEO\Premium\Classes\Export
 */

/**
 * Interface WPSEO_Export_Keywords_Presenter
 *
 * Readies data as returned by WPSEO_Export_Keywords_Query for exporting.
 */
interface WPSEO_Export_Keywords_Presenter {

	/**
	 * WPSEO_Export_Keywords_Presenter constructor.
	 *
	 * Supported values for columns are 'title', 'url', 'keywords', 'readability_score' and 'keywords_score'.
	 * Requesting 'keywords_score' will always also return 'keywords'.
	 *
	 * @param array $columns The columns we want our query to return.
	 */
	public function __construct( array $columns );

	/**
	 * Updates a result by modifying and adding the requested fields.
	 *
	 * @param array $result The result to modify.
	 *
	 * @return array The modified result.
	 */
	public function present( array $result );
}

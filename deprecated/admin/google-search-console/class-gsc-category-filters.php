<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Category_Filters.
 *
 * This class will get all category counts from the options and will parse the filter links that are displayed above
 * the crawl issue tables.
 *
 * @deprecated 12.5
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Category_Filters {

	/**
	 * Constructing this object.
	 *
	 * Setting the hook to create the issues categories as the links.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param array $platform_counts Set of issue counts by platform.
	 */
	public function __construct( array $platform_counts ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Returns the value of the current category.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return mixed|string
	 */
	public function get_category() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return '';
	}

	/**
	 * Returns the current filters as an array.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * Only return categories with more than 0 issues.
	 *
	 * @return array
	 */
	public function as_array() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return array();
	}
}

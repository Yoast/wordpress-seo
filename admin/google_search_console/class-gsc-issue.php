<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Issue.
 *
 * @deprecated 11.4
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Issue {

	/**
	 * Search Console issue class constructor.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string   $url            URL of the issue.
	 * @param DateTime $first_detected Time of first discovery.
	 * @param DateTime $last_crawled   Time of last crawl.
	 * @param string   $response_code  HTTP response code.
	 */
	public function __construct( $url, DateTime $first_detected, DateTime $last_crawled, $response_code ) {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Put the class properties in array.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public function to_array() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return array();
	}
}

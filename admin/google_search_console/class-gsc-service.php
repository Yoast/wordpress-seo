<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Service.
 *
 * @deprecated 11.4
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Service {

	/**
	 * Search Console service constructor.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $profile Profile name.
	 */
	public function __construct( $profile = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Returns the client.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return Yoast_Api_Google_Client
	 */
	public function get_client() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return null;
	}

	/**
	 * Removes the option and calls the clients clear_data method to clear that one as well.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	public function clear_data() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Get all sites that are registered in the GSC panel.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public function get_sites() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return array();
	}

	/**
	 * Get crawl issues.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public function get_crawl_issue_counts() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return array();
	}

	/**
	 * Sending request to mark issue as fixed.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $url      Issue URL.
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 * @param string $category Issue type.
	 *
	 * @return bool
	 */
	public function mark_as_fixed( $url, $platform, $category ) {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return false;
	}

	/**
	 * Fetching the issues from the GSC API.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 * @param string $category Issue type.
	 *
	 * @return mixed
	 */
	public function fetch_category_issues( $platform, $category ) {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return array();
	}
}

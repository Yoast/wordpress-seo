<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Count.
 *
 * @deprecated 12.5
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Count {

	/**
	 * The name of the option containing the last checked timestamp.
	 *
	 * @var string
	 */
	const OPTION_CI_LAST_FETCH = 'wpseo_gsc_last_fetch';

	/**
	 * The option name where the issues counts are saved.
	 *
	 * @var string
	 */
	const OPTION_CI_COUNTS = 'wpseo_gsc_issues_counts';

	/**
	 * Fetching the counts
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param WPSEO_GSC_Service $service Service class instance.
	 */
	public function __construct( WPSEO_GSC_Service $service ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Getting the counts for given platform and return them as an array.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 *
	 * @return array
	 */
	public function get_platform_counts( $platform ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return [];
	}

	/**
	 * Return the fetched issues.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public function get_issues() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return $this->issues;
	}

	/**
	 * Listing the issues an gives them back as fetched issues.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 * @param string $category Issue category.
	 */
	public function list_issues( $platform, $category ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Getting the counts for given platform and category.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $platform Platform (desktop, mobile, feature phone).
	 * @param string $category Issue type.
	 *
	 * @return integer
	 */
	public function get_issue_count( $platform, $category ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return 0;
	}

	/**
	 * Update the count of the issues.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string  $platform  Platform (desktop, mobile, feature phone).
	 * @param string  $category  Issue type.
	 * @param integer $new_count Updated count.
	 */
	public function update_issue_count( $platform, $category, $new_count ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Fetching the counts from the GSC API.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 */
	public function fetch_counts() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Issues.
 *
 * @deprecated 12.5
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Issues {

	/**
	 * Setting up the properties and fetching the current issues.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string     $platform       Platform type (desktop, mobile, feature phone).
	 * @param string     $category       Issues category.
	 * @param array|bool $fetched_issues Optional set of issues.
	 */
	public function __construct( $platform, $category, $fetched_issues = false ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Getting the issues from the options.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array
	 */
	public function get_issues() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return [];
	}

	/**
	 * Deleting the issue from the issues.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $url URL to delete issues for.
	 *
	 * @return bool
	 */
	public function delete_issue( $url ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return false;
	}
}

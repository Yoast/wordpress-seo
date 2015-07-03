<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_Crawl_Issue_Count
 */
class WPSEO_Crawl_Issue_Count {

	// The last checked timestamp.
	const OPTION_CI_LAST_FETCH = 'wpseo_crawl_issues_last_fetch';

	// The option name where the issues counts are saved.
	const OPTION_CI_COUNTS     = 'wpseo_crawl_issues_counts';

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;

	/**
	 * Holder for the fetched issues from GSC
	 *
	 * @var array
	 */
	private $issues = array();

	/**
	 * Fetching the counts
	 *
	 * @param WPSEO_GWT_Service $service
	 * @param string            $platform
	 * @param string            $category
	 */
	public function __construct( WPSEO_GWT_Service $service, $platform, $category ) {
		$this->service = $service;

		$this->fetch_counts();

		$this->list_issues( $platform, $category );
	}

	/**
	 * Return the fetched issues
	 *
	 * @return array
	 */
	public function get_issues() {
		return $this->issues;
	}

	/**
	 * Fetching the counts from the GWT API
	 */
	private function fetch_counts() {
		if ( WPSEO_GWT_Settings::get_profile() && $this->get_last_fetch() <= strtotime( '-12 hours' ) ) {
			// Remove the timestamp.
			$this->remove_last_fetch();

			// Fetching the counts by setting an option.
			$this->set_counts( $this->service->get_crawl_issue_counts() );

			// Saving the current timestamp.
			$this->save_last_fetch();
		}
	}

	/**
	 * Remove the last checked option
	 */
	private function remove_last_fetch() {
		delete_option( self::OPTION_CI_LAST_FETCH );
	}

	/**
	 * Listing the issues an gives them back as fetched issues
	 *
	 * @param string $platform
	 * @param string $category
	 */
	private function list_issues( $platform, $category ) {
		$counts = $this->get_counts();

		if ( array_key_exists( $platform, $counts ) ) {
			$counts[ $platform ] = $this->list_category_issues( $counts[ $platform ], $platform, $category );

			// Write the new counts value.
			$this->set_counts( $counts );
		}
	}

	/**
	 * Listing the issues for current category.
	 *
	 * @param array  $counts
	 * @param string $platform
	 * @param string $category
	 *
	 * @return array
	 */
	private function list_category_issues( array $counts, $platform, $category ) {
		// When the issues have to be fetched.
		if ( array_key_exists( $category, $counts ) && $counts[ $category ]['count'] > 0 && $counts[ $category ]['last_fetch'] <= strtotime( '-12 hours' ) ) {
			if ( $issues = $this->service->fetch_category_issues( $platform, $category ) ) {
				$this->issues = $issues;
			}

			// Set last fetch.
			$counts[ $category ]['last_fetch'] = time();
		}

		return $counts;
	}

	/**
	 * Getting the counts from the options
	 *
	 * @return array
	 */
	private function get_counts() {
		return get_option( self::OPTION_CI_COUNTS, array() );
	}

	/**
	 * Fetching the counts from the service and store them in an option
	 *
	 * @param array $counts
	 */
	private function set_counts( array $counts ) {
		update_option( self::OPTION_CI_COUNTS, $counts );
	}

	/**
	 * Store the timestamp of when crawl errors were saved the last time.
	 */
	private function save_last_fetch() {
		add_option( self::OPTION_CI_LAST_FETCH, time(), '', 'no' );
	}

	/**
	 * Get the timestamp of when the crawl errors were last saved
	 *
	 * @return int
	 */
	private function get_last_fetch() {
		return get_option( self::OPTION_CI_LAST_FETCH, 0 );
	}

}

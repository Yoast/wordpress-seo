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
	 * Fetching the counts
	 *
	 * @param WPSEO_GWT_Service $service
	 */
	public function __construct( WPSEO_GWT_Service $service ) {
		$this->fetch_counts( $service );
	}

	/**
	 * Getting the counts from the options
	 *
	 * @return array
	 */
	public function get_counts() {
		return get_option( self::OPTION_CI_COUNTS, array() );
	}

	/**
	 * Fetching the counts from the service and store them in an option
	 *
	 * @param array $counts
	 */
	public function set_counts( array $counts ) {
		update_option( self::OPTION_CI_COUNTS, $counts );
	}

	/**
	 * Fetching the counts from the GWT API
	 *
	 * @param WPSEO_GWT_Service $service
	 */
	private function fetch_counts( WPSEO_GWT_Service $service ) {
		if ( $service->get_profile() && $this->get_last_fetch() <= strtotime( '-12 hours' ) ) {
			// Remove the timestamp.
			$this->remove_last_fetch();

			// Fetching the counts by setting an option.
			$this->set_counts( $service->get_crawl_issue_counts() );

			// Saving the current timestamp.
			$this->save_last_fetch();
		}
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

	/**
	 * Remove the last checked option
	 */
	private function remove_last_fetch() {
		delete_option( self::OPTION_CI_LAST_FETCH );
	}

}

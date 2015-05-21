<?php

class WPSEO_Crawl_Issue_Count {

	// The last checked timestamp
	CONST OPTION_CI_LAST_FETCH = 'wpseo_crawl_issues_last_fetch';

	CONST OPTION_CI_COUNTS     = 'wpseo_crawl_issues_counts';

	/**
	 * @var string
	 */
	private $platform;

	/**
	 *
	 * @param WPSEO_GWT_Service $service
	 * @param string            $platform
	 */
	public function __construct( WPSEO_GWT_Service $service, $platform ) {
		$this->platform = $platform;

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

		if ( $this->should_fetch( $this->get_last_fetch() ) ) {
			// Remove the timestamp
			$this->remove_last_fetch();

			// Fetching the counts by setting an option
			$this->set_counts( $service->get_crawl_issue_counts() );

			// Saving the current timestamp
			$this->save_last_fetch();
		}
	}

	/**
	 * Store the timestamp of when crawl errors were saved
	 */
	private function save_last_fetch() {
		$this->remove_last_fetch();
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

	/**
	 * Check if given date is later then 12 hours ago.
	 *
	 * @param int $last_fetch
	 *
	 * @return bool
	 */
	private function should_fetch( $last_fetch ) {
		return ( $last_fetch <= strtotime( '-12 hours' ) );
	}

}
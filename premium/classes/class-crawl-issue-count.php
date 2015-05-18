<?php

class WPSEO_Crawl_Issue_Count {

	/**
	 * @var WPSEO_GWT_Service
	 */
	private $service;


	// The last checked timestamp
	CONST OPTION_CI_LAST_FETCH = 'wpseo_crawl_issues_last_fetch';

	CONST OPTION_CI_COUNTS     = 'wpseo_crawl_issues_counts';

	/**
	 *
	 * @param WPSEO_GWT_Service $service
	 */
	public function __construct( WPSEO_GWT_Service $service ) {

		add_action( 'wpseo_gwt_reset_data', array( $this, 'clear_counts' ) );

		if ( $this->get_last_fetch() <= strtotime( '-12 hours' ) ) {
			$this->service = $service;

			// Remove the timestamp
			$this->remove_last_fetch();

			// Fetching the counts by setting an options
			$this->fetch_counts();

			// Saving the current timestamp
			$this->save_last_fetch();
		}

	}

	/**
	 * This method will be called by a filter hook and is for removing the counts
	 */
	public function clear_counts() {
		// Remove the options which is holding the counts
		delete_option( self::OPTION_CI_COUNTS );

		// Reset the date with last fetch also
		$this->remove_last_fetch();
	}

	/**
	 * Fetching the counts from the service and store them in an option
	 */
	private function fetch_counts() {
		update_option( self::OPTION_CI_COUNTS, $this->service->get_crawl_issue_counts() );
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

}
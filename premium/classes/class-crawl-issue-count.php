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
	 * All the categories
	 * @var array|void
	 */
	private $issues = array();

	/**
	 * @var string
	 */
	private $platform;

	/**
	 * @var string
	 */
	private $category;

	/**
	 *
	 * @param WPSEO_GWT_Service $service
	 * @param string            $platform
	 * @param string            $category
	 */
	public function __construct( WPSEO_GWT_Service $service, $platform, $category ) {

		add_action( 'wpseo_gwt_reset_data', array( $this, 'clear_counts' ) );

		$this->platform = $platform;
		$this->category = $category;

		if ( filter_input( INPUT_POST, 'reload-crawl-issues' ) ) {
			$this->remove_last_fetch();
		}

		$this->fetch_counts( $service );

		// Listing the issues
		$this->list_issues();
	}

	/**
	 * Getting the array with all the issues for current platform - category
	 *
	 * @return array|void
	 */
	public function get_issues() {
		return $this->issues;
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
	 * Fetching the counts from the GWT API
	 *
	 * @param WPSEO_GWT_Service $service
	 */
	private function fetch_counts( WPSEO_GWT_Service $service ) {
		if ( $this->should_fetch( $this->get_last_fetch() ) ) {
			$this->service = $service;

			// Remove the timestamp
			$this->remove_last_fetch();

			// Fetching the counts by setting an option
			$this->set_counts( $this->service->get_crawl_issue_counts() );

			// Saving the current timestamp
			$this->save_last_fetch();
		}
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
	 * Listing the issues from the database
	 *
	 */
	private function list_issues() {
		$counts = $this->get_counts();

		if ( array_key_exists( $this->platform, $counts ) ) {
			$counts[ $this->platform ] = $this->list_category_issues( $counts[ $this->platform ] );

			// Write the new counts value;
			$this->set_counts( $counts );
		}
	}

	/**
	 * Listing the issues for current category.

	 * @param array $counts
	 *
	 * @return mixed
	 */
	private function list_category_issues( $counts ) {
		// Fetching the issues
		$issue_crawler = new WPSEO_Crawl_Category_Issues( $this->platform, $this->category );

		// When the issues have to be fetched
		if ( array_key_exists( $this->category, $counts ) && $counts[ $this->category ]['count'] > 0 && $this->should_fetch( $counts[ $this->category ]['last_fetch'] )  ) {
			$this->issues = $issue_crawler->fetch_issues();

			// Set last fetch
			$counts[ $this->category ]['last_fetch'] = time();
		}

		$this->issues = $issue_crawler->get_issues();

		return $counts;
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
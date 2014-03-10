<?php

/**
 * Class WPSEO_Crawl_Issue_Manager
 *
 * @todo create a timestamp in DB where is saved last time GWT was checked for errors. > 1 day ago recheck, manual checking button will also be created.
 */
class WPSEO_Crawl_Issue_Manager {

	const OPTION_CRAWL_ISSUES = 'wpseo_crawl_issues';
	const OPTION_CI_TS				= 'wpseo_crawl_issues_last_checked';

	/**
	 * Get the timestamp of when the crawl errors were last saved
	 *
	 * @return int
	 */
	private function get_last_checked() {
		return get_option( self::OPTION_CI_TS, 0 );
	}

	/**
	 * Store the timestamp of when crawl errors were saved
	 */
	private function save_last_checked() {
		delete_option( self::OPTION_CI_TS );
		add_option( self::OPTION_CI_TS, time(), '', 'no' );
	}

	/**
	 * Save the crawl issues
	 *
	 * @param  array <WPSEO_Crawl_Issue> $crawl_issues
	 *
	 * @todo We might want to return $crawl_issues here, and use that in get_crawl_issues(). Will prevent an extra query.
	 */
	private function save_crawl_issues() {

		// Create a the service object
		$service = new WPSEO_GWT_Service( $this->gwt );

		// Get the site url
		// @todo This wil be an option in 1.1
		$site_url     = trailingslashit( get_option( 'siteurl' ) );

		// Get crawl issues
		$crawl_issues = $service->get_crawl_issues( $site_url );

		// Format the array with WPSEO_Crawl_Issue objects to an multidimensional array
		$crawl_issues_db = array();
		if ( count( $crawl_issues ) > 0 ) {
			foreach ( $crawl_issues as $crawl_issue ) {
				$crawl_issues_db[] = $crawl_issue->to_array();
			}
		}

		// Save the crawl issues
		if ( false === get_option( self::OPTION_CRAWL_ISSUES ) ) {
			add_option( self::OPTION_CRAWL_ISSUES, $crawl_issues_db, '', 'no' );
		} else {
			update_option( self::OPTION_CRAWL_ISSUES, $crawl_issues_db );
		}
	}

	/**
	 * Get the crawl issues
	 *
	 * @return array<WPSEO_Crawl_Issue>
	 */
	public function get_crawl_issues() {
		$crawl_issues    = array();

		// @todo check last synced timestamp
		$ci_ts = $this->get_last_checked();

		// Last time we checked the crawl errors more then one day ago? Check again.
		if ( $ci_ts <= strtotime( "-1 day" ) ) {
			$this->save_crawl_issues();
		}

		// Get crawl issues from DB
		$crawl_issues_db = get_option( self::OPTION_CRAWL_ISSUES, array() );

		// Create array
		if ( count( $crawl_issues_db ) > 0 ) {
			foreach ( $crawl_issues_db as $crawl_issues_db_item ) {
				$crawl_issues = new WPSEO_Crawl_Issue( $crawl_issues_db_item['url'], $crawl_issues_db_item['crawl_type'], $crawl_issues_db_item['issue_type'], $crawl_issues_db_item['date_detected'], $crawl_issues_db_item['detail'], $crawl_issues_db_item['linked_from'] );
			}
		}

		return $crawl_issues;
	}

}
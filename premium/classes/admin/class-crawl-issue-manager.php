<?php

/**
 * Class WPSEO_Crawl_Issue_Manager
 *
 * @todo create a timestamp in DB where is saved last time GWT was checked for errors. > 1 day ago recheck, manual checking button will also be created.
 */
class WPSEO_Crawl_Issue_Manager {

	const OPTION_CRAWL_ISSUES = 'wpseo_crawl_issues';

	/**
	 * Get the crawl issues
	 *
	 * @return array<WPSEO_Crawl_Issue>
	 */
	public function get_crawl_issues() {
		$crawl_issues    = array();
		$crawl_issues_db = get_option( self::OPTION_CRAWL_ISSUES, array() );

		// Create array
		if ( count( $crawl_issues_db ) > 0 ) {
			foreach ( $crawl_issues_db as $crawl_issues_db_item ) {
				$crawl_issues = new WPSEO_Crawl_Issue( $crawl_issues_db_item['url'], $crawl_issues_db_item['crawl_type'], $crawl_issues_db_item['issue_type'], $crawl_issues_db_item['date_detected'], $crawl_issues_db_item['detail'], $crawl_issues_db_item['linked_from'] );
			}
		}

		return $crawl_issues;
	}

	/**
	 * Save the crawl issues
	 *
	 * @param  array <WPSEO_Crawl_Issue> $crawl_issues
	 */
	public function save_crawl_issues( $crawl_issues ) {

		// Format the array with WPSEO_Crawl_Issue objects to an multidimensional array
		$crawl_issues_db = array();
		if ( count( $crawl_issues ) > 0 ) {
			foreach ( $crawl_issues as $crawl_issue ) {
				$crawl_issues_db[] = $crawl_issue->to_array();
			}
		}

		// Save the crawl issues
		if ( false === get_option( self::OPTION_CRAWL_ISSUES ) ) {
			add_option( self::OPTION_CRAWL_ISSUES, $crawl_issues_db, '', false );
		} else {
			update_option( self::OPTION_CRAWL_ISSUES, $crawl_issues_db );
		}
	}

}
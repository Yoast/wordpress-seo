<?php

/**
 * Class WPSEO_Crawl_Issue_Manager
 */
class WPSEO_Crawl_Issue_Manager {

	// The last checked timestamp
	const OPTION_CI_TS = 'wpseo_crawl_issues_last_checked';

	/**
	 * Constructing the object
	 *
	 * @param bool $catch_post
	 */
	public function __construct( $catch_post = false ) {
		if ( $catch_post && filter_input( INPUT_POST, 'reload-crawl-issues' ) ) {
			$this->remove_last_checked();
		}

		$this->crawl_issues();
	}

	/**
	 * Getting the GWT service object and store them into a static var
	 *
	 * @return WPSEO_GWT_Service
	 */
	public function get_service() {
		static $service;

		if ( $service === null ) {
			// Create a the service object
			$service = new WPSEO_GWT_Service();
		}

		return $service;
	}

	/**
	 * Store the timestamp of when crawl errors were saved
	 */
	public function save_last_checked() {
		$this->remove_last_checked();
		add_option( self::OPTION_CI_TS, time(), '', 'no' );
	}

	/**
	 * Get the crawl issues
	 *
	 * @param array $crawl_issues_db
	 *
	 * @return array<WPSEO_Crawl_Issue>
	 */
	public function get_crawl_issues( $crawl_issues_db ) {
		$crawl_issues = array();

		// Convert WP posts to WPSEO_Crawl_Issue objects
		if ( count( $crawl_issues_db ) > 0 ) {
			foreach ( $crawl_issues_db as $crawl_issues_db_item ) {
				$crawl_issues[] = new WPSEO_Crawl_Issue(
					$crawl_issues_db_item->post_title,
					get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_PLATFORM, true ),
					get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_CATEGORY, true ),
					new DateTime( (string) get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_FIRST_DETECTED, true ) ),
					new DateTime( (string) get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_LAST_CRAWLED, true ) ),
					get_post_meta( $crawl_issues_db_item->ID, WPSEO_Crawl_Issue::PM_CI_RESPONSE_CODE, true )
				);
			}
		}

		return $crawl_issues;
	}

	/**
	 * Sanitize the profile callback, when this is not, the last_checked option have to be removed to be sure
	 * the correct issues will be loaded
	 *
	 * @param array $setting
	 */
	public function sanitize_callback( array $setting ) {
		// Remove last check if new profile is selected
		if ( $this->get_service()->get_profile() != $setting['profile'] ) {
			$this->remove_last_checked();
		}
	}

	/**
	 * Check if current request isn't AJAX and if last run isn't performed less than a day ago.
	 */
	private function crawl_issues() {
		if ( ( defined( 'DOING_AJAX' ) && DOING_AJAX ) === false && $this->get_last_checked() <= strtotime( '-1 day' ) ) {
			echo "<script type='text/javascript'>wpseo_get_issue_counts();</script>";
		}
	}

	/**
	 * Get the timestamp of when the crawl errors were last saved
	 *
	 * @return int
	 */
	private function get_last_checked() {
		return get_option( self::OPTION_CI_TS, 0 );
	}

	/**
	 * Remove the last checked option
	 */
	private function remove_last_checked() {
		delete_option( self::OPTION_CI_TS );
	}

}
<?php

/**
 * Class WPSEO_Crawl_Issue_Manager
 */
class WPSEO_Crawl_Issue_Manager {

	// Post Type related constants
	const PT_CRAWL_ISSUE = 'wpseo_crawl_issue';

	// Post Meta related constants
	const PM_CI_URL           = 'wpseo_ci_url';
	const PM_CI_PLATFORM      = 'wpseo_ci_crawl_type';		// @todo rename value
	const PM_CI_CATEGORY      = 'wpseo_ci_issue_type';		// @todo rename value
	const PM_CI_DATE_DETECTED = 'wpseo_ci_date_detected';
	const PM_CI_RESPONSE_CODE = 'wpseo_ci_detail'; 			// @todo rename value
	const PM_CI_LINKED_FROM   = 'wpseo_ci_linked_from';

	// The last checked timestamp
	const OPTION_CI_TS = 'wpseo_crawl_issues_last_checked';

	/**
	 * @var array
	 */
	private $crawl_issue_urls = array();

	/**
	 * Get the crawl issues
	 *
	 * @param Yoast_Google_Client $gwt
	 * @param array               $issues
	 *
	 * @return array<WPSEO_Crawl_Issue>
	 */
	public function get_crawl_issues( Yoast_Google_Client $gwt, $issues ) {

		// Get last checked timestamp
		$ci_ts = $this->get_last_checked();

		// Last time we checked the crawl errors more then one day ago? Check again.
		if ( $ci_ts <= strtotime( '-1 day' ) ) { // @todo add a $_GET check here
			$this->save_crawl_issues( $gwt );
		}

		// Return the parsed issues from DB
		return $this->parse_db_crawl_issues( $issues );
	}

	/**
	 * Remove the last checked option
	 */
	public function remove_last_checked() {
		delete_option( self::OPTION_CI_TS );
	}

	/**
	 * This method will be access by an AJAX request and will mark an issue as fixed.
	 *
	 * First it will do a request to the Google API
	 *
	 * @param string $url
	 */
	public function ajax_mark_as_fixed( ) {
		new WPSEO_Crawl_Issue_Marker();
	}

	/**
	 * Save the crawl issues
	 *
	 * @param Yoast_Google_Client $gwt
	 */
	private function save_crawl_issues( Yoast_Google_Client $gwt ) {
		// Create a the service object
		$service = new WPSEO_GWT_Service( $gwt );

		// Get crawl issues
		$crawl_issues = $service->get_crawl_issues();

		// Store the urls of crawl issues
		$this->crawl_issue_urls = array();

		// Mutate and save the crawl issues
		if ( count( $crawl_issues ) > 0 ) {
			foreach ( $crawl_issues as $crawl_issue ) {
				$this->save_crawl_issue( $crawl_issue );
			}
		}

		// Delete the crawl issues
		$this->delete_crawl_issues();

		// Save the last checked
		$this->save_last_checked();
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
	 * Store the timestamp of when crawl errors were saved
	 */
	private function save_last_checked() {
		$this->remove_last_checked();
		add_option( self::OPTION_CI_TS, time(), '', 'no' );
	}

	/**
	 * Updating the post meta
	 *
	 * @param integer  $ci_post_id
	 * @param stdClass $crawl_issue
	 */
	private function update_post_meta( $ci_post_id, $crawl_issue ) {
		// Update all the meta data
		update_post_meta( $ci_post_id, self::PM_CI_PLATFORM, $crawl_issue->get_crawl_type() );
		update_post_meta( $ci_post_id, self::PM_CI_CATEGORY, $crawl_issue->get_issue_type() );
		update_post_meta( $ci_post_id, self::PM_CI_DATE_DETECTED, (string) strftime( '%x', strtotime( $crawl_issue->get_date_detected()->format( 'Y-m-d H:i:s' ) ) ) );
		update_post_meta( $ci_post_id, self::PM_CI_RESPONSE_CODE, $crawl_issue->get_response_code() );
		update_post_meta( $ci_post_id, self::PM_CI_LINKED_FROM, $crawl_issue->get_linked_from() );
	}

	/**
	 * Parsing the issues from the DB to display on screen
	 *
	 * @param array $crawl_issues_db
	 *
	 * @return array
	 */
	private function parse_db_crawl_issues( array $crawl_issues_db ) {
		$crawl_issues = array();

		// Convert WP posts to WPSEO_Crawl_Issue objects
		if ( count( $crawl_issues_db ) > 0 ) {
			foreach ( $crawl_issues_db as $crawl_issues_db_item ) {
				$crawl_issues[] = new WPSEO_Crawl_Issue(
					$crawl_issues_db_item->post_title,
					get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_PLATFORM, true ),
					get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_CATEGORY, true ),
					new DateTime( (string) get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_DATE_DETECTED, true ) ),
					get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_RESPONSE_CODE, true ),
					get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_LINKED_FROM, true ),
					false
				);
			}
		}

		return $crawl_issues;
	}

	/**
	 * Saving the crawl issue in the database
	 *
	 * @param WPSEO_Crawl_Issue $crawl_issue
	 */
	private function save_crawl_issue( WPSEO_Crawl_Issue $crawl_issue ) {
		$ci_post_id = post_exists( $crawl_issue->get_url() );

		// Check if the post exists
		if ( 0 === $ci_post_id ) {
			// Create the post
			$ci_post_id = wp_insert_post( array(
				'post_type'   => self::PT_CRAWL_ISSUE,
				'post_title'  => $crawl_issue->get_url(),
				'post_status' => 'publish',
			) );
		}

		$this->update_post_meta( $ci_post_id, $crawl_issue );

		// Store the url in $crawl_issue_urls
		if ( in_array( $crawl_issue->get_url(), $this->crawl_issue_urls ) === false ) {
			$this->crawl_issue_urls[] = $crawl_issue->get_url();
		}
	}

	/**
	 * Deleting the crawl issues
	 */
	private function delete_crawl_issues() {
		global $wpdb;

		// Remove local crawl issues that are not in the Google response
		$sql_raw = "DELETE FROM `{$wpdb->posts}` WHERE `post_type` = '" . self::PT_CRAWL_ISSUE . "'";

		if ( count( $this->crawl_issue_urls ) > 0 ) {
			$sql_raw .= ' AND `post_title` NOT IN (' . implode( ', ', array_fill( 0, count( $this->crawl_issue_urls ), '%s' ) ) . ')';

			// Format the SQL
			$sql = call_user_func_array( array( $wpdb, 'prepare' ), array_merge( array( $sql_raw ), $this->crawl_issue_urls ) );
		}
		else {
			$sql = $sql_raw;
		}

		// Run the delete SQL
		$wpdb->query( $sql );
	}

}
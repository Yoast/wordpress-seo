<?php

/**
 * Class WPSEO_Crawl_Issue_Manager
 *
 * @todo Put the ignores in an option so we safely remove all posts
 */
class WPSEO_Crawl_Issue_Manager {

	// Post type related constants
	const PT_CRAWL_ISSUE      = 'wpseo_crawl_issue';
	const PM_CI_URL           = 'wpseo_ci_url';
	const PM_CI_CRAWL_TYPE    = 'wpseo_ci_crawl_type';
	const PM_CI_ISSUE_TYPE    = 'wpseo_ci_issue_type';
	const PM_CI_DATE_DETECTED = 'wpseo_ci_date_detected';
	const PM_CI_DETAIL        = 'wpseo_ci_detail';
	const PM_CI_LINKED_FROM   = 'wpseo_ci_linked_from';

	// The last checked timestamp
	const OPTION_CI_TS = 'wpseo_crawl_issues_last_checked';

	/**
	 * @var WPSEO_GWT_Google_Client $gwt
	 */
	private $gwt;

	/**
	 * Constructor
	 *
	 * @param WPSEO_GWT_Google_Client $gwt
	 */
	public function __construct( WPSEO_GWT_Google_Client $gwt ) {
		$this->gwt = $gwt;
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
		delete_option( self::OPTION_CI_TS );
		add_option( self::OPTION_CI_TS, time(), '', 'no' );
	}

	/**
	 * Save a crawl issue
	 *
	 * @param WPSEO_Crawl_Issue $crawl_issue
	 *
	 * @return bool
	 */
	private function save_crawl_issue( WPSEO_Crawl_Issue $crawl_issue ) {
		return true;
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
		$site_url = trailingslashit( get_option( 'siteurl' ) );

		// Get crawl issues
		$crawl_issues = $service->get_crawl_issues( $site_url );

		// Delete old crawl issues
		$current_crawl_issues = get_posts( array( 'post_type' => self::PT_CRAWL_ISSUE, 'posts_per_page' => - 1 ) );
		if ( count( $current_crawl_issues ) > 0 ) {
			foreach ( $current_crawl_issues as $current_crawl_issue ) {
				wp_delete_post( $current_crawl_issue->ID, true );
			}
		}

		// Mutate and save the crawl issues
		if ( count( $crawl_issues ) > 0 ) {

			foreach ( $crawl_issues as $crawl_issue ) {

				/**
				 * @var WPSEO_Crawl_Issue $crawl_issue
				 */

				// Create the post
				$ci_post_id = wp_insert_post( array(
						'post_type'   => self::PT_CRAWL_ISSUE,
						'post_title'  => 'WPSEO Crawl Issue',
						'post_status' => 'publish'
				) );

				// Save the meta data
				update_post_meta( $ci_post_id, self::PM_CI_URL, $crawl_issue->get_url() );
				update_post_meta( $ci_post_id, self::PM_CI_CRAWL_TYPE, $crawl_issue->get_crawl_type() );
				update_post_meta( $ci_post_id, self::PM_CI_ISSUE_TYPE, $crawl_issue->get_issue_type() );
				update_post_meta( $ci_post_id, self::PM_CI_DATE_DETECTED, (string) strftime( '%x', strtotime( $crawl_issue->get_date_detected()->format( 'Y-m-d H:i:s' ) ) ) );
				update_post_meta( $ci_post_id, self::PM_CI_DETAIL, $crawl_issue->get_detail() );
				update_post_meta( $ci_post_id, self::PM_CI_LINKED_FROM, $crawl_issue->get_linked_from() );

			}
		}

		// Save the last checked
		$this->save_last_checked();
	}

	/**
	 * Get the crawl issues
	 *
	 * @return array<WPSEO_Crawl_Issue>
	 */
	public function get_crawl_issues( $extra_args=array() ) {
		$crawl_issues = array();

		// Get last checked timestamp
		$ci_ts = $this->get_last_checked();

		// Last time we checked the crawl errors more then one day ago? Check again.
		if ( 1 || $ci_ts <= strtotime( "-1 day" ) ) { // @todo remove the 1 ||
			$this->save_crawl_issues();
		}

		// Get crawl issues from DB
		// @todo add search here

		// Post Type can't be set in $extra_args
		unset( $extra_args['post_type'] );

		// Get the crawl issues from db
		$crawl_issues_db = get_posts( wp_parse_args( $extra_args, array( 'post_type' => self::PT_CRAWL_ISSUE, 'post_per_page' => - 1 ) ) );

		// Get the ignores
		// @todo get the ignores

		// Convert WP posts to WPSEO_Crawl_Issue objects
		if ( count( $crawl_issues_db ) > 0 ) {
			foreach ( $crawl_issues_db as $crawl_issues_db_item ) {
				$crawl_issues[] = new WPSEO_Crawl_Issue(
						get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_URL, true ),
						get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_CRAWL_TYPE, true ),
						get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_ISSUE_TYPE, true ),
						new DateTime( (string) get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_DATE_DETECTED, true ) ),
						get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_DETAIL, true ),
						get_post_meta( $crawl_issues_db_item->ID, self::PM_CI_LINKED_FROM, true ),
						false // @todo match this with ignore array
				);
			}
		}

		return $crawl_issues;
	}

}
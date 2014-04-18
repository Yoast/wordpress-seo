<?php

/**
 * Class WPSEO_Crawl_Issue_Manager
 *
 * @todo Put the ignores in an option so we safely remove all posts
 */
class WPSEO_Crawl_Issue_Manager {

	// Post Type related constants
	const PT_CRAWL_ISSUE = 'wpseo_crawl_issue';

	// Post Meta related constants
	const PM_CI_URL = 'wpseo_ci_url';
	const PM_CI_CRAWL_TYPE = 'wpseo_ci_crawl_type';
	const PM_CI_ISSUE_TYPE = 'wpseo_ci_issue_type';
	const PM_CI_DATE_DETECTED = 'wpseo_ci_date_detected';
	const PM_CI_DETAIL = 'wpseo_ci_detail';
	const PM_CI_LINKED_FROM = 'wpseo_ci_linked_from';

	// The last checked timestamp
	const OPTION_CI_TS = 'wpseo_crawl_issues_last_checked';

	// Store the latest query
	private $last_query = null;

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
	 * Remove the last checked option
	 */
	public function remove_last_checked() {
		delete_option( self::OPTION_CI_TS );
	}


	/**
	 * Return latest WP_Query object
	 *
	 * @return WP_Query
	 */
	public function get_latest_query() {
		return $this->last_query;
	}

	/**
	 * Get the GWT profile
	 *
	 * @return string
	 */
	public function get_profile() {

		// Get option
		$option = get_option( 'wpseo-premium-gwt', array( 'profile' => '' ) );

		// Set the profile
		$profile = $option['profile'];

		// Check if the profile is set
		if ( '' == $profile ) {
			$profile = "https://www.google.com/webmasters/tools/feeds/" . urlencode( trailingslashit( get_option( 'siteurl' ) ) );
		}

		// Return the profile
		return $profile;
	}

	/**
	 * Save the crawl issues
	 *
	 * @param WPSEO_GWT_Google_Client $gwt
	 */
	private function save_crawl_issues( WPSEO_GWT_Google_Client $gwt ) {
		global $wpdb;

		error_log( 'Checking crawl issues remote', 0 );

		// Create a the service object
		$service = new WPSEO_GWT_Service( $gwt );

		// Get crawl issues
		$crawl_issues = $service->get_crawl_issues();

		// Store the urls of crawl issues
		$crawl_issue_urls = array();

		// Mutate and save the crawl issues
		if ( count( $crawl_issues ) > 0 ) {

			foreach ( $crawl_issues as $crawl_issue ) {

				/**
				 * @var WPSEO_Crawl_Issue $crawl_issue
				 */

				$ci_post_id = post_exists( $crawl_issue->get_url() );

				// Check if the post exists
				if ( 0 == $ci_post_id ) {

					// Create the post
					$ci_post_id = wp_insert_post( array(
						'post_type'   => self::PT_CRAWL_ISSUE,
						'post_title'  => $crawl_issue->get_url(),
						'post_status' => 'publish'
					) );

				}

				// Update all the meta data
				update_post_meta( $ci_post_id, self::PM_CI_CRAWL_TYPE, $crawl_issue->get_crawl_type() );
				update_post_meta( $ci_post_id, self::PM_CI_ISSUE_TYPE, $crawl_issue->get_issue_type() );
				update_post_meta( $ci_post_id, self::PM_CI_DATE_DETECTED, (string) strftime( '%x', strtotime( $crawl_issue->get_date_detected()->format( 'Y-m-d H:i:s' ) ) ) );
				update_post_meta( $ci_post_id, self::PM_CI_DETAIL, $crawl_issue->get_detail() );
				update_post_meta( $ci_post_id, self::PM_CI_LINKED_FROM, $crawl_issue->get_linked_from() );

				// Store the url in $crawl_issue_urls
				if( false == in_array( $crawl_issue->get_url(), $crawl_issue_urls ) ) {
					$crawl_issue_urls[] = $crawl_issue->get_url();
				}


			}
		}

		$sql_raw = "DELETE FROM `{$wpdb->posts}` WHERE `post_type` = '" . self::PT_CRAWL_ISSUE . "'";

		$crawl_issue_count = count( $crawl_issue_urls );
		if( $crawl_issue_count > 0 ) {
			$sql_raw .= " AND `post_title` NOT IN (" . implode( ', ', array_fill( 0, count( $crawl_issue_urls ), '%s' ) ) . ")";
		}

		// Remove local crawl issues that are not in the Google response
		// Format the SQL
		$sql = call_user_func_array( array( $wpdb, 'prepare' ), array_merge( array( $sql_raw ), $crawl_issue_urls ) );

		// Run the delete SQL
		$wpdb->query( $sql );

		// Save the last checked
		$this->save_last_checked();
	}

	/**
	 * Add the urls filter
	 *
	 * @param $where
	 * @param $wp_query
	 *
	 * @return string
	 */
	public function filter_crawl_issue_sql_where( $where, $wp_query ) {
		global $wpdb;
		if ( $wp_query->get( 'wpseo_urls' ) != '' && is_array( $wp_query->get( 'wpseo_urls' ) ) && count( $wp_query->get( 'wpseo_urls' ) ) > 0 ) {
			$sql = " AND {$wpdb->posts}.post_title NOT IN(" . implode( ', ', array_fill( 0, count( $wp_query->get( 'wpseo_urls' ) ), '%s' ) ) . ")";
			$where .= call_user_func_array( array(
					$wpdb,
					'prepare'
				), array_merge( array( $sql ), $wp_query->get( 'wpseo_urls' ) ) );
		}

		return $where;
	}

	/**
	 * Get the crawl issues
	 *
	 * @param WPSEO_GWT_Google_Client $gwt
	 * @param array                   $extra_args
	 *
	 * @return array<WPSEO_Crawl_Issue>
	 */
	public function get_crawl_issues( WPSEO_GWT_Google_Client $gwt, $extra_args = array() ) {
		$crawl_issues = array();

		// Get last checked timestamp
		$ci_ts = $this->get_last_checked();

		// Last time we checked the crawl errors more then one day ago? Check again.
		if ( $ci_ts <= strtotime( "-1 day" ) ) { // @todo add a $_GET check here
			$this->save_crawl_issues( $gwt );
		}

		// Post Type can't be set in $extra_args
		unset( $extra_args['post_type'] );

		// Add filter to filter out already redirected urls
		add_filter( 'posts_where', array( $this, 'filter_crawl_issue_sql_where' ), 10, 2 );

		// Get the crawl issues from db
		$crawl_issue_query = new WP_Query( wp_parse_args( $extra_args, array(
					'post_type'        => self::PT_CRAWL_ISSUE,
					'posts_per_page'   => - 1,
					'suppress_filters' => false
				) ) );
		$crawl_issues_db   = $crawl_issue_query->posts;

		// Remove filter to filter out already redirected urls
		remove_filter( 'posts_where', array( $this, 'filter_crawl_issue_sql_where' ) );

		// Set the latest query
		$this->last_query = $crawl_issue_query;

		// Convert WP posts to WPSEO_Crawl_Issue objects
		if ( count( $crawl_issues_db ) > 0 ) {
			foreach ( $crawl_issues_db as $crawl_issues_db_item ) {
				$crawl_issues[] = new WPSEO_Crawl_Issue(
					$crawl_issues_db_item->post_title,
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

	/**
	 * Update the crawl issue status
	 *
	 * @param string $status
	 * @param string $url
	 *
	 * @return bool
	 */
	private function change_crawl_issue_status( $status, $url ) {

		// Get the the CI id
		$crawl_issue = get_page_by_title( $url, OBJECT, self::PT_CRAWL_ISSUE );

		// Check if there is a result
		if ( null == $crawl_issue ) {
			return false;
		}

		// Update post status
		wp_update_post( array(
			'ID'          => $crawl_issue->ID,
			'post_status' => $status
		) );

		return true;
	}

	/**
	 * AJAX ignore redirect crawl issue
	 */
	public function ajax_ignore_crawl_issue() {

		// Check if the URL is set
		if ( ! isset ( $_POST['url'] ) ) {
			echo 'false';
			exit;
		}

		// URL
		$url = $_POST['url'];

		$result = 'false';
		if ( $this->change_crawl_issue_status( 'trash', $url ) ) {
			$result = 'true';
		}

		// Done, bye
		echo $result;
		exit;
	}

	/**
	 * AJAX unignore redirect crawl issue
	 */
	public function ajax_unignore_crawl_issue() {

		// Check if the URL is set
		if ( ! isset ( $_POST['url'] ) ) {
			echo 'false';
			exit;
		}

		// URL
		$url = $_POST['url'];

		$result = 'false';
		if ( $this->change_crawl_issue_status( 'publish', $url ) ) {
			$result = 'true';
		}

		// Done, bye
		echo $result;
		exit;
	}

}
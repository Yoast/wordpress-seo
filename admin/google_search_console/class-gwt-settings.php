<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GWT_Settings
 */
class WPSEO_GWT_Settings {

	/**
	 * Clear all data from the database
	 *
	 * @param WPSEO_GWT_Service $service
	 */
	public static function clear_data( WPSEO_GWT_Service $service ) {
		// Remove issue and issue counts
		self::remove();

		// Clear the service data.
		$service->clear_data();
	}

	/**
	 * Reloading all the issues
	 *
	 * @param WPSEO_GWT_Service $service
	 */
	public static function reload_issues( WPSEO_GWT_Service $service ) {
		// Remove issue and issue counts
		self::remove();

		new WPSEO_Crawl_Issue_Count( $service );
	}

	/**
	 * When authorization is successful return true, otherwise false
	 *
	 * @param string              $authorization_code
	 * @param Yoast_Google_Client $client
	 *
	 * @return bool
	 */
	public function validate_authorization( $authorization_code, Yoast_Google_Client $client ) {
		return ( $authorization_code !== '' && $client->authenticate_client( $authorization_code ) );
	}

	/**
	 * Removes the issue counts and all the issues from the options
	 */
	private static function remove() {
		// Remove the issue counts from the options
		self::remove_issue_counts();

		// Removing all issues from the database.
		self::remove_issues();
	}

	/**
	 * Remove the issue counts
	 */
	private static function remove_issue_counts() {
		// Remove the options which are holding the counts.
		delete_option( WPSEO_Crawl_Issue_Count::OPTION_CI_COUNTS );
		delete_option( WPSEO_Crawl_Issue_Count::OPTION_CI_LAST_FETCH );
	}

	/**
	 * Delete the issues and their meta data from the database
	 */
	private static function remove_issues() {
		global $wpdb;

		// Remove local crawl issues by running a delete query.
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE 'wpseo-gwt-issues-%'" );
	}

}

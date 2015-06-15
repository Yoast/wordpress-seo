<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_Crawl_Issue_Marker
 */
class WPSEO_Crawl_Issue_Bulk {

	/**
	 * Setting the listener on the bulk action post
	 */
	public function __construct() {
		$this->handle_bulk_action();
	}

	/**
	 * Handles the bulk action when there is an action posted
	 */
	private function handle_bulk_action() {
		if ( $bulk_action = $this->determine_bulk_action() ) {
			if ( wp_verify_nonce( filter_input( INPUT_POST, 'wpseo_gwt_nonce' ), 'wpseo_gwt_nonce' ) ) {
				$this->run_bulk_action( $bulk_action );

				wp_redirect( filter_input( INPUT_POST, '_wp_http_referer' ) );
			}
		}
	}

	/**
	 * Determine which bulk action is selected and return that value
	 *
	 * @return string
	 */
	private function determine_bulk_action() {
		// If posted action is the selected one above the table, return that value.
		if ( $action = filter_input( INPUT_POST, 'action' ) ) {
			return $action;
		}

		// If posted action is the selected one below the table, return that value.
		if ( $action = filter_input( INPUT_POST, 'action2' ) ) {
			return $action;
		}

		return false;
	}

	/**
	 * Runs the bulk action
	 *
	 * @param string|bool $bulk_action
	 */
	private function run_bulk_action( $bulk_action ) {
		switch ( $bulk_action ) {
			case 'mark_as_fixed' :
				foreach ( $this->posted_issues() as $issue ) {
					new WPSEO_Crawl_Issue_Marker( $issue );
				}

				break;
		}
	}

	/**
	 * Get the posted issues and return them
	 *
	 * @return array
	 */
	private function posted_issues() {
		if ( $issues = filter_input( INPUT_POST, 'wpseo_crawl_issues_mark_as_fixed', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY ) ) {
			return $issues;
		}

		// Fallback if issues are empty.
		return array();
	}

}

<?php

class WPSEO_GWT_Ajax {

	/**
	 * Setting the AJAX hooks for GWT
	 *
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_mark_fixed_crawl_issue', array( $this, 'ajax_mark_as_fixed' ) );
		add_action( 'wp_ajax_wpseo_ajax_get_issue_counts', array( $this, 'ajax_get_issue_counts' ) );
		add_action( 'wp_ajax_wpseo_ajax_crawl_category', array( $this, 'ajax_crawl_category' ) );
	}


	/**
	 * This method will be access by an AJAX request and will mark an issue as fixed.
	 *
	 * First it will do a request to the Google API
	 *
	 */
	public function ajax_mark_as_fixed( ) {
		new WPSEO_Crawl_Issue_Marker();
	}

	/**
	 *
	 */
	public function ajax_get_issue_counts( ) {
		$service       = new WPSEO_GWT_Service();
		$issue_manager = new WPSEO_Crawl_Issue_Manager();

		// Saving the timestamp
		$issue_manager->save_last_checked();

		// Remove all the current crawl issues
		$issue_manager->delete_crawl_issues();

		wp_die( json_encode( $service->get_crawl_issues() ) );
	}


	/**
	 *
	 */
	public function ajax_crawl_category( ) {
		$crawl_category = new WPSEO_Crawl_Category_Issues( filter_input( INPUT_GET, 'platform' ), filter_input( INPUT_GET, 'category' ) );
		$issues = $crawl_category->fetch_issues();
	}

}

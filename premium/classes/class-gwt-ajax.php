<?php

class WPSEO_GWT_Ajax {

	/**
	 * Setting the AJAX hooks for GWT
	 *
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_mark_fixed_crawl_issue', array( $this, 'ajax_mark_as_fixed' ) );
		add_action( 'wp_ajax_wpseo_ajax_get_issue_counts', array( $this, 'ajax_get_issue_counts' ) );
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
		$client = new WPSEO_GWT_Client_Setup();

		echo $client->client;

	}


}

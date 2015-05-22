<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class WPSEO_GWT_Ajax
 */
class WPSEO_GWT_Ajax {

	/**
	 * Setting the AJAX hooks for GWT
	 *
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_mark_fixed_crawl_issue', array( $this, 'ajax_mark_as_fixed' ) );
	}

	/**
	 * This method will be access by an AJAX request and will mark an issue as fixed.
	 *
	 * First it will do a request to the Google API
	 *
	 */
	public function ajax_mark_as_fixed( ) {
		if ( $this->valid_nonce() ) {
			new WPSEO_Crawl_Issue_Marker( filter_input( INPUT_POST, 'url' ) );
		}

		wp_die( 'false' );
	}

	/**
	 * Check if posted nonce is valid and return true if it is
	 *
	 * @return mixed
	 */
	private function valid_nonce() {
		return wp_verify_nonce( filter_input( INPUT_POST, 'ajax_nonce' ), 'wpseo-gwt-ajax-security' );
	}

}

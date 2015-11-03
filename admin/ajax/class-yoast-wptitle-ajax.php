<?php
/**
 * @package WPSEO\admin|ajax
 */

/**
 * This class will catch the request to dismiss the wp_Title notice and will store the dismiss status as an user meta
 * in the database.
 */
class Yoast_WPTitle_Ajax {

	/**
	 * Initialize the hooks for the AJAX request
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_dismiss_wptitle', array( $this, 'dismiss_notice' ) );
	}

	/**
	 * Handles the dismiss notice request
	 */
	public function dismiss_notice() {
		check_ajax_referer( 'wpseo-dismiss-wptitle' );
		$this->save_dismissed();
		wp_die( 'true' );
	}

	/**
	 * Storing the the dismissed value as an user option in the database
	 */
	private function save_dismissed() {
		update_user_meta( get_current_user_id(), 'wpseo_dismiss_wptitle', 1 );
	}

}

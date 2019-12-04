<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Ajax
 */

/**
 * Class Yoast_OnPage_Ajax.
 *
 * This class will catch the request to dismiss the Ryte notice and will store
 * the dismiss status as an user meta in the database.
 */
class Yoast_OnPage_Ajax {

	/**
	 * Initialize the hooks for the AJAX request.
	 */
	public function __construct() {
		add_action( 'wp_ajax_wpseo_dismiss_onpageorg', [ $this, 'dismiss_notice' ] );
	}

	/**
	 * Handles the dismiss notice request.
	 */
	public function dismiss_notice() {
		check_ajax_referer( 'wpseo-dismiss-onpageorg' );

		$this->save_dismissed();

		wp_die( 'true' );
	}

	/**
	 * Storing the dismissed value as an user option in the database.
	 */
	private function save_dismissed() {
		update_user_meta( get_current_user_id(), WPSEO_OnPage::USER_META_KEY, 1 );
	}
}

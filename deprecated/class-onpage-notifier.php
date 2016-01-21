<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Notify the admin there is an indexibility change
 *
 * @deprecated
 */
class WPSEO_OnPage_Notifier {

	/**
	 * Send an email to the site admin
	 *
	 * @deprecated 3.0.7
	 */
	public function send_email() {
		_deprecated_constructor( 'WPSEO_OnPage_Email_Presenter', 'WPSEO 3.0.7' );
	}

	/**
	 * Forces the MIME type of emails to text/html
	 *
	 * @deprecated 3.0.7
	 */
	public function set_content_type() {
		_deprecated_function( 'WPSEO_OnPage_Notifier', 'WPSEO 3.0.7' );

		return 'text/html';
	}

	/**
	 * Let's start showing the notices to all admins by removing the hide-notice meta data for each admin resulting in
	 * popping up the notice again
	 *
	 * @deprecated 3.0.7
	 */
	public function show_notices() {
		_deprecated_function( 'WPSEO_OnPage_Notifier', 'WPSEO 3.0.7' );
	}

}

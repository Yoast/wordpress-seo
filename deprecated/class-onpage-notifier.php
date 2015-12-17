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
	 * @deprecated
	 */
	public function send_email() {}

	/**
	 * Forces the MIME type of emails to text/html
	 */
	public function set_content_type() {
		return 'text/html';
	}

	/**
	 * Let's start showing the notices to all admins by removing the hide-notice meta data for each admin resulting in
	 * popping up the notice again
	 *
	 * @deprecated
	 */
	public function show_notices() {}

}

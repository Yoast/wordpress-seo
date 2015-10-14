<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Notify the admin there is an indexibility change
 */
class WPSEO_OnPage_Notify {

	/**
	 * Constructing the notify object
	 *
	 * @param int|null $old_status The old indexability status.
	 * @param int      $new_status The new indexability status.
	 */
	public function __construct( $old_status, $new_status ) {
		$this->send_email( $old_status, $new_status );
		$this->show_notices();
	}

	/**
	 * Send an email to the site admin
	 *
	 * @param int|null $old_status The old indexability status.
	 * @param int      $new_status The new indexability status.
	 */
	protected function send_email( $old_status, $new_status ) {
		$email_presenter = new WPSEO_OnPage_Email_Presenter(
			array(
				'old_status' => $old_status,
				'new_status' => $new_status,
			)
		);

		wp_mail(
			get_option( 'admin_email' ),
			__( 'OnPage.org index status', 'wordpress-seo' ),
			$email_presenter->get_message()
		);
	}

	/**
	 * Let's start showing the notices to all admins by removing the hide-notice meta data for each admin resulting in
	 * popping up the notice again
	 */
	private function show_notices() {
		global $wpdb;

		// Remove the user meta data.
		$wpdb->query( 'DELETE FROM ' . $wpdb->usermeta . " WHERE meta_key = '" . WPSEO_OnPage::USERMETAVALUE . "'" );
	}

}

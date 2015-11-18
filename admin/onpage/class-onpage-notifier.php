<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Notify the admin there is an indexibility change
 */
class WPSEO_OnPage_Notifier {

	/**
	 * Send an email to the site admin
	 *
	 * @param int|null $old_status The old indexability status.
	 * @param int      $new_status The new indexability status.
	 */
	public function send_email( $old_status, $new_status ) {
		$email_presenter = new WPSEO_OnPage_Email_Presenter(
			array(
				'old_status' => $old_status,
				'new_status' => $new_status,
			)
		);

		add_filter( 'wp_mail_content_type', array( $this, 'set_content_type' ) );
		wp_mail(
			get_option( 'admin_email' ),
			$email_presenter->get_subject(),
			$email_presenter->get_message()
		);
		remove_filter( 'wp_mail_content_type', array( $this, 'set_content_type' ) );
	}

	/**
	 * Forces the MIME type of emails to text/html
	 *
	 * @param string $content_type
	 *
	 * @return string
	 */
	public function set_content_type( $content_type ) {
		return 'text/html';
	}

	/**
	 * Let's start showing the notices to all admins by removing the hide-notice meta data for each admin resulting in
	 * popping up the notice again
	 */
	public function show_notices() {
		delete_metadata( 'user', 0, WPSEO_OnPage::USER_META_KEY, '', true );
	}

}

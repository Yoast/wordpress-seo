<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class will fetch a new status from OnPage.org and if it's necessary it will notify the site admin by email and
 * remove the current meta value for hidding the notice for all admin users
 */
class WPSEO_OnPage_Request {

	/**
	 * @var WPSEO_OnPage_Status
	 */
	private $onpage_status;

	/**
	 * @param WPSEO_OnPage_Status $onpage_status The OnPage status object.
	 */
	public function __construct( WPSEO_OnPage_Status $onpage_status ) {
		$this->onpage_status = $onpage_status;

		$this->fetch_data();
	}

	/**
	 * Fetch the status from the OnPage.org API and process the result of it.
	 */
	private function fetch_data() {
		// Fetch the new status.
		$this->onpage_status->fetch_new_status();

		// When the value is changed, the method will return true.
		if ( $this->onpage_status->compare_index_status() ) {
			$this->remove_hide_notice_user_meta();
			$this->notify_admin_by_email();
		}
	}

	/**
	 * Send an email to the site admin
	 */
	private function notify_admin_by_email() {



		wp_mail(
			get_option( 'admin_email' ),
			__( 'OnPage.org index status', 'wordpress-seo' ),
			$this->get_email_message()
		);
	}

	/**
	 * Getting the email message based on first run and the times after the first run.
	 * 
	 * @return string
	 */
	private function get_email_message() {

		$index_status_value = $this->get_status_value();

		if ( $this->onpage_status->get_current_status() !== null ) {
			return sprintf(
				__( 'The indexability from your website %1$s, went from %2$s to %3$s' ),
				home_url(),
				$index_status_value['old_status'],
				$index_status_value['new_status']
			);
		}

		return sprintf(
			__( 'The indexability from your website %1$s is %2$s at the moment.' ),
			home_url(),
			$index_status_value['new_status']
		);
	}

	/**
	 * Returns the array with the values for the new and the old index status
	 *
	 * @return array
	 */
	private function get_status_value() {
		$index_status  = $this->onpage_status->get_fetched_index_status();
		$not_indexable = __( 'not indexable', 'wordpress-seo' );
		$indexable     = __( 'indexable', 'wordpress-seo' );
		if ( $index_status ) {
			return array( 'old_status' => $not_indexable, 'new_status' => $indexable );
		}

		return array( 'old_status' => $indexable, 'new_status' => $not_indexable );
	}

	/**
	 * Removes the hide notice state in the user meta table
	 */
	private function remove_hide_notice_user_meta() {
		global $wpdb;

		// Remove the user meta data.
		$wpdb->query( 'DELETE FROM ' . $wpdb->usermeta . " WHERE meta_key = '" . WPSEO_OnPage::USERMETAVALUE . "'" );
	}
}

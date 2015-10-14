<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Fetching the indexable status from the OnPage.org API and store it in the options
 */
class WPSEO_OnPage_Status {

	/**
	 * @var string Target url for the indexable status lookup.
	 */
	protected $target_url;

	/**
	 * @var WPSEO_OnPage_Option The OnPage.org option class.
	 */
	private $onpage_option;

	/**
	 * @var string|null The current status before anything has been requested,
	 */
	private $current_status;

	/**
	 * Construct the status object
	 *
	 * @param string              $target_url    The URL that will be fetched.
	 * @param WPSEO_OnPage_Option $onpage_option The option object for handling the onpage response.
	 */
	public function __construct( $target_url, WPSEO_OnPage_Option $onpage_option ) {
		$this->target_url     = $target_url;
		$this->onpage_option  = $onpage_option;
		$this->current_status = $this->onpage_option->get( 'status' );
	}

	/**
	 * Fetching the new status from the API for the set target_url
	 *
	 * @return bool
	 */
	public function indexability_changed() {
		$response = $this->do_request();

		// Updates the timestamp in the option.
		$this->onpage_option->set( 'last_fetch', time() );

		// When the value is changed, the method will return true.
		if ( $this->compare_index_status( $response['is_indexable'] ) ) {
			$this->remove_hide_notice_user_meta();
			$this->notify_admin_by_email();

			return true;
		}

		return false;
	}

	/**
	 * Doing the request and return the response
	 *
	 * @return array
	 */
	protected function do_request() {
		$request = new WPSEO_OnPage_Request( $this->target_url );

		return $request->get_response();
	}

	/**
	 * Compare new index status and store the value when the current status isn't different from the new status
	 *
	 * @param bool $fetched_index_status The index status which is just fetched.
	 *
	 * @return bool
	 */
	private function compare_index_status( $fetched_index_status ) {
		// When the status isn't different from the current status, just save the new status.
		if ( $this->current_status !== $fetched_index_status ) {
			$this->onpage_option->set( 'status', (int) $fetched_index_status );

			return true;
		}

		return false;
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

		if ( $this->current_status !== null ) {
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
		$not_indexable = __( 'not indexable', 'wordpress-seo' );
		$indexable     = __( 'indexable', 'wordpress-seo' );
		if ( $this->onpage_option->get( 'status' ) === '1' ) {
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

<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Handle the request for getting the onpage status
 */
class WPSEO_OnPage {

	/**
	 * The name of the user meta key for storing the dismissed status.
	 */
	const USERMETAVALUE = 'wpseo_dismiss_onpage';

	/**
	 * @var WPSEO_OnPage_Status
	 */
	private $onpage_status;

	/**
	 * Constructing the object
	 */
	public function __construct() {
		$this->set_hooks();

		$this->onpage_status = new WPSEO_OnPage_Status( home_url() );
	}

	/**
	 * Adding a weekly schedule to the schedules array
	 *
	 * @param array $schedules Array with schedules.
	 *
	 * @return array
	 */
	public function add_weekly_schedule( array $schedules ) {
		$schedules['weekly'] = array( 'interval' => WEEK_IN_SECONDS, 'display' => __( 'Once Weekly' ) );

		return $schedules;
	}

	/**
	 * Fetching the data from onpage.
	 */
	public function fetch_from_onpage() {
		$this->onpage_status->fetch_new_status();

		// When the value is changed, the method will return true.
		if ( $this->onpage_status->compare_index_status() ) {
			$this->remove_hide_notice_user_meta();
			$this->notify_admin_by_email();
		}
	}

	/**
	 * Setting the cronjob
	 */
	public function set_cron() {

		wp_unschedule_event( 'wpseo_onpage_fetch' );

		if ( ! wp_next_scheduled( 'wpseo_onpage_fetch' ) ) {
			wp_schedule_event( time(), 'weekly', 'wpseo_onpage_fetch' );
		}
	}

	/**
	 * Show a notice when the website is not indexable
	 */
	public function show_notice() {
		$show_notice = WPSEO_Utils::grant_access() && $this->user_has_not_dismissed() && ! $this->onpage_status->is_indexable();
		if ( $show_notice ) {
			Yoast_Notification_Center::get()->add_notification(
				new Yoast_Notification(
					__( 'Your site is currently not indexable.', 'wordpress-seo' ),
					array(
						'type'  => 'error yoast-dismissible',
						'id'    => 'wpseo-dismiss-onpageorg',
						'nonce' => wp_create_nonce( 'wpseo-dismiss-onpageorg' ),
					)
				)
			);
		}
	}

	/**
	 * Setting up the hooks.
	 */
	private function set_hooks() {
		// Schedule cronjob when it doesn't exists on activation.
		register_activation_hook( WPSEO_FILE, array( $this, 'set_cron' ) );

		// Add weekly schedule to the cron job schedules.
		add_filter( 'cron_schedules', array( $this, 'add_weekly_schedule' ) );

		// Adding admin notice if necessary.
		add_filter( 'admin_init', array( $this, 'show_notice' ) );

		// Setting the action for the OnPage fetch.
		add_action( 'wpseo_onpage_fetch', array( $this, 'fetch_from_onpage' ) );
	}

	/**
	 * Send an email to the site admin
	 *
	 */
	private function notify_admin_by_email() {
		$index_status_value = $this->get_status_value();

		wp_mail(
			get_option( 'admin_email' ),
			__( 'OnPage.org index status', 'wordpress-seo' ),
			sprintf(
				__(
					'The indexability from your website %1$s, went from %2$s to %3$s'
				),
				home_url(),
				$index_status_value['old_status'],
				$index_status_value['new_status']
			)
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
			return [ 'old_status' => $not_indexable, 'new_status' => $indexable ];
		}

		return [ 'old_status' => $indexable, 'new_status' => $not_indexable ];
	}

	/**
	 * Removes the hide notice state in the user meta table
	 */
	private function remove_hide_notice_user_meta() {
		global $wpdb;

		// Remove the user meta data
		$wpdb->query( "DELETE FROM " . $wpdb->usermeta . " WHERE meta_key = '" . WPSEO_OnPage::USERMETAVALUE . "'" );
	}

	/**
	 * Get the state from the user to check if the current user has dismissed
	 *
	 * @return mixed
	 */
	private function user_has_not_dismissed() {
		return '1' === ( get_user_meta( get_current_user_id(), WPSEO_OnPage::USERMETAVALUE, true ) );
	}

}

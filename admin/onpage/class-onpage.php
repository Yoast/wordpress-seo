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
	const USER_META_KEY = 'wpseo_dismiss_onpage';

	/**
	 * @var WPSEO_OnPage_Option The OnPage.org option class.
	 */
	private $onpage_option;

	/**
	 * Constructing the object
	 */
	public function __construct() {
		// We never want to fetch on AJAX request because doing a remote request is really slow.
		if ( ! ( defined( 'DOING_AJAX' ) && DOING_AJAX === true ) ) {
			$this->onpage_option = new WPSEO_OnPage_Option();

			$this->set_hooks();
			$this->catch_redo_listener();
		}
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
	 *
	 * @return bool
	 */
	public function fetch_from_onpage() {
		if ( $this->onpage_option->should_be_fetched() ) {
			// Updates the timestamp in the option.
			$this->onpage_option->set_last_fetch( time() );

			// The currently indexability status.
			$old_status = $this->onpage_option->get_status();

			// The requested indexability status.
			$new_status = $this->request_indexability();

			// Saving the new status.
			$this->onpage_option->set_status( $new_status );

			// Saving the option.
			$this->onpage_option->save_option();

			// Check if the status has been changed.
			if ( $old_status !== $new_status ) {
				$this->notify_admins( $old_status, $new_status );
			}

			return true;
		}

		return false;
	}

	/**
	 * Show a notice when the website is not indexable
	 */
	public function show_notice() {
		$show_notice = WPSEO_Utils::grant_access() && ! $this->user_has_dismissed() && ! $this->onpage_option->is_indexable();
		if ( $show_notice ) {
			$notice = sprintf( '%1$s', __( 'Your homepage is not indexable. This is very bad for SEO and should be fixed.', 'wordpress-seo' ) );

			Yoast_Notification_Center::get()->add_notification(
				new Yoast_Notification(
					$notice,
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
	 * Send a request to OnPage.org to get the indexability
	 *
	 * @return int
	 */
	protected function request_indexability() {
		$request  = new WPSEO_OnPage_Request( home_url() );
		$response = $request->get_response();

		return (int) $response['is_indexable'];
	}

	/**
	 * Notify the admins
	 *
	 * @param int|null $old_status The old indexable status.
	 * @param int      $new_status The new indexable status.
	 */
	protected function notify_admins( $old_status, $new_status ) {
		$notify = new WPSEO_OnPage_Notifier( $old_status, $new_status );

		$notify->send_email( $old_status, $new_status );
		$notify->show_notices();
	}

	/**
	 * Setting up the hooks.
	 */
	private function set_hooks() {
		// Schedule cronjob when it doesn't exists on activation.
		register_activation_hook( WPSEO_FILE, array( $this, 'activate_hooks' ) );

		// Add weekly schedule to the cron job schedules.
		add_filter( 'cron_schedules', array( $this, 'add_weekly_schedule' ) );

		// Adding admin notice if necessary.
		add_filter( 'admin_init', array( $this, 'show_notice' ) );

		// Setting the action for the OnPage fetch.
		add_action( 'wpseo_onpage_fetch', array( $this, 'fetch_from_onpage' ) );
	}

	/**
	 * The hooks to run on plugin activation
	 */
	private function activate_hooks() {
		$this->set_cron();
	}

	/**
	 * Setting the cronjob to get the new indexibility status.
	 */
	private function set_cron() {
		if ( ! wp_next_scheduled( 'wpseo_onpage_fetch' ) ) {
			wp_schedule_event( time(), 'weekly', 'wpseo_onpage_fetch' );
		}
	}

	/**
	 * Get the state from the user to check if the current user has dismissed
	 *
	 * @return mixed
	 */
	private function user_has_dismissed() {
		return '1' === get_user_meta( get_current_user_id(), WPSEO_OnPage::USER_META_KEY, true );
	}

	/**
	 * Redo the fetch request for onpage
	 */
	private function catch_redo_listener() {
		if ( filter_input( INPUT_GET, 'wpseo-redo-onpage' ) === '1' ) {
			add_action( 'admin_init', array( $this, 'fetch_from_onpage' ) );
		}
	}

}

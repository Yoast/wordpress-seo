<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Handle the request for getting the onpage status
 */
class WPSEO_OnPage {

	/**
	 * @var WPSEO_OnPage_Option The OnPage.org option class.
	 */
	private $onpage_option;

	/**
	 * @var boolean Is the request started by pressing the fetch button.
	 */
	private $is_manual_request = false;

	/**
	 * Constructing the object
	 */
	public function __construct() {
		// We never want to fetch on AJAX request because doing a remote request is really slow.
		if ( ! ( defined( 'DOING_AJAX' ) && DOING_AJAX === true ) ) {
			$this->onpage_option = new WPSEO_OnPage_Option();

			if ( $this->onpage_option->is_enabled() ) {
				$this->set_hooks();
				$this->catch_redo_listener();
				$this->register_notifier();
			}
		}
	}

	/**
	 * The hooks to run on plugin activation
	 */
	public function activate_hooks() {
		$this->set_cron();
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
		if ( $this->onpage_option->should_be_fetched() && false !== ( $new_status = $this->request_indexability() ) ) {

			// Updates the timestamp in the option.
			$this->onpage_option->set_last_fetch( time() );

			// The currently indexability status.
			$old_status = $this->onpage_option->get_status();

			// Saving the new status.
			$this->onpage_option->set_status( $new_status );

			// Saving the option.
			$this->onpage_option->save_option();

			return true;
		}

		return false;
	}

	/**
	 * Show a notice when the website is not indexable
	 */
	public function register_notifier() {
		Yoast_Notification_Center::get()->register_notifier( new Yoast_Not_Indexable_Homepage_Notifier( $this ) );
	}

	/**
	 * Get the onpage option
	 *
	 * @return WPSEO_OnPage_Option
	 */
	public function get_onpage_option() {
		return $this->onpage_option;
	}

	/**
	 * Send a request to OnPage.org to get the indexability
	 *
	 * @return int(0)|int(1)|false
	 */
	protected function request_indexability() {
		$request  = new WPSEO_OnPage_Request( get_option( 'home' ) );
		$response = $request->get_response();

		if ( isset( $response['is_indexable'] ) ) {
			return (int) $response['is_indexable'];
		}

		return WPSEO_OnPage_Option::CANNOT_FETCH;
	}

	/**
	 * Setting up the hooks.
	 */
	private function set_hooks() {
		// Schedule cronjob when it doesn't exists on activation.
		register_activation_hook( WPSEO_FILE, array( $this, 'activate_hooks' ) );

		// Add weekly schedule to the cron job schedules.
		add_filter( 'cron_schedules', array( $this, 'add_weekly_schedule' ) );

		// Setting the action for the OnPage fetch.
		add_action( 'wpseo_onpage_fetch', array( $this, 'fetch_from_onpage' ) );
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
	 * Redo the fetch request for onpage
	 */
	private function catch_redo_listener() {
		if ( filter_input( INPUT_GET, 'wpseo-redo-onpage' ) === '1' ) {
			$this->is_manual_request = true;

			add_action( 'admin_init', array( $this, 'fetch_from_onpage' ) );
		}
	}

}

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
	 * @var WPSEO_OnPage_Option The OnPage.org option class.
	 */
	private $onpage_option;

	/**
	 * Constructing the object
	 */
	public function __construct() {
		// Only when AJAX isn't loaded.
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
	 */
	public function fetch_from_onpage() {
		if ( $this->onpage_option->can_fetch() ) {
			new WPSEO_OnPage_Status( home_url(), $this->onpage_option );
		}
	}

	/**
	 * Show a notice when the website is not indexable
	 */
	public function show_notice() {
		$show_notice = WPSEO_Utils::grant_access() && $this->user_has_not_dismissed() && ! $this->onpage_option->is_indexable();
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
		$this->fetch_from_onpage();
	}

	/**
	 * Setting the cronjob
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
	private function user_has_not_dismissed() {
		return '1' !== get_user_meta( get_current_user_id(), WPSEO_OnPage::USERMETAVALUE, true );
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

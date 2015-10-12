<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Handle the request for getting the onpage status
 */
class WPSEO_OnPage {

	/**
	 * @var WPSEO_OnPage_Status
	 */
	private $onpage_status;

	/**
	 * Constructing the object
	 */
	public function __construct() {
		$this->set_hooks();

		$this->onpage_status = new WPSEO_OnPage_Status();
	}

	/**
	 * Adding a weekly schedule to the schedules array
	 *
	 * @param array $schedules Array with schedules.
	 *
	 * @return array
	 */
	public function add_weekly_schedule( array $schedules ) {
		$schedules['weekly'] = array( 'interval' => 24, 'display' => __( 'Once Weekly' ) );

		return $schedules;
	}

	/**
	 * Fetching the data from onpage.
	 */
	public function fetch_from_onpage() {
		$index_status = $this->onpage_status->fetch_new_status( home_url() );
		$this->onpage_status->compare_index_status( $index_status );
	}

	/**
	 * Setting the cronjob
	 */
	public function set_cron() {
		if ( ! wp_next_scheduled( 'wpseo_onpage_fetch' ) ) {
			wp_schedule_event( time(), 'weekly', 'wpseo_onpage_fetch' );
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

		// Setting the action for the OnPage fetch.
		add_action( 'wpseo_onpage_fetch', array( $this, 'fetch_from_onpage' ) );
	}

}
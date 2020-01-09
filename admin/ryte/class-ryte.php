<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Handles the request for getting the Ryte status.
 */
class WPSEO_Ryte implements WPSEO_WordPress_Integration {

	/**
	 * Is the request started by pressing the fetch button.
	 *
	 * @var boolean
	 */
	private $is_manual_request = false;

	/**
	 * Constructs the object.
	 */
	public function __construct() {
		$this->catch_redo_listener();
	}

	/**
	 * Sets up the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! self::is_active() ) {
			return;
		}

		// Adds weekly schedule to the cron job schedules.
		add_filter( 'cron_schedules', [ $this, 'add_weekly_schedule' ] );

		// Sets the action for the Ryte fetch cron job.
		add_action( 'wpseo_ryte_fetch', [ $this, 'fetch_from_ryte' ] );
	}

	/**
	 * Determines if we can use the functionality.
	 *
	 * @return bool True if this functionality can be used.
	 */
	public static function is_active() {
		if ( wp_doing_ajax() ) {
			return false;
		}

		if ( ! WPSEO_Options::get( 'ryte_indexability' ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Hooks to run on plugin activation.
	 */
	public function activate_hooks() {
		if ( $this->get_option()->is_enabled() ) {
			$this->schedule_cron();

			return;
		}

		$this->unschedule_cron();
	}

	/**
	 * Adds a weekly cron schedule.
	 *
	 * @param array $schedules Currently scheduled items.
	 *
	 * @return array Enriched list of schedules.
	 */
	public function add_weekly_schedule( $schedules ) {
		if ( ! is_array( $schedules ) ) {
			$schedules = [];
		}

		$schedules['weekly'] = [
			'interval' => WEEK_IN_SECONDS,
			'display'  => __( 'Once Weekly', 'wordpress-seo' ),
		];

		return $schedules;
	}

	/**
	 * Fetches the data from Ryte.
	 *
	 * @return bool True if this has been run.
	 */
	public function fetch_from_ryte() {
		$ryte_option = $this->get_option();
		if ( ! $ryte_option->should_be_fetched() ) {
			return false;
		}

		$new_status = $this->request_indexability();
		if ( false === $new_status ) {
			return false;
		}

		// Updates the timestamp in the option.
		$ryte_option->set_last_fetch( time() );

		$ryte_option->set_status( $new_status );
		$ryte_option->save_option();

		return true;
	}

	/**
	 * Retrieves the option to use.
	 *
	 * @return WPSEO_Ryte_Option The option.
	 */
	protected function get_option() {
		return new WPSEO_Ryte_Option();
	}

	/**
	 * Sends a request to Ryte to get the indexability.
	 *
	 * @return int|bool The indexability value.
	 */
	protected function request_indexability() {
		$parameters = [];
		if ( $this->wordfence_protection_enabled() ) {
			$parameters['wf_strict'] = 1;
		}

		$request  = new WPSEO_Ryte_Request();
		$response = $request->do_request( get_option( 'home' ), $parameters );

		if ( isset( $response['is_indexable'] ) ) {
			return (int) $response['is_indexable'];
		}

		return WPSEO_Ryte_Option::CANNOT_FETCH;
	}

	/**
	 * Schedules the cronjob to get the new indexibility status.
	 *
	 * @return void
	 */
	private function schedule_cron() {
		if ( wp_next_scheduled( 'wpseo_ryte_fetch' ) ) {
			return;
		}

		$schedules = wp_get_schedules();

		if ( ! isset( $schedules['weekly'] ) ) {
			// Make sure our custom weekly schedule exists before adding the weekly cron job.
			add_filter( 'cron_schedules', [ $this, 'add_weekly_schedule' ] );
		}

		wp_schedule_event( time(), 'weekly', 'wpseo_ryte_fetch' );
	}

	/**
	 * Unschedules the cronjob to get the new indexibility status.
	 *
	 * @return void
	 */
	private function unschedule_cron() {
		if ( ! wp_next_scheduled( 'wpseo_ryte_fetch' ) ) {
			return;
		}

		wp_clear_scheduled_hook( 'wpseo_ryte_fetch' );
	}

	/**
	 * Redo the fetch request for Ryte.
	 *
	 * @return void
	 */
	private function catch_redo_listener() {
		if ( ! self::is_active() ) {
			return;
		}

		if ( filter_input( INPUT_GET, 'wpseo-redo-ryte' ) === '1' ) {
			$this->is_manual_request = true;

			add_action( 'admin_init', [ $this, 'fetch_from_ryte' ] );
		}
	}

	/**
	 * Checks if WordFence protects the site against 'fake' Google crawlers.
	 *
	 * @return boolean True if WordFence protects the site.
	 */
	private function wordfence_protection_enabled() {
		if ( ! class_exists( 'wfConfig' ) ) {
			return false;
		}

		if ( ! method_exists( 'wfConfig', 'get' ) ) {
			return false;
		}

		return (bool) wfConfig::get( 'blockFakeBots' );
	}
}

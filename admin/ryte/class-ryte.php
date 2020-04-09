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
	 * @var bool
	 */
	private $is_manual_request = false;

	/**
	 * Holds the Ryte API response.
	 *
	 * @var array
	 */
	private $ryte_response = null;

	/**
	 * Constructs the object.
	 */
	public function __construct() {
		$this->maybe_add_weekly_schedule();
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
	 * Determines whether to add a custom cron weekly schedule.
	 *
	 * @return void
	 */
	public function maybe_add_weekly_schedule() {
		$schedules = wp_get_schedules();

		/*
		 * Starting with version 5.4, WordPress does have a default weekly cron
		 * schedule. See https://core.trac.wordpress.org/changeset/47062.
		 * We need to add a custom one only if the default one doesn't exist.
		 */
		if ( isset( $schedules['weekly'] ) ) {
			return;
		}

		// If there's no default cron weekly schedule, add a custom one.
		add_filter( 'cron_schedules', [ $this, 'add_weekly_schedule' ] );
	}

	/**
	 * Adds a custom weekly cron schedule.
	 *
	 * @param array $schedules The existing custom cron schedules.
	 *
	 * @return array Enriched list of custom cron schedules.
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
	 * @return bool Whether the request ran.
	 */
	public function fetch_from_ryte() {
		$ryte_option = $this->get_option();
		if ( ! $ryte_option->should_be_fetched() ) {
			return false;
		}

		$new_status = $this->request_indexability();

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
	 * Sends a request to Ryte to get the indexability status.
	 *
	 * @return int The indexability status value.
	 */
	protected function request_indexability() {
		$parameters = [];
		if ( $this->wordfence_protection_enabled() ) {
			$parameters['wf_strict'] = 1;
		}

		$request  = new WPSEO_Ryte_Request();
		$response = $request->do_request( get_option( 'home' ), $parameters );

		// Populate the ryte_response property.
		$this->ryte_response = $response;

		// It's a valid Ryte response because the array contains an `is_indexable` element.
		if ( isset( $response['is_indexable'] ) ) {
			return (int) $response['is_indexable'];
		}

		// It's not a valid Ryte response.
		return WPSEO_Ryte_Option::CANNOT_FETCH;
	}

	/**
	 * Schedules the cronjob to get the new indexability status.
	 *
	 * @return void
	 */
	private function schedule_cron() {
		if ( wp_next_scheduled( 'wpseo_ryte_fetch' ) ) {
			return;
		}

		wp_schedule_event( time(), 'weekly', 'wpseo_ryte_fetch' );
	}

	/**
	 * Unschedules the cronjob to get the new indexability status.
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

	/**
	 * Retrieves the Ryte API response property.
	 *
	 * @return array|WP_Error The response or WP_Error on failure.
	 */
	public function get_response() {
		return $this->ryte_response;
	}
}

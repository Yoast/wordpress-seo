<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Handles the request for getting the Ryte status.
 *
 * @deprecated 18.5
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
	 *
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		$this->maybe_add_weekly_schedule();
	}

	/**
	 * Sets up the hooks.
	 *
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		if ( ! self::is_active() ) {
			return;
		}

		// Sets the action for the Ryte fetch cron job.
		add_action( 'wpseo_ryte_fetch', [ $this, 'fetch_from_ryte' ] );
	}

	/**
	 * Determines if we can use the functionality.
	 *
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return bool True if this functionality can be used.
	 */
	public static function is_active() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
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
	 *
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 */
	public function activate_hooks() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		if ( $this->get_option()->is_enabled() ) {
			$this->schedule_cron();

			return;
		}

		$this->unschedule_cron();
	}

	/**
	 * Determines whether to add a custom cron weekly schedule.
	 *
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function maybe_add_weekly_schedule() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		// If there's no default cron weekly schedule, add a custom one.
		add_filter( 'cron_schedules', [ $this, 'add_weekly_schedule' ] );
	}

	/**
	 * Adds a custom weekly cron schedule.
	 *
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @param array $schedules The existing custom cron schedules.
	 *
	 * @return array Enriched list of custom cron schedules.
	 */
	public function add_weekly_schedule( $schedules ) {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		if ( ! is_array( $schedules ) ) {
			$schedules = [];
		}

		/*
		 * Starting with version 5.4, WordPress does have a default weekly cron
		 * schedule. See https://core.trac.wordpress.org/changeset/47062.
		 * We need to add a custom one only if the default one doesn't exist.
		 */
		if ( isset( $schedules['weekly'] ) ) {
			return $schedules;
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
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return bool|null Whether the request ran.
	 */
	public function fetch_from_ryte() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		// Don't do anything when the WordPress environment type isn't "production".
		if ( wp_get_environment_type() !== 'production' ) {
			return;
		}

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
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return WPSEO_Ryte_Option The option.
	 */
	protected function get_option() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		return new WPSEO_Ryte_Option();
	}

	/**
	 * Sends a request to Ryte to get the indexability status.
	 *
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return int The indexability status value.
	 */
	protected function request_indexability() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
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
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	private function schedule_cron() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		if ( wp_next_scheduled( 'wpseo_ryte_fetch' ) ) {
			return;
		}

		wp_schedule_event( time(), 'weekly', 'wpseo_ryte_fetch' );
	}

	/**
	 * Unschedules the cronjob to get the new indexability status.
	 *
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	private function unschedule_cron() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		if ( ! wp_next_scheduled( 'wpseo_ryte_fetch' ) ) {
			return;
		}

		wp_clear_scheduled_hook( 'wpseo_ryte_fetch' );
	}

	/**
	 * Checks if WordFence protects the site against 'fake' Google crawlers.
	 *
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return bool True if WordFence protects the site.
	 */
	private function wordfence_protection_enabled() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
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
	 * @deprecated 18.5
	 * @codeCoverageIgnore
	 *
	 * @return array|WP_Error The response or WP_Error on failure.
	 */
	public function get_response() {
		_deprecated_function( __METHOD__, 'Yoast SEO 18.5' );
		return $this->ryte_response;
	}
}

<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use wfConfig;
use WP_Error;
use WPSEO_Ryte_Option;
use WPSEO_Ryte_Request;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Handles the request for getting the Ryte status.
 */
class Ryte_Integration implements Integration_Interface {

	/**
	 * Holds the Ryte API response.
	 *
	 * @var array
	 */
	private $ryte_response = null;

	/**
	 * The options helper object used to determine if Ryte is active or not.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructor.
	 *
	 * @param Options_Helper $options_helper The options helper object used to determine if Ryte is active or not.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
		$this->maybe_add_weekly_schedule();
	}

	/**
	 * Sets up the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->is_active() ) {
			return;
		}

		// Sets the action for the Ryte fetch cron job.
		add_action( 'wpseo_ryte_fetch', [ $this, 'fetch_from_ryte' ] );
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * In this case: only when on an admin page.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Determines if we can use the functionality.
	 *
	 * @return bool True if this functionality can be used.
	 */
	public function is_active() {
		if ( wp_doing_ajax() ) {
			return false;
		}

		if ( ! $this->options_helper->get( 'ryte_indexability' ) ) {
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
	 * @return bool Whether the request ran.
	 */
	public function fetch_from_ryte() {
		// Don't do anything when the WordPress environment type isn't "production".
		if ( wp_get_environment_type() !== 'production' ) {
			return false;
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
	 * @return WPSEO_Ryte_Option The option.
	 */
	public function get_option() {
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

		$request = new WPSEO_Ryte_Request();

		/**
		 * Filter: 'wpseo_change_home_url' - Allow filtering the home URL that is used by our integrations, eg. the Ryte integration for indexability.
		 *
		 * @param string $site_url The home URL that is used by our integrations, eg. the Ryte integration for indexability.
		 */
		$site_url = \apply_filters( 'wpseo_change_home_url', get_option( 'home' ) );
		$response = $request->do_request( $site_url, $parameters );

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
	 * @return bool True if WordFence protects the site.
	 */
	private function wordfence_protection_enabled() {
		if ( ! class_exists( wfConfig::class ) ) {
			return false;
		}

		if ( ! method_exists( wfConfig::class, 'get' ) ) {
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

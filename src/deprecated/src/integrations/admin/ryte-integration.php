<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use wfConfig;
use WP_Error;
use WPSEO_Ryte_Option;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Handles the request for getting the Ryte status.
 *
 * @deprecated 19.6
 * @codeCoverageIgnore
 */
class Ryte_Integration implements Integration_Interface {

	/**
	 * Constructor.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper $options_helper The options helper object used to determine if Ryte is active or not.
	 */
	public function __construct( Options_Helper $options_helper ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Sets up the hooks.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * In this case: only when on an admin page.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Determines if we can use the functionality.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return bool True if this functionality can be used.
	 */
	public function is_active() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return false;
	}

	/**
	 * Hooks to run on plugin activation.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 */
	public function activate_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Determines whether to add a custom cron weekly schedule.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function maybe_add_weekly_schedule() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Adds a custom weekly cron schedule.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param array $schedules The existing custom cron schedules.
	 *
	 * @return array Enriched list of custom cron schedules.
	 */
	public function add_weekly_schedule( $schedules ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return [];
	}

	/**
	 * Fetches the data from Ryte.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the request ran.
	 */
	public function fetch_from_ryte() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return true;
	}

	/**
	 * Retrieves the option to use.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return WPSEO_Ryte_Option The option.
	 */
	public function get_option() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return new WPSEO_Ryte_Option();
	}

	/**
	 * Sends a request to Ryte to get the indexability status.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return int The indexability status value.
	 */
	protected function request_indexability() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return -1;
	}

	/**
	 * Retrieves the Ryte API response property.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return array|WP_Error The response or WP_Error on failure.
	 */
	public function get_response() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return [];
	}
}

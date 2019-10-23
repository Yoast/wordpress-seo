<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\admin\google_search_console
 */

/**
 * Class WPSEO_GSC.
 */
class WPSEO_GSC implements WPSEO_WordPress_Integration {

	/**
	 * The option where data will be stored.
	 *
	 * @var string
	 */
	const OPTION_WPSEO_GSC = 'wpseo-gsc';

	/**
	 * Outputs the HTML for the redirect page.
	 *
	 * @return void
	 */
	public function display() {
		require_once WPSEO_PATH . 'admin/google_search_console/views/gsc-display.php';
	}

	/**
	 * Registers the hooks.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Handles the dashboard notification.
	 *
	 * If the Google Search Console has no credentials, show a notification
	 * for the user to give them a heads up. This message is dismissable.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_gsc_notification() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Makes sure the settings will be registered, so data can be stored.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_settings() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Displays the table.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function display_table() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Loads the admin redirects scripts.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function page_scripts() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Sets the screen options.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $status Status string.
	 * @param string $option Option key.
	 * @param string $value  Value to return.
	 *
	 * @return mixed The screen option value. False when not errors_per_page.
	 */
	public function set_screen_option( $status, $option, $value ) {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		return false;
	}

	/**
	 * Sets the tab help on top of the screen.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function set_help() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );
	}

	/**
	 * Run init logic.
	 *
	 * @codeCoverageIgnore
	 *
	 * @deprecated 9.5
	 *
	 * @return void
	 */
	public function init() {
		_deprecated_function( __METHOD__, 'WPSEO 9.5' );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedClassFound -- Reason: The class is deprecated.

/**
 * Represents the values for a single Yoast Premium extension plugin.
 */
class WPSEO_License_Page_Manager implements WPSEO_WordPress_Integration {

	/**
	 * Version number for License Page Manager.
	 *
	 * @var string
	 */
	const VERSION_BACKWARDS_COMPATIBILITY = '2';

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );
	}

	/**
	 * Removes the faulty set notifications.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 */
	public function remove_faulty_notifications() {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );
	}

	/**
	 * Handles the response.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @param array  $response          HTTP response.
	 * @param array  $request_arguments HTTP request arguments. Unused.
	 * @param string $url               The request URL.
	 *
	 * @return array The response array.
	 */
	public function handle_response( array $response, $request_arguments, $url ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.4' );

		return $response;
	}

	/**
	 * Returns the license page to use based on the version number.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 *
	 * @return string The page to use.
	 */
	public function get_license_page() {
		_deprecated_function( __METHOD__, '15.4' );

		return 'licenses';
	}

	/**
	 * Validates the extensions and show a notice for the invalid extensions.
	 *
	 * @deprecated 15.4
	 * @codeCoverageIgnore
	 */
	public function validate_extensions() {
		_deprecated_function( __METHOD__, '15.4' );
	}
}
// phpcs:enable

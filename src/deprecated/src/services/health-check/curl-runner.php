<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Helpers\Curl_Helper;

/**
 * Runs the Curl health check.
 *
 * @deprecated 19.7.2
 * @codeCoverageIgnore
 */
class Curl_Runner implements Runner_Interface {

	/**
	 * Sets the minimum cURL version for this health check to pass.
	 */
	const MINIMUM_CURL_VERSION = '7.34.0';

	/**
	 * Sets the target URL for testing whether the MyYoast API is reachable.
	 */
	const MYYOAST_API_REQUEST_URL = 'sites/current';

	/**
	 * Constructor.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @psalm-suppress InvalidClass MyYoast is a product name, so it's an exception to the class naming conventions.
	 * @param WPSEO_Addon_Manager         $addon_manager                The add-on manager.
	 * @param MyYoast_Api_Request_Factory $my_yoast_api_request_factory A MyYoast API request object.
	 * @param Curl_Helper                 $curl_helper                  A cURL helper object for obtaining
	 *                                                                  cURL installation information.
	 */
	public function __construct(
		WPSEO_Addon_Manager $addon_manager,
		MyYoast_Api_Request_Factory $my_yoast_api_request_factory,
		Curl_Helper $curl_helper
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );
	}

	/**
	 * Runs the health check. Checks if cURL is installed and up to date, and if it's able to reach the MyYoast API
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function run() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );
	}

	/**
	 * Returns whether the health check was successful.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @return bool True if all the routines for this health check were successful.
	 */
	public function is_successful() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );

		return true;
	}

	/**
	 * Returns whether there are premium plugins installed.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @return bool True if there are premium plugins installed.
	 */
	public function has_premium_plugins_installed() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );

		return false;
	}

	/**
	 * Returns whether cURL was able to reach the MyYoast API.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @return bool True if cURL was able to reach the MyYoast API.
	 */
	public function can_reach_my_yoast_api() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );

		return true;
	}

	/**
	 * Returns whether the installed cURL version is recent enough.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @return bool True if the installed cURL version is more recent than MINIMUM_CURL_VERSION.
	 */
	public function has_recent_curl_version_installed() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );

		return true;
	}
}

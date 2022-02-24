<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Addon_Manager;
use WPSEO_MyYoast_Api_Request;
use Yoast\WP\SEO\Helpers\Curl_Helper;

/**
 * Runs the Curl health check.
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
	 * True when cURL is installed.
	 *
	 * @var bool
	 */
	private $curl_installed = false;

	/**
	 * True when cURL is equal to or more recent than MINIMUM_CURL_VERSION.
	 *
	 * @var bool
	 */
	private $curl_is_recent = false;

	/**
	 * True when the health check got a response from the MyYoast API.
	 *
	 * @var bool
	 */
	private $got_my_yoast_api_response = false;

	/**
	 * True when there are Yoast add-ons installed.
	 *
	 * @var bool
	 */
	private $has_installed_addons = false;

	/**
	 * The add-on manger that the health check uses to determine if there are any add-ons installed.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Factory for the MyYoast API request object that the health check uses to check if cURL works correctly.
	 *
	 * @var MyYoast_API_Request_Factory
	 */
	private $my_yoast_api_request_factory;

	/**
	 * The cURL helper from which the health check gets information about the installed cURL version.
	 *
	 * @var Curl_Helper
	 */
	private $curl_helper;

	/**
	 * Constructor.
	 *
	 * @param WPSEO_Addon_Manager         $addon_manager The add-on manager.
	 * @param MyYoast_Api_Request_Factory $my_yoast_api_request_factory A MyYoast API request object.
	 * @param Curl_Helper                 $curl_helper A cURL helper object for obtaining cURL installation information.
	 */
	public function __construct(
		WPSEO_Addon_Manager $addon_manager,
		MyYoast_Api_Request_Factory $my_yoast_api_request_factory,
		Curl_Helper $curl_helper
	) {
		$this->addon_manager                = $addon_manager;
		$this->my_yoast_api_request_factory = $my_yoast_api_request_factory;
		$this->curl_helper                  = $curl_helper;
	}

	/**
	 * Runs the health check. Checks if cURL is installed and up to date, and if it's able to reach the MyYoast API
	 *
	 * @return void
	 */
	public function run() {
		$this->check_has_installed_addons();
		$this->check_curl_installed();

		if ( ! $this->curl_installed ) {
			return;
		}

		$this->check_curl_is_recent();
		$this->check_can_reach_my_yoast_api();
	}

	/**
	 * Checks if there are installed Yoast add-ons.
	 *
	 * @return void
	 */
	private function check_has_installed_addons() {
		$this->has_installed_addons = $this->addon_manager->has_installed_addons();
	}

	/**
	 * Checks if cURL is installed.
	 *
	 * @return void
	 */
	private function check_curl_installed() {
		$this->curl_installed = $this->curl_helper->is_installed();
	}

	/**
	 * Checks if the installed cURL version is equal to or more recent than MINIMUM_CURL_VERSION.
	 *
	 * @return void
	 */
	private function check_curl_is_recent() {
		$version = $this->curl_helper->get_version();

		$this->curl_is_recent = version_compare( $version, self::MINIMUM_CURL_VERSION, '>=' );
	}

	/**
	 * Checks if cURL is able to reach the MyYoast API.
	 *
	 * @return void
	 */
	private function check_can_reach_my_yoast_api() {
		$api_request  = $this->my_yoast_api_request_factory->create( self::MYYOAST_API_REQUEST_URL );
		$got_response = $api_request->fire();


		$this->got_my_yoast_api_response = $got_response;
	}

	/**
	 * Returns whether the health check was successful.
	 *
	 * @return bool True if all the routines for this health check were successful.
	 */
	public function is_successful() {
		return $this->has_installed_addons && $this->curl_is_recent && $this->got_my_yoast_api_response;
	}

	/**
	 * Returns whether there are premium plugins installed.
	 *
	 * @return bool True if there are premium plugins installed.
	 */
	public function has_premium_plugins_installed() {
		return $this->has_installed_addons;
	}

	/**
	 * Returns whether cURL was able to reach the MyYoast API.
	 *
	 * @return bool True if cURL was able to reach the MyYoast API.
	 */
	public function can_reach_my_yoast_api() {
		return $this->got_my_yoast_api_response;
	}

	/**
	 * Returns whether the installed cURL version is recent enough.
	 *
	 * @return bool True if the installed cURL version is more recent than MINIMUM_CURL_VERSION.
	 */
	public function has_recent_curl_version_installed() {
		return $this->curl_is_recent;
	}
}

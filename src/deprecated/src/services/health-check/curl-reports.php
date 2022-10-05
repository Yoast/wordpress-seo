<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Admin_Utils;
use WPSEO_Shortlinker;

/**
 * Presents a set of different messages for the cURL health check.
 *
 * @deprecated 19.7.2
 * @codeCoverageIgnore
 */
class Curl_Reports {

	/**
	 * Constructor
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @param  Report_Builder_Factory $report_builder_factory The factory for result builder objects.
	 *                                                        This class uses the report builder to generate WordPress-friendly
	 *                                                        health check results.
	 * @param  WPSEO_Shortlinker      $shortlinker            The WPSEO_Shortlinker object used to generate short links.
	 * @return void
	 */
	public function __construct(
		Report_Builder_Factory $report_builder_factory,
		WPSEO_Shortlinker $shortlinker
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );
	}

	/**
	 * Returns the message for a successful health check.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_success_result() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );

		return [];
	}

	/**
	 * Returns the message for when the health check was unable to reach the MyYoast API.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_my_yoast_api_not_reachable_result() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );

		return [];
	}

	/**
	 * Returns the message for a successful health check.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_no_recent_curl_version_installed_result() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );

		return [];
	}
}

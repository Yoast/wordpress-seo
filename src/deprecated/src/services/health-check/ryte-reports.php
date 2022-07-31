<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Shortlinker;

/**
 * Presents a set of different messages for the Ryte health check.
 *
 * @deprecated 19.6
 * @codeCoverageIgnore
 */
class Ryte_Reports {

	use Reports_Trait;

	/**
	 * Constructor
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param Report_Builder_Factory $report_builder_factory The factory for result builder objects.
	 *                                                       This class uses the report builder to generate
	 *                                                       WordPress-friendly health check results.
	 * @param WPSEO_Shortlinker      $shortlinker            The WPSEO_Shortlinker object used to generate short
	 *                                                       links.
	 */
	public function __construct(
		Report_Builder_Factory $report_builder_factory,
		WPSEO_Shortlinker $shortlinker
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Returns the message for a successful health check.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_success_result() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return [];
	}

	/**
	 * Returns the report for a health check result in which the site was not indexable.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_not_indexable_result() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return [];
	}

	/**
	 * Returns the report for when the health check was unable to determine indexability.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_unknown_indexability_result() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return [];
	}

	/**
	 * Returns the result for when the health check got an error response from Ryte.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param array $response_error The error response from Ryte.
	 *
	 * @return string[] The message as a WordPress site status report.
	 */
	public function get_response_error_result( $response_error ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return [];
	}
}

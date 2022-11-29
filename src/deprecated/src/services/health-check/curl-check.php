<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Passes if the health check can reach the MyYoast API using a recent enough cURL version.
 *
 * @deprecated 19.7.2
 * @codeCoverageIgnore
 */
class Curl_Check extends Health_Check {

	/**
	 * Constructor.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @param Curl_Runner  $runner  The object that implements the actual health check.
	 * @param Curl_Reports $reports The object that generates WordPress-friendly results.
	 */
	public function __construct(
		Curl_Runner $runner,
		Curl_Reports $reports
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );
	}

	/**
	 * Returns a human-readable label for this health check.
	 *
	 * @deprecated 19.7.2
	 * @codeCoverageIgnore
	 *
	 * @return string The human-readable label.
	 */
	public function get_test_label() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );

		return '';
	}

	/**
	 * Returns the WordPress-friendly health check result.
	 *
	 * @return string[] The WordPress-friendly health check result.
	 */
	protected function get_result() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.7.2' );

		return [];
	}
}

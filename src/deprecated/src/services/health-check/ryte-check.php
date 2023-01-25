<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Passes if the health check determines that the site is indexable using Ryte.
 *
 * @deprecated 19.6
 * @codeCoverageIgnore
 */
class Ryte_Check extends Health_Check {

	/**
	 * Constructor.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param Ryte_Runner  $runner  The object that implements the actual health check.
	 * @param Ryte_Reports $reports The object that generates WordPress-friendly results.
	 */
	public function __construct(
		Ryte_Runner $runner,
		Ryte_Reports $reports
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Returns a human-readable label for this health check.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return string The human-readable label.
	 */
	public function get_test_label() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return '';
	}

	/**
	 * Returns the WordPress-friendly health check result.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return string[] The WordPress-friendly health check result.
	 */
	protected function get_result() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return [];
	}
}

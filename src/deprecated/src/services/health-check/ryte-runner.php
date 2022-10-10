<?php

namespace Yoast\WP\SEO\Services\Health_Check;

use WPSEO_Utils;
use Yoast\WP\SEO\Integrations\Admin\Ryte_Integration;

/**
 * Runs the Ryte health check.
 *
 * @deprecated 19.6
 * @codeCoverageIgnore
 */
class Ryte_Runner implements Runner_Interface {

	/**
	 * Constructor.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @param Ryte_Integration $ryte  The Ryte_Integration object that the health check uses to check indexability.
	 * @param WPSEO_Utils      $utils The WPSEO_Utils object used to determine whether the site is in development mode.
	 */
	public function __construct(
		Ryte_Integration $ryte,
		WPSEO_Utils $utils
	) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Runs the health check. Checks if Ryte is accessible and whether the site is indexable.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function run() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );
	}

	/**
	 * Checks if the site is a live production site that has Ryte enabled.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function should_run() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return false;
	}

	/**
	 * Checks if the site is indexable.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function is_successful() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return true;
	}

	/**
	 * Checks if the site's indexability is unknown.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return bool Returns true if the site indexability is unknown even though getting a response from Ryte was
	 *              successful.
	 */
	public function has_unknown_indexability() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return false;
	}

	/**
	 * Checks whether there was a response error when attempting a request to Ryte.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return bool True if the health check got a valid error response.
	 */
	public function got_response_error() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return true;
	}

	/**
	 * Returns the error response is there was one.
	 *
	 * @deprecated 19.6
	 * @codeCoverageIgnore
	 *
	 * @return array|null
	 */
	public function get_error_response() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 19.6' );

		return [];
	}
}

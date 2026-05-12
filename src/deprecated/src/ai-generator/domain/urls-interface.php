<?php

namespace Yoast\WP\SEO\AI_Generator\Domain;

/**
 * Helper class to get the URLs needed for the AI Generator API.
 *
 * @deprecated 27.7
 * @codeCoverageIgnore
 */
interface URLs_Interface {

	/**
	 * Gets the licence URL.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string The license URL.
	 */
	public function get_license_url(): string;

	/**
	 * Gets the callback URL to be used by the API to send back the access token, refresh token and code challenge.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string The callback URL.
	 */
	public function get_callback_url(): string;

	/**
	 * Gets the callback URL to be used by the API to send back the refreshed JWTs once they expire.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string The refresh callback URL.
	 */
	public function get_refresh_callback_url(): string;
}

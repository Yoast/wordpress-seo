<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\Domain;

/**
 * Helper class to get the URLs needed for the AI Generator API.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 */
interface URLs_Interface {

	/**
	 * Gets the licence URL.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return string The license URL.
	 */
	public function get_license_url(): string;

	/**
	 * Gets the callback URL to be used by the API to send back the access token, refresh token and code challenge.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return string The callback URL.
	 */
	public function get_callback_url(): string;

	/**
	 * Gets the callback URL to be used by the API to send back the refreshed JWTs once they expire.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return string The refresh callback URL.
	 */
	public function get_refresh_callback_url(): string;
}

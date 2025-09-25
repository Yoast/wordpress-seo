<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Ai_Generator\Infrastructure;

use Yoast\WP\SEO\Ai_Generator\Domain\URLs_Interface;

/**
 * Class WordPress_URLs
 * Provides URLs for the AI Generator API in a WordPress context.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 */
class WordPress_URLs implements URLs_Interface {

	/**
	 * Gets the license URL.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return string The license URL.
	 */
	public function get_license_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Generator\Infrastructure\WordPress_URLs::get_license_url' );

		return '';
	}

	/**
	 * Gets the callback URL to be used by the API to send back the access token, refresh token and code challenge.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return string The callbacks URL.
	 */
	public function get_callback_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Generator\Infrastructure\WordPress_URLs::get_callback_url' );

		return '';
	}

	/**
	 * Gets the callback URL to be used by the API to send back the refreshed JWTs once they expire.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return string The callbacks URL.
	 */
	public function get_refresh_callback_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\Generator\Infrastructure\WordPress_URLs::get_refresh_callback_url' );

		return '';
	}
}

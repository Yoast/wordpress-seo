<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_Generator\Infrastructure;

use WPSEO_Utils;
use Yoast\WP\SEO\AI_Generator\Domain\URLs_Interface;

/**
 * Class WordPress_URLs
 * Provides URLs for the AI Generator API in a WordPress context.
 *
@deprecated 26.3
 *
 * @codeCoverageIgnore
 */
class WordPress_URLs implements URLs_Interface {

	/**
	 * Gets the license URL.
	 *
	 * @deprecated 26.3
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The license URL.
	 */
	public function get_license_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Generate\Infrastructure\WordPress_URLs::get_license_url' );

		return WPSEO_Utils::get_home_url();
	}

	/**
	 * Gets the callback URL to be used by the API to send back the access token, refresh token and code challenge.
	 *
	 * @deprecated 26.3
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The callbacks URL.
	 */
	public function get_callback_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Generate\Infrastructure\WordPress_URLs::get_callback_url' );

		return \get_rest_url( null, 'yoast/v1/ai_generator/callback' );
	}

	/**
	 * Gets the callback URL to be used by the API to send back the refreshed JWTs once they expire.
	 *
	 * @deprecated 26.3
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The callbacks URL.
	 */
	public function get_refresh_callback_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\Generate\Infrastructure\WordPress_URLs::get_refresh_callback_url' );

		return \get_rest_url( null, 'yoast/v1/ai_generator/refresh_callback' );
	}
}

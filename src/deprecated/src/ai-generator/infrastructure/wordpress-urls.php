<?php

namespace Yoast\WP\SEO\AI_Generator\Infrastructure;

use WPSEO_Utils;
use Yoast\WP\SEO\AI_Generator\Domain\URLs_Interface;

/**
 * Class WordPress_URLs
 * Provides URLs for the AI Generator API in a WordPress context.
 *
 * @deprecated 27.5
 * @codeCoverageIgnore
 */
class WordPress_URLs implements URLs_Interface {

	/**
	 * Gets the license URL.
	 *
	 * @return string The license URL.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_license_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return WPSEO_Utils::get_home_url();
	}

	/**
	 * Gets the callback URL to be used by the API to send back the access token, refresh token and code challenge.
	 *
	 * @return string The callbacks URL.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_callback_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return \get_rest_url( null, 'yoast/v1/ai_generator/callback' );
	}

	/**
	 * Gets the callback URL to be used by the API to send back the refreshed JWTs once they expire.
	 *
	 * @return string The callbacks URL.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function get_refresh_callback_url(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.5', 'Update Yoast SEO premium to 27.4' );

		return \get_rest_url( null, 'yoast/v1/ai_generator/refresh_callback' );
	}
}

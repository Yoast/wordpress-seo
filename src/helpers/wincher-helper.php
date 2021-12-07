<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Property_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Token_Exception;

/**
 * A helper object for Wincher matters.
 */
class Wincher_Helper {

	/**
	 * Checks if the user is logged in to Wincher.
	 *
	 * @return bool The Wincher login status.
	 */
	public function login_status() {
		try {
			$wincher = YoastSEO()->classes->get( Wincher_Client::class );
		} catch ( Empty_Property_Exception $e ) {
			// Return false if token is malformed (empty property).
			return false;
		}

		// Get token (and refresh it if it's expired).
		try {
			$wincher->get_tokens();
		} catch ( Authentication_Failed_Exception $e ) {
			return false;
		} catch ( Empty_Token_Exception $e ) {
			return false;
		}

		return $wincher->has_valid_tokens();
	}

	/**
	 * Returns the Wincher links that can be used to localize the global admin
	 * script. Mainly exists to avoid duplicating these links in multiple places
	 * around the code base.
	 *
	 * @return string[]
	 */
	public function get_admin_global_links() {
		return [
			'links.wincher.website'   => 'https://www.wincher.com?utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast',
			'links.wincher.pricing'   => 'https://www.wincher.com/pricing?utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast',
			'links.wincher.login'     => 'https://app.wincher.com/login?utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast',
		];
	}
}

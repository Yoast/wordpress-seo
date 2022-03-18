<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Exceptions\OAuth\Authentication_Failed_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Property_Exception;
use Yoast\WP\SEO\Exceptions\OAuth\Tokens\Empty_Token_Exception;

/**
 * A helper object for Wincher matters.
 */
class Wincher_Helper {

	/**
	 * Holds the Options Page helper instance.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * Options_Helper constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns if conditionals are met. If not, the integration should be disabled.
	 *
	 * @param bool $return_conditional If the conditional class name that was unmet should be returned.
	 *
	 * @return bool|string Returns if the integration should be disabled.
	 */
	public function integration_is_disabled( $return_conditional = false ) {
		$conditionals = [ new Non_Multisite_Conditional() ];

		foreach ( $conditionals as $conditional ) {
			if ( ! $conditional->is_met() ) {

				if ( $return_conditional === true ) {
					return ( new \ReflectionClass( $conditional ) )->getShortName();
				}

				return true;
			}
		}

		return false;
	}

	/**
	 * Returns if the Wincher integration toggle is turned on.
	 *
	 * @return bool Returns if the integration toggle is set to true if conditionals are met.
	 */
	public function integration_is_active() {
		if ( $this->integration_is_disabled() ) {
			return false;
		}

		return $this->options->get( 'wincher_integration_active', true );
	}

	/**
	 * Return if Wincher should be active for this post editor page.
	 *
	 * @return bool Returns if Wincher should be active.
	 */
	public function is_active() {
		$is_wincher_active = $this->integration_is_active();

		if ( ! $is_wincher_active ) {
			return false;
		}

		return true;
	}

	/**
	 * Checks if the user is logged in to Wincher.
	 *
	 * @return bool The Wincher login status.
	 */
	public function login_status() {
		try {
			$wincher = \YoastSEO()->classes->get( Wincher_Client::class );
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
			'links.wincher.website' => 'https://www.wincher.com?utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast',
			'links.wincher.pricing' => 'https://www.wincher.com/pricing?utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast',
			'links.wincher.login'   => 'https://app.wincher.com/login?utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast',
		];
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Ajax.
 *
 * @deprecated 11.4
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Ajax {

	/**
	 * Setting the AJAX hooks for GSC.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * This method will be access by an AJAX request and will mark an issue as fixed.
	 *
	 * First it will do a request to the Google API.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	public function ajax_mark_as_fixed() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Handle the AJAX request and dismiss the GSC notice.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	public function dismiss_notice() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Saves the authorization code.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	public function save_auth_code() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Clears all authorization data.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	public function clear_auth_code() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Check if posted nonce is valid and return true if it is.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return mixed
	 */
	private function valid_nonce() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Returns an instance of the Google Search Console service.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return WPSEO_GSC_Service
	 */
	private function get_service() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return null;
	}

	/**
	 * Prints a JSON encoded string with the current profile config.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	private function get_profiles() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}
}

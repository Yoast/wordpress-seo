<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

if ( ! class_exists( 'Google_Client' ) ) {
	require_once( WPSEO_PREMIUM_PATH . 'classes/google/Google_Client.php' );
}

class WPSEO_GWT_Google_Client extends Google_Client {

	const OPTION_REFRESH_TOKEN = 'wpseo-premium-gwt-refresh_token';

	public function __construct() {

		parent::__construct();

		// Set our settings
		$this->setApplicationName( "WordPress SEO Premium" ); // Not sure if used
		$this->setClientId( '887668307827-4jhsr06rntrt3g3ss2r72dblf3ca7msv.apps.googleusercontent.com' );
		$this->setClientSecret( 'pPW5gLoTNtNHyiDH6YRn-CIB' );
		$this->setRedirectUri( 'urn:ietf:wg:oauth:2.0:oob' );
		$this->setScopes( array( 'https://www.google.com/webmasters/tools/feeds/' ) );

		// Let's get an access token if we've got a refresh token
		$refresh_token = $this->get_refresh_token();
		if ( '' != $refresh_token ) {

			// Refresh the token
			$response = $this->refreshToken( $refresh_token );

			// Check response
			if ( '' != $response ) {
				$response = json_decode( $response );

				// Check if there is an access_token
				if ( isset( $response->access_token ) ) {

					// Set access_token
					$this->setAccessToken( $response->access_token );

				}

			}

		}

	}

	/**
	 * Save the refresh token
	 *
	 * @param $refresh_token
	 */
	public function save_refresh_token( $refresh_token ) {
		update_option( self::OPTION_REFRESH_TOKEN, $refresh_token );
	}

	/**
	 * Return refresh token
	 *
	 * @return string
	 */
	public function get_refresh_token() {
		return get_option( self::OPTION_REFRESH_TOKEN, '' );
	}

}
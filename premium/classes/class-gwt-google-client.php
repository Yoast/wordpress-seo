<?php

if ( ! class_exists( 'Google_Client' ) ) {
	require_once( WPSEO_PREMIUM_PATH . 'classes/google/Google_Client.php' );
}

class WPSEO_GWT_Google_Client extends Google_Client {

	const OPTION_REFRESH_TOKEN = 'wpseo-premium-gwt-refresh_token';

	public function __construct() {

		parent::__construct();

		// Set our settings
		$this->setApplicationName( 'WordPress SEO by Yoast Premium' ); // Not sure if used
		$this->setClientId( '972827778625-rvd2mfvj3fnc97es9p57vqaap2lucm3h.apps.googleusercontent.com' );
		$this->setClientSecret( 'i32Z2SFYPdxNRALHf25uwMFW' );
		$this->setRedirectUri( 'urn:ietf:wg:oauth:2.0:oob' );
		$this->setScopes( array( 'https://www.google.com/webmasters/tools/feeds/' ) );

		// Let's get an access token if we've got a refresh token
		$refresh_token = $this->get_refresh_token();
		if ( '' != $refresh_token ) {

			try {
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
			} catch(Exception $e) {
				delete_option( 'wpseo-premium-gwt' );
				$this->save_refresh_token( '' );
			}

		}

	}

	/**
	 * Save the refresh token
	 *
	 * @param string $refresh_token
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
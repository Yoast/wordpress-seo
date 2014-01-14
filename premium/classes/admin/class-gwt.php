<?php

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

class WPSEO_GWT {

	const OPTION_REFRESH_TOKEN = 'wpseo-premium-gwt-refresh_token';

	private $access_token = null;

	/**
	 * The constructor
	 */
	public function __construct() {
		add_action( 'admin_init', array( $this, 'catch_authorization_code_post' ) );
	}

	/**
	 * Save the refresh token
	 *
	 * @param $refresh_token
	 */
	private function save_refresh_token( $refresh_token ) {
		update_option( self::OPTION_REFRESH_TOKEN, $refresh_token );
	}

	/**
	 * Get the refresh token
	 *
	 * @return mixed|void
	 */
	private function get_refresh_token() {
		return get_option( self::OPTION_REFRESH_TOKEN, null );
	}

	/**
	 * Get the access token, this is the correct function to retreive the WPSEO GWT access token
	 *
	 * @return null
	 */
	public function get_access_token() {
		if ( null === $this->access_token ) {

			// Check if we have a refresh token
			$refresh_token = $this->get_refresh_token();
			if ( null !== $refresh_token ) {
				// We do! Let's get a new access token
				// Do the actual access token refresh thingy...

				// Create a new client
				$client = new WPSEO_GWT_Google_Client();

				// Refresh token
				$response = $client->refreshToken( $refresh_token );

				// Check response
				if ( '' != $response ) {
					$response = json_decode( $response );

					// Check if there is an access_token
					if ( isset( $response->access_token ) ) {
						// Set access_token
						$this->access_token = $response->access_token;
					}

				}

			}

		}

		return $this->access_token;
	}

	/**
	 * Do authentication with Google servers and store refresh_token
	 *
	 * @param $authorization_code
	 */
	private function authenticate( $authorization_code ) {

		// Create a client object
		$client = new WPSEO_GWT_Google_Client();

		// Authenticate client
		$client->authenticate( $authorization_code );

		// Get access response
		$response = $client->getAccessToken();

		// Check if there is a response body
		if ( '' != $response ) {
			$response = json_decode( $response );

			if ( is_object( $response ) ) {

				// Save the refresh token
				$this->save_refresh_token( $response->refresh_token );

			}

		}

	}

	/**
	 * Catch the authorization_code POST and authenticate the user
	 */
	public function catch_authorization_code_post() {
		if ( isset ( $_POST['gwt']['authorization_code'] ) ) {
			// Authenticate user
			$this->authenticate( $_POST['gwt']['authorization_code'] );

			// Redirect user to prevent a post resubmission which causes an oauth error
			wp_redirect( admin_url( 'admin.php' ) . '?page=' . $_GET['page'] . '#top#google-wmt' );
			exit;
		}
	}

}
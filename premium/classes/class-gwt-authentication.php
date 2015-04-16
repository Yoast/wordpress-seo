<?php

class WPSEO_GWT_Authentication {

	/**
	 * Do authentication with Google servers and store refresh_token
	 *
	 * @param $authorization_code
	 *
	 * @return bool
	 */
	public function authenticate( $authorization_code ) {


		// Create a client object
		$client = new WPSEO_GWT_Google_Client();

		// Authenticate client
		try {
			$client->authenticate( $authorization_code );

			// Get access response
			$response = $client->getAccessToken();


			// Check if there is a response body
			if ( '' != $response ) {
				$response = json_decode( $response );

				if ( is_object( $response ) ) {

					// Save the refresh token
					$client->save_refresh_token( $response->refresh_token );

					return true;

				}

			}
		} catch ( Google_AuthException $exception ) {
			return false;
		}


		return false;
	}

}
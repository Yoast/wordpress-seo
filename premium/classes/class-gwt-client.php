<?php

class WPSEO_GWT_Client extends Yoast_Google_Client {

	protected $http_response_code;

	const OPTION_REFRESH_TOKEN = 'wpseo-premium-gwt-refresh_token';

	protected $default_config = array(
		'redirect_uri' => 'urn:ietf:wg:oauth:2.0:oob',
		'scopes'       => array( 'https://www.googleapis.com/auth/webmasters.readonly', 'https://www.google.com/webmasters/tools/feeds/' ),
	);

	/**
	 * Initialize the config and refresh the token
	 *
	 * @param array $config
	 */
	public function __construct( $config ) {

		parent::__construct();

		// Initialize the config to set all properties properly
		$this->init_config( $config );

		// Let's get an access token if we've got a refresh token
		$this->refresh_tokens();

	}

	/**
	 * Initialize the config, will merge given config with default config to be sure all settings are available
	 *
	 * @param $config
	 */
	protected function init_config( $config ) {
		$config = array_merge( $config, $this->default_config );

		if ( ! empty( $config['application_name'] ) ) {
			$this->setApplicationName( $config['application_name'] );
		} else {
			// @todo: throw new error

		}

		if ( ! empty( $config['client_id'] ) ) {
			$this->setClientId( $config['client_id'] );
		} else {
			// @todo: throw new error

		}

		if ( ! empty( $config['client_secret'] ) ) {
			$this->setClientSecret( $config['client_secret'] );
		} else {
			// @todo: throw new error
		}

		// Set our settings
		$this->setRedirectUri( $config['redirect_uri'] );
		$this->setScopes( $config['scopes'] );
		$this->setAccessType( 'offline' );
	}

	/**
	 * Refeshing the tokens
	 */
	protected function refresh_tokens() {
		$refresh_token = $this->get_refresh_token();

		if ( '' != $refresh_token ) {
			try {
				// Refresh the token
				$this->refreshToken( $refresh_token );

				$response = $this->getAuth()->token;

				// Check response
				if ( ! empty( $response ) ) {

					// Check if there is an access_token
					if ( ! empty ( $response['access_token'] ) ) {
						// Set access_token
						$this->setAccessToken( $response['access_token'] );
					}


				}
			} catch ( Exception $e ) {

			}
		}
	}

	/**
	 * Authenticate the client. If $authorization_code is empty it will lead the user through the validation process of
	 * Google. If set it will be get the access token for current session and save the refresh_token for future use
	 *
	 * @param mixed $authorization_code
	 *
	 * @return bool
	 */
	public function authenticate_client( $authorization_code = null ) {
		static $has_retried;

		// Authenticate client
		try {
			$this->authenticate( $authorization_code );

			// Get access response
			$response = $this->getAccessToken();

			// Check if there is a response body
			if ( ! empty( $response ) ) {
				$response = json_decode( $response );

				if ( is_object( $response ) ) {
					// Save the refresh token
					$this->save_refresh_token( $response->refresh_token );

					return true;
				}

			}
		} catch ( Yoast_Google_AuthException $exception ) {
			// If there aren't any attempts before, try again and set attempts on true, to prevent further attempts
			if ( empty( $has_retried ) ) {
				$has_retried = true;

				return $this->authenticate_client( $authorization_code );
			}
		}

		return false;
	}

	/**
	 * Doing a request to the API
	 *
	 * @param string $target_request_url
	 *
	 * @return Google_HttpRequest
	 */

	public function do_request( $target_request_url ) {
		// Get list sites response
		$response = $this->getIo()->authenticatedRequest( new Yoast_Google_HttpRequest( $target_request_url ) );

		$this->http_response_code = $response->getResponseHttpCode();

		return $response;
	}

	/**
	 * Getting the response code, saved from latest request to Google
	 * @return mixed
	 */
	public function get_http_response_code() {
		return $this->http_response_code;
	}


	/**
	 * Save the refresh token
	 *
	 * @param $refresh_token
	 */
	public function save_refresh_token( $refresh_token ) {
		update_option( self::OPTION_REFRESH_TOKEN, trim( $refresh_token ) );
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

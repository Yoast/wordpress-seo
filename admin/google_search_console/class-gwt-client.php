<?php
/**
 * @package WPSEO\Admin|Google_Search_Console
 */

/**
 * Class WPSEO_GWT_Client
 */
class WPSEO_GWT_Client extends Yoast_Google_Client {

	/**
	 * The option holding the refresh token
	 */
	const OPTION_REFRESH_TOKEN = 'wpseo-gwt-refresh_token';

	/**
	 * The option which contains the details about the access token
	 */
	const OPTION_ACCESS_TOKEN = 'wpseo-gwt-access_token';

	/**
	 * @var string
	 */
	protected $http_response_code;

	/**
	 * @var array
	 */
	protected $default_config = array(
		'redirect_uri' => 'urn:ietf:wg:oauth:2.0:oob',
		'scopes'       => array( 'https://www.googleapis.com/auth/webmasters' ),
	);

	/**
	 * @var string
	 */
	private $api_url = 'https://www.googleapis.com/webmasters/v3/';

	/**
	 * Initialize the config and refresh the token
	 *
	 * @param array $config
	 */
	public function __construct( $config ) {

		parent::__construct();

		// Initialize the config to set all properties properly.
		$this->init_config( $config );

		// Let's get an access token if we've got a refresh token.
		$this->refresh_tokens();
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

		// Authenticate client.
		try {
			$this->authenticate( $authorization_code );

			// Get access response.
			$response = $this->getAccessToken();

			// Check if there is a response body.
			if ( ! empty( $response ) ) {
				$response = json_decode( $response );

				if ( is_object( $response ) ) {
					// Save the refresh token.
					$this->save_refresh_token( $response->refresh_token );

					return true;
				}
			}
		} catch ( Yoast_Google_AuthException $exception ) {
			// If there aren't any attempts before, try again and set attempts on true, to prevent further attempts.
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
	 * @param string $request_method
	 *
	 * @return Google_HttpRequest
	 */
	public function do_request( $target_request_url, $request_method = 'GET' ) {
		// Get list sites response.
		$response = $this->getIo()->authenticatedRequest( new Yoast_Google_HttpRequest( $this->api_url . $target_request_url, $request_method ) );

		$this->http_response_code = $response->getResponseHttpCode();

		return $response;
	}

	/**
	 * Decode the JSON response
	 *
	 * @param object $response
	 * @param int    $accepted_response_code
	 *
	 * @return mixed
	 */
	public function decode_response( $response, $accepted_response_code = 200 ) {
		if ( $accepted_response_code === $response->getResponseHttpCode() ) {
			return json_decode( $response->getResponseBody() );
		}
	}

	/**
	 * Getting the response code, saved from latest request to Google
	 * @return mixed
	 */
	public function get_http_response_code() {
		return $this->http_response_code;
	}

	/**
	 * Clears the options and revokes the token
	 */
	public function clear_data() {
		$this->revokeToken();

		delete_option( self::OPTION_ACCESS_TOKEN );
		delete_option( self::OPTION_REFRESH_TOKEN );
	}

	/**
	 * Initialize the config, will merge given config with default config to be sure all settings are available
	 *
	 * @param array $config
	 */
	protected function init_config( array $config ) {
		$config = array_merge( $config, $this->default_config );

		if ( ! empty( $config['application_name'] ) ) {
			$this->setApplicationName( $config['application_name'] );
		}

		if ( ! empty( $config['client_id'] ) ) {
			$this->setClientId( $config['client_id'] );
		}

		if ( ! empty( $config['client_secret'] ) ) {
			$this->setClientSecret( $config['client_secret'] );
		}

		// Set our settings.
		$this->setRedirectUri( $config['redirect_uri'] );
		$this->setScopes( $config['scopes'] );
		$this->setAccessType( 'offline' );
	}
	/**
	 * Refreshing the tokens
	 */
	protected function refresh_tokens() {
		if ( ( $refresh_token = $this->get_refresh_token() ) !== '' && $this->access_token_expired() ) {
			try {
				// Refresh the token.
				$this->refreshToken( $refresh_token );

				$response = $this->getAuth()->token;

				// Check response and if there is an access_token.
				if ( ! empty( $response ) && ! empty ( $response['access_token'] ) ) {
					$this->save_access_token( $response );
				}
			}
			catch ( Exception $e ) {
				return false;
			}
		}
	}

	/**
	 * Save the refresh token
	 *
	 * @param string $refresh_token
	 */
	protected function save_refresh_token( $refresh_token ) {
		update_option( self::OPTION_REFRESH_TOKEN, trim( $refresh_token ) );
	}

	/**
	 * Return refresh token
	 *
	 * @return string
	 */
	protected function get_refresh_token() {
		return get_option( self::OPTION_REFRESH_TOKEN, '' );
	}

	/**
	 * Saving the access token as an option for further use till it expires.
	 *
	 * @param array $response
	 */
	protected function save_access_token( $response ) {
		update_option(
			self::OPTION_ACCESS_TOKEN,
			array(
				'refresh_token' => $this->get_refresh_token(),
				'access_token'  => $response['access_token'],
				'expires'       => current_time( 'timestamp' ) + $response['expires_in'],
				'expires_in'    => $response['expires_in'],
				'created'       => $response['created'],
			)
		);

		$this->setAccessToken( json_encode( $response ) );
	}

	/**
	 * Check if current access token is expired.
	 *
	 * @return bool
	 */
	private function access_token_expired() {
		$access_token = $this->get_access_token();

		if ( current_time( 'timestamp' ) >= $access_token['expires'] ) {
			return true;
		}

		$this->setAccessToken( json_encode( $access_token ) );
	}

	/**
	 * Getting the current access token from the options
	 *
	 * @return mixed
	 */
	private function get_access_token() {
		return get_option( self::OPTION_ACCESS_TOKEN, array( 'access_token' => false, 'expires' => 0 ) );
	}

}

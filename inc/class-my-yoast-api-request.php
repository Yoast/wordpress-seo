<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Inc
 */

/**
 * Handles requests to MyYoast.
 */
class WPSEO_MyYoast_Api_Request {

	/**
	 * The Request URL.
	 *
	 * @var string
	 */
	protected $url;

	/**
	 * The request parameters.
	 *
	 * @var array
	 */
	protected $args = array(
		'method'    => 'GET',
		'timeout'   => 5,
		'headers'   => array(
			'Accept-Encoding' => '*',
		),
	);

	/**
	 * Contains the fetched response.
	 *
	 * @var stdClass
	 */
	protected $response;

	/**
	 * Contains the error message when request went wrong.
	 *
	 * @var string
	 */
	protected $error_message = '';

	/**
	 * The MyYoast client object.
	 *
	 * @var WPSEO_MyYoast_Client
	 */
	protected $client;

	/**
	 * Constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $url  The request url.
	 * @param array  $args The request arguments.
	 */
	public function __construct( $url, array $args = array() ) {
		$this->url  = 'https://my.yoast.com/api/' . $url;
		$this->args = wp_parse_args( $args, $this->args );
	}

	/**
	 * Fires the request.
	 *
	 * @return bool True when request is successful.
	 */
	public function fire() {
		try {
			$response       = $this->do_request( $this->url, $this->args );
			$this->response = $this->decode_response( $response );

			return true;
		}

		/**
		 * The Authentication exception only occurs when using Access Tokens (>= PHP 5.6).
		 * In other case this exception won't be thrown.
		 *
		 * When authentication failed just try to get a new access token based
		 * on the refresh token. If that request also has an authentication issue
		 * we just invalidate the access token by removing it.
		 */
		catch ( WPSEO_MyYoast_Authentication_Exception $authentication_exception ) {
			try {
				$access_token = $this->get_access_token();

				if ( $access_token !== false ) {
					$response       = $this->do_request( $this->url, $this->args );
					$this->response = $this->decode_response( $response );
				}

				return true;
			}
			catch ( WPSEO_MyYoast_Authentication_Exception $authentication_exception ) {
				$this->error_message = $authentication_exception->getMessage();

				$this->remove_access_token( $this->get_current_user_id() );

				return false;
			}
			catch ( WPSEO_MyYoast_Bad_Request_Exception $bad_request_exception ) {
				$this->error_message = $bad_request_exception->getMessage();

				return false;
			}
		}
		catch ( WPSEO_MyYoast_Bad_Request_Exception $bad_request_exception ) {
			$this->error_message = $bad_request_exception->getMessage();

			return false;
		}
	}

	/**
	 * Retrieves the error message.
	 *
	 * @return string The set error message.
	 */
	public function get_error_message() {
		return $this->error_message;
	}

	/**
	 * Retrieves the response.
	 *
	 * @return stdClass The response object.
	 */
	public function get_response() {
		return $this->response;
	}

	/**
	 * Performs the request using WordPress internals.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $url               The request URL.
	 * @param array  $request_arguments The request arguments.
	 *
	 * @return string                                 The retrieved body.
	 * @throws WPSEO_MyYoast_Authentication_Exception When authentication has failed.
	 * @throws WPSEO_MyYoast_Bad_Request_Exception    When request is invalid.
	 */
	protected function do_request( $url, $request_arguments ) {
		$request_arguments = $this->enrich_request_arguments( $request_arguments );
		$response          = wp_remote_request( $url, $request_arguments );

		if ( is_wp_error( $response ) ) {
			throw new WPSEO_MyYoast_Bad_Request_Exception( $response->get_error_message() );
		}

		$response_code    = wp_remote_retrieve_response_code( $response );
		$response_message = wp_remote_retrieve_response_message( $response );

		// Do nothing, response code is okay.
		if ( $response_code === 200 || strpos( $response_code, '200' ) !== false ) {
			return wp_remote_retrieve_body( $response );
		}

		// Authentication failed, throw an exception.
		if ( strpos( $response_code, '401' ) && $this->has_oauth_support() ) {
			throw new WPSEO_MyYoast_Authentication_Exception( esc_html( $response_message ), 401 );
		}

		throw new WPSEO_MyYoast_Bad_Request_Exception( esc_html( $response_message ), (int) $response_code );
	}

	/**
	 * Decodes the JSON encoded response.
	 *
	 * @param string $response The response to decode.
	 *
	 * @return stdClass                             The json decoded response.
	 * @throws WPSEO_MyYoast_Invalid_JSON_Exception When decoded string is not a JSON object.
	 */
	protected function decode_response( $response ) {
		$response = json_decode( $response );

		if ( ! is_object( $response ) ) {
			throw new WPSEO_MyYoast_Invalid_JSON_Exception(
				esc_html__( 'No JSON object was returned.', 'wordpress-seo' )
			);
		}

		return $response;
	}

	/**
	 * Checks if MyYoast tokens are allowed and adds the token to the request body.
	 *
	 * When tokens are disallowed it will add the url to the request body.
	 *
	 * @param array $request_arguments The arguments to enrich.
	 *
	 * @return array The enriched arguments.
	 */
	protected function enrich_request_arguments( array $request_arguments ) {
		$request_arguments     = wp_parse_args( $request_arguments, array( 'headers' => array() ) );
		$addon_version_headers = $this->get_installed_addon_versions();

		foreach ( $addon_version_headers as $addon => $version ) {
			$request_arguments['headers'][ $addon . '-version' ] = $version;
		}

		$request_body = $this->get_request_body();
		if ( $request_body !== array() ) {
			$request_arguments['body'] = $request_body;
		}

		return $request_arguments;
	}

	/**
	 * Retrieves the request body based on URL or access token support.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array The request body.
	 */
	public function get_request_body() {
		if ( ! $this->has_oauth_support() ) {
			return array( 'url' => WPSEO_Utils::get_home_url() );
		}

		try {
			$access_token = $this->get_access_token();
			if ( $access_token ) {
				return array( 'token' => $access_token->getToken() );
			}
		}
			// @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
		catch ( WPSEO_MyYoast_Bad_Request_Exception $bad_request ) {
			// Do nothing.
		}

		return array();
	}

	/**
	 * Retrieves the access token.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool|WPSEO_MyYoast_AccessToken_Interface The AccessToken when valid.
	 * @throws WPSEO_MyYoast_Bad_Request_Exception      When something went wrong in getting the access token.
	 */
	protected function get_access_token() {
		$client = $this->get_client();

		if ( ! $client ) {
			return false;
		}

		$access_token = $client->get_access_token();

		if ( ! $access_token ) {
			return false;
		}

		if ( ! $access_token->hasExpired() ) {
			return $access_token;
		}

		try {
			$access_token = $client
				->get_provider()
				->getAccessToken(
					'refresh_token',
					array(
						'refresh_token' => $access_token->getRefreshToken(),
					)
				);

			$client->save_access_token( $this->get_current_user_id(), $access_token );

			return $access_token;
		}
		catch ( Exception $e ) {
			$error_code = $e->getCode();
			if ( $error_code >= 400 && $error_code < 500 ) {
				$this->remove_access_token( $this->get_current_user_id() );
			}

			throw new WPSEO_MyYoast_Bad_Request_Exception( $e->getMessage() );
		}
	}

	/**
	 * Retrieves an instance of the MyYoast client.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return WPSEO_MyYoast_Client Instance of the client.
	 */
	protected function get_client() {
		if ( $this->client === null ) {
			$this->client = new WPSEO_MyYoast_Client();
		}

		return $this->client;
	}

	/**
	 * Wraps the get current user id function.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return int The user id.
	 */
	protected function get_current_user_id() {
		return get_current_user_id();
	}

	/**
	 * Removes the access token for given user id.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $user_id The user id.
	 *
	 * @return void
	 */
	protected function remove_access_token( $user_id ) {
		if ( ! $this->has_oauth_support() ) {
			return;
		}

		// Remove the access token entirely.
		$this->get_client()->remove_access_token( $user_id );
	}

	/**
	 * Retrieves the installed addons as http headers.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array The installed addon versions.
	 */
	protected function get_installed_addon_versions() {
		$addon_manager = new WPSEO_Addon_Manager();

		return $addon_manager->get_installed_addons_versions();
	}

	/**
	 * Wraps the has_access_token support method.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool False to disable the support.
	 */
	protected function has_oauth_support() {
		return false;

		// @todo: Uncomment the following statement when we are implementing the oAuth flow.
		// return WPSEO_Utils::has_access_token_support();
	}
}

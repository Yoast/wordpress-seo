<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Inc
 */

/**
 * Handles requests to My Yoast.
 */
class WPSEO_MyYoast_Api_Request {

	/**
	 * The Request URL.
	 *
	 * @var string
	 */
	protected $url;

	/**
	 * The request paramaters.
	 *
	 * @var array
	 */
	protected $args = array(
		'method'    => 'GET',
		'timeout'   => 10,
		'sslverify' => false,
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
	 * Constructor
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
	 * Fires the request
	 *
	 * @return bool True when request is successful.
	 */
	public function fire() {
		try {
			$response       = $this->do_request( $this->url, $this->args );
			$this->response = $this->decode_response( $response );

			return true;
		}
		catch ( Requests_Exception $e ) {
			$this->error_message = $e->getMessage();

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
	 * @return string                       The retrieved body.
	 * @throws Requests_Exception_Transport When request is invalid.
	 */
	protected function do_request( $url, $request_arguments ) {
		$response = wp_remote_request( $url, $request_arguments );

		if ( is_wp_error( $response ) ) {
			throw new Requests_Exception_Transport( $response->get_error_message(), $response->get_error_code() );
		}

		$response_code = wp_remote_retrieve_response_code( $response );

		if ( strpos( $response_code, '200' ) === false ) {
			$response_message = wp_remote_retrieve_response_message( $response );
			$exception_class  = Requests_Exception_HTTP::get_class( $response_code );

			throw new $exception_class( $response_message );
		}

		return wp_remote_retrieve_body( $response );
	}

	/**
	 * Decodes the JSON encoded response.
	 *
	 * @param string $response The response to decode.
	 *
	 * @return array|stdClass               The json decoded response.
	 * @throws Requests_Exception_Transport When decoded string is not a JSON object.
	 */
	protected function decode_response( $response ) {
		$response = json_decode( $response );

		if ( ! is_object( $response ) ) {
			throw new Requests_Exception_Transport(
				esc_html__( 'No JSON object was returned.', 'wordpress-seo' ),
				'invalid_json'
			);
		}

		return $response;
	}

}

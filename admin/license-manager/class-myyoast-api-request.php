<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\License_Manager
 */

/**
 * Handles requests to the Yoast EDD API
 */
class MyYoast_API_Request {
	/**
	 * @var string Request URL
	 */
	private $url = '';
	/**
	 * @var array Request parameters
	 */
	private $args = array(
		'method'    => 'GET',
		'timeout'   => 10,
		'sslverify' => true,
		'headers'   => array(
			'Accept-Encoding' => '*',
			'X-Yoast-EDD'     => '1',
		),
	);
	/**
	 * @var boolean
	 */
	private $success = false;
	/**
	 * @var mixed
	 */
	private $response;
	/**
	 * The error message.
	 *
	 * @var string
	 */
	private $error_message = '';

	/**
	 * Class constructor.
	 *
	 * @param string $url  The URL to do a request to.
	 * @param array  $args The arguments for the request.
	 */
	public function __construct( $url, array $args = array() ) {

		// set api url
		$this->url = $url;

		// set request args (merge with defaults)
		$this->args = wp_parse_args( $args, $this->args );

		// fire the request
		$this->success = $this->fire();
	}

	/**
	 * Fires the request, automatically called from constructor.
	 *
	 * @return boolean
	 */
	private function fire() {

		// fire request to shop
		$response = wp_remote_request( $this->url, $this->args );

		// validate raw response
		if ( $this->validate_raw_response( $response ) === false ) {
			return false;
		}

		// decode the response
		$this->response = json_decode( wp_remote_retrieve_body( $response ) );

		// response should be an object
		if ( ! is_object( $this->response ) ) {
			$this->error_message = 'No JSON object was returned.';

			return false;
		}

		return true;
	}

	/**
	 * Validates that we got a proper API response.
	 *
	 * @param array $response The response array.
	 *
	 * @return boolean
	 */
	private function validate_raw_response( $response ) {

		// make sure response came back okay
		if ( is_wp_error( $response ) ) {
			$this->error_message = $response->get_error_message();

			return false;
		}

		// check response code, should be 200
		$response_code = wp_remote_retrieve_response_code( $response );

		if ( false === strstr( $response_code, '200' ) ) {

			$response_message    = wp_remote_retrieve_response_message( $response );
			$this->error_message = "{$response_code} {$response_message}";

			return false;
		}

		return true;
	}

	/**
	 * Was a valid response returned?
	 *
	 * @return boolean
	 */
	public function is_valid() {
		return ( $this->success === true );
	}

	/**
	 * Retrieve the error message.
	 *
	 * @return string
	 */
	public function get_error_message() {
		return $this->error_message;
	}

	/**
	 * Retrieve the response.
	 *
	 * @return object
	 */
	public function get_response() {
		return $this->response;
	}
}

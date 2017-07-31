<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class handles a post request being send to a given endpoint.
 */
class WPSEO_Remote_Request {

	/** @var string */
	protected $endpoint = '';

	/** @var array */
	protected $args = array(
		'blocking'  => false,
		'sslverify' => false,
	);

	/** @var WP_Error|null */
	protected $response_error = null;

	/** @var mixed */
	protected $response_body = null;

	/**
	 * Sets the endpoint and arguments.
	 *
	 * @param string $endpoint The endpoint to send the request to.
	 * @param array  $args     The arguments to use in this request.
	 */
	public function __construct( $endpoint, array $args = array() ) {
		$this->endpoint = $endpoint;
		$this->args     = array_merge( $this->args, $args );
	}

	/**
	 * Sets the request body.
	 *
	 * @param mixed $body The body to set.
	 */
	public function set_body( $body ) {
		$this->args['body'] = $body;
	}

	/**
	 * Sends the data to the given endpoint.
	 *
	 * @return bool True when sending data has been successful.
	 */
	public function post() {
		echo "<pre>";
		print_r( $this->args );
		return true;

		$response = wp_remote_post( $this->endpoint, $this->args );

		return $this->process_response( $response );
	}

	/**
	 * Returns the value of the response error.
	 *
	 * @return null|WP_Error The response error.
	 */
	public function get_response_error() {
		return $this->response_error;
	}

	/**
	 * Returns the response body.
	 *
	 * @return mixed The response body.
	 */
	public function get_response_body() {
		return $this->response_body;
	}

	/**
	 * Processes the given response.
	 *
	 * @param mixed $response The response to process.
	 *
	 * @return bool True when response is valid.
	 */
	protected function process_response( $response ) {
		if ( $response instanceof WP_Error ) {
			$this->response_error = $response;

			return false;
		}

		$this->response_body = wp_remote_retrieve_body( $response );

		if ( wp_remote_retrieve_response_code( $response ) === 200 ) {
			return true;
		}

		return false;
	}
}

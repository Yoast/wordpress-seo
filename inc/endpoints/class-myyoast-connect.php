<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Endpoint
 */

/**
 * Represents an implementation of the WPSEO_Endpoint interface to register one or multiple endpoints.
 */
class WPSEO_Endpoint_MyYoast_Connect implements WPSEO_Endpoint {

	/**
	 * The namespace to use.
	 *
	 * @var string
	 */
	const REST_NAMESPACE = 'yoast/v1/myyoast';

	/**
	 * Registers the REST routes that are available on the endpoint.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register() {
		register_rest_route(
			self::REST_NAMESPACE,
			'connect',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'handle_request' ),
				'permission_callback' => array( $this, 'can_retrieve_data' ),
			)
		);
	}

	/**
	 * Determines whether or not data can be retrieved for the registered endpoints.
	 *
	 * @param WP_REST_Request $request The current request.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function handle_request( WP_REST_Request $request ) {
		if ( $request->get_param( 'url' ) !== $this->get_home_url() ) {
			return new WP_REST_Response(
				'Bad request: URL mismatch.',
				403
			);
		}

		if ( $request->get_param( 'clientId' ) !== $this->get_client_id() ) {
			return new WP_REST_Response(
				'Bad request: ClientID mismatch.',
				403
			);
		}

		$client_secret = $request->get_param( 'clientSecret' );
		if ( empty( $client_secret ) ) {
			return new WP_REST_Response(
				'Bad request: ClientSecret missing.',
				403
			);
		}

		$this->save_secret( $client_secret );

		return new WP_REST_Response( 'Connection successful established.' );
	}

	/**
	 * Determines whether or not data can be retrieved for the registered endpoints.
	 *
	 * @return bool Whether or not data can be retrieved.
	 */
	public function can_retrieve_data() {
		return true;
	}

	/**
	 * Saves the client secret.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $client_secret The secret to save.
	 *
	 * @return void
	 */
	protected function save_secret( $client_secret ) {
		$this->get_client()->save_configuration(
			array(
				'secret' => $client_secret,
			)
		);
	}

	/**
	 * Retrieves the current client ID.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array The client ID.
	 */
	protected function get_client_id() {
		$config = $this->get_client()->get_configuration();

		return $config['clientId'];
	}

	/**
	 * Retrieves an instance of the client.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return WPSEO_MyYoast_Client Instance of client.
	 */
	protected function get_client() {
		static $client;

		if ( ! $client ) {
			$client = new WPSEO_MyYoast_Client();
		}

		return $client;
	}

	/**
	 * Wraps the method for retrieving the home URL.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string Home URL.
	 */
	protected function get_home_url() {
		return WPSEO_Utils::get_home_url();
	}
}

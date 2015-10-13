<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class will fetch a new status from OnPage.org and if it's necessary it will notify the site admin by email and
 * remove the current meta value for hidding the notice for all admin users
 */
class WPSEO_OnPage_Request {

	/**
	 * @var array The array that is return by the wp_remote_get request
	 */
	private $response;

	/**
	 * Setting the response by doing the request to given target_url
	 *
	 * @param string $target_url The target url for requesting the status.
	 */
	public function __construct( $target_url ) {
		$this->response = $this->do_request( $target_url );
	}

	/**
	 * Returns the fetched response
	 *
	 * @return array
	 */
	public function get_response() {
		return $this->response;
	}

	/**
	 * Doing the remote get and returns the body
	 *
	 * @param string $home_url The home url.
	 *
	 * @return array
	 */
	protected function get_remote( $home_url ) {
		$response      = wp_remote_get( WPSEO_ONPAGE . $this->get_end_url( $home_url ) );
		$response_body = wp_remote_retrieve_body( $response );
		return json_decode( $response_body, true );
	}

	/**
	 * Sending a request to OnPage to check if the $home_url is indexable
	 *
	 * @param string $home_url The URL that will be send to the API.
	 *
	 * @return array
	 */
	private function do_request( $home_url ) {
		$json_body = $this->get_remote( $home_url );

		// OnPage.org recognized a redirect, fetch the data of that URL by calling this method with the value from OnPage.org.
		if ( ! empty( $json_body['passes_juice_to'] ) ) {
			return $this->do_request( $json_body['passes_juice_to'] );
		}

		return $json_body;
	}

	/**
	 * Check if the $home_url is redirected to another page.
	 *
	 * @param string $home_url Fetch a possible redirect url.
	 *
	 * @return string
	 */
	private function get_end_url( $home_url ) {
		$response         = wp_remote_get( $home_url, array( 'redirection' => 0 ) );
		$response_headers = wp_remote_retrieve_headers( $response );

		if ( ! empty( $response_headers['location'] ) ) {
			return $response_headers['location'];
		}

		return $home_url;
	}

}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class will fetch a new status from Ryte and if it's necessary it will
 * notify the site admin by email and remove the current meta value to hide the
 * notice for all admin users.
 */
class WPSEO_OnPage_Request {

	/**
	 * The endpoint where the request will be send to.
	 *
	 * @var string
	 */
	private $onpage_endpoint = 'https://indexability.yoast.onpage.org/';

	/**
	 * Doing the remote get and returns the body.
	 *
	 * @param string $target_url The home url.
	 * @param array  $parameters Array of extra parameters to send to Ryte.
	 *
	 * @return array
	 * @throws Exception The error message that can be used to show to the user.
	 */
	protected function get_remote( $target_url, $parameters = [] ) {
		$defaults   = [
			'url'          => $target_url,
			'wp_version'   => $GLOBALS['wp_version'],
			'yseo_version' => WPSEO_VERSION,
		];
		$parameters = array_merge( $defaults, $parameters );

		$url = add_query_arg( $parameters, $this->onpage_endpoint );

		$response      = wp_remote_get( $url );
		$response_code = wp_remote_retrieve_response_code( $response );

		// When the request is successful, the response code will be 200.
		if ( $response_code === 200 ) {
			$response_body = wp_remote_retrieve_body( $response );

			return json_decode( $response_body, true );
		}
	}

	/**
	 * Sending a request to Ryte to check if the $home_url is indexable.
	 *
	 * @param string $target_url The URL that will be send to the API.
	 * @param array  $parameters Array of extra parameters to send to Ryte.
	 *
	 * @return array
	 */
	public function do_request( $target_url, $parameters = [] ) {
		$json_body = $this->get_remote( $target_url, $parameters );

		// Ryte recognized a redirect, fetch the data of that URL by calling this method with the value from Ryte.
		if ( ! empty( $json_body['passes_juice_to'] ) ) {
			return $this->do_request( $json_body['passes_juice_to'], $parameters );
		}

		return $json_body;
	}
}

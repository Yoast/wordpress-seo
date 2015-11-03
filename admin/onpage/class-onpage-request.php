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
	 * @param string $target_url The home url.
	 *
	 * @return array
	 * @throws Exception
	 */
	protected function get_remote( $target_url ) {
		$response      = wp_remote_get( WPSEO_ONPAGE . $target_url );
		$response_code = wp_remote_retrieve_response_code( $response ) ;

		// When the request is successful, the response code will be 200
		if ( $response_code === 200 ) {
			$response_body  = wp_remote_retrieve_body( $response );

			return json_decode( $response_body, true );
		}

		// Throwing an Exception with the error message.
		throw new Exception(
			sprintf(
				__( 'The OnPage.org server is currently not available, please try again later. If you keep getting this error, %1$splease create an issue on the %2$s GitHub repository%3$s.', 'wordpress-seo' ),
				'<a href="https://github.com/Yoast/wordpress-seo/issues" target="_blank">',
				'Yoast SEO',
				'</a>'
			)
		);
	}

	/**
	 * Sending a request to OnPage to check if the $home_url is indexable
	 *
	 * @param string $target_url The URL that will be send to the API.
	 *
	 * @return array
	 */
	private function do_request( $target_url ) {
		$json_body = $this->get_remote( $target_url );

		// OnPage.org recognized a redirect, fetch the data of that URL by calling this method with the value from OnPage.org.
		if ( ! empty( $json_body['passes_juice_to'] ) ) {
			return $this->do_request( $json_body['passes_juice_to'] );
		}

		return $json_body;
	}

}

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
class WPSEO_Ryte_Request {

	/**
	 * The endpoint where the request will be send to.
	 *
	 * @var string
	 */
	private $ryte_endpoint = 'https://indexability.yoast.onpage.org/';

	/**
	 * Gets the response from the Ryte API and returns the body.
	 *
	 * @param string $target_url The URL to check indexability for.
	 * @param array  $parameters Array of extra parameters to send to the Ryte API.
	 *
	 * @return array The successful response or the error details.
	 */
	protected function get_remote( $target_url, $parameters = [] ) {
		$defaults = [
			'url'          => $target_url,
			'wp_version'   => $GLOBALS['wp_version'],
			'yseo_version' => WPSEO_VERSION,
		];

		$parameters = array_merge( $defaults, $parameters );
		$url        = add_query_arg( $parameters, $this->ryte_endpoint );
		$response   = wp_remote_get( $url );

		return $this->process_response( $response );
	}

	/**
	 * Sends a request to the Ryte API to check whether a URL is indexable.
	 *
	 * @param string $target_url The URL to check indexability for.
	 * @param array  $parameters Array of extra parameters to send to the Ryte API.
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

	/**
	 * Processes the given Ryte response.
	 *
	 * @param array|WP_Error $response The response or WP_Error to process.
	 *
	 * @return array The response body or the error detaiils on failure.
	 */
	protected function process_response( $response ) {
		// Most of the potential errors are WP_Error(s).
		if ( is_wp_error( $response ) ) {
			return [
				'is_error'       => true,
				'raw_error_code' => '',
				// WP_Error codes aren't that helpful for users, let's display them in a less prominent way.
				'wp_error_code'  => '(' . $response->get_error_code() . ')',
				'message'        => $response->get_error_message(),
			];
		}

		/*
		 * As of February 2020 the Ryte API returns an error 500 for non-reachable
		 * sites. There's also the need to handle any potential raw HTTP error.
		 */
		if ( wp_remote_retrieve_response_code( $response ) !== 200 ) {
			// Not all HTTP errors may have a response message. Let's provide a default one.
			$response_message = wp_remote_retrieve_response_message( $response );
			$message          = ( $response_message ) ? $response_message : __( 'The request to Ryte returned an error.', 'wordpress-seo' );

			return [
				'is_error'       => true,
				'raw_error_code' => wp_remote_retrieve_response_code( $response ),
				'wp_error_code'  => '',
				'message'        => $message,
			];
		}

		// When the request is successful, the response code will be 200.
		$response_body = wp_remote_retrieve_body( $response );

		return json_decode( $response_body, true );
	}
}

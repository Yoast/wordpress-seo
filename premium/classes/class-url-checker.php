<?php
/**
<<<<<<< HEAD
 * @package    WPSEO
 * @subpackage Premium
=======
 * @package WPSEO\Premium\Classes
>>>>>>> @{-1}
 */

/**
 * Class WPSEO_Url_Checker
 */
class WPSEO_Url_Checker {

	/**
	 * Method that returns the HTTP response code of URL
	 */
	public static function check_url() {

		// Check AJAX nonce.
		check_ajax_referer( 'wpseo-redirects-ajax-security', 'ajax_nonce' );

		$posted_url = filter_input( INPUT_POST, 'url' );

		// URL must be set
		if ( $posted_url === null ) {
			exit;
		}

		// The URL
		$url = urldecode( $posted_url );

		// Do the request.
		$response = wp_remote_get( $url );

		// Echo the response code.
		echo json_encode( array( 'reponse_code' => wp_remote_retrieve_response_code( $response ) ) );
		exit;
	}

}

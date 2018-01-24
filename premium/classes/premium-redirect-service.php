<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium
 */

/**
 * The service for the redirects to WordPress.
 */
class WPSEO_Premium_Redirect_Service {

	/**
	 * Saves the redirect to the redirects.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response to send back.
	 */
	public function save( WP_REST_Request $request ) {

		$origin = $request->get_param( 'origin' );
		$target = $request->get_param( 'target' );
		$type   = $request->get_param( 'type' );

		// Creates the redirect.
		$redirect = new WPSEO_Redirect( $origin, $target, $type );

		$redirect_manager = new WPSEO_Redirect_Manager();

		if ( $redirect_manager->create_redirect( $redirect ) ) {
			return new WP_REST_Response( 'true' );
		}

		return new WP_REST_Response( 'false' );
	}
}

<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Represents the service for handling the notification actions like dismissing.
 */
class WPSEO_Configuration_Notification_Service {

	/**
	 * Handles the dismissing of the notification.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response object.
	 */
	public function dismiss( WP_REST_Request $request ) {
		WPSEO_Configuration_Notification::set_dismissed( $request->get_param( 'userid' ) );

		return new WP_REST_Response( true );
	}
}

<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium
 */

/**
 * Represents the service for the recalculation.
 */
class WPSEO_Premium_Prominent_Words_Recalculation_Service {

	/**
	 * Removes the recalculation notification.
	 *
	 * @param WP_REST_Request $request The current request. Unused.
	 *
	 * @return WP_REST_Response The response to give.
	 */
	public function remove_notification( WP_REST_Request $request ) {
		$notifier = new WPSEO_Premium_Prominent_Words_Recalculation_Notifier();
		$notifier->cleanup_notification();

		return new WP_REST_Response( '1' );
	}
}

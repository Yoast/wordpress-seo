<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

if ( ! interface_exists( 'WPSEO_Notification' ) ) {
	/**
	 * An interface for registering wpseo banner notifications
	 */
	interface WPSEO_Banner_Notification {

		/**
		 * Render the notification if applicable.
		 */
		public function notify();
	}
}

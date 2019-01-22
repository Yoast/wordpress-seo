<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

/**
 * An interface for registering wpseo banner notifications
 */
interface WPSEO_Notifier {

	/**
	 * Render the notification if applicable.
	 */
	public function notify();
}

<?php
/**
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Class Yoast_API_Libs_Required_Version_Notifier
 */
class Yoast_API_Libs_Required_Version_Notifier implements Yoast_Notifier_Interface {

	/**
	 * Check if the cause for the notification is present
	 *
	 * @return bool True if notification is no longer relevant, False if it is still active.
	 */
	public function notify() {
		try {
			new Yoast_Api_Libs( '2.0' );
		} catch ( Exception $exception ) {
			return true;
		}

		return false;
	}

	/**
	 * Create the notification
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {
		$notice = __(
			'Yoast plugins share some code between them to make your site faster. As a result of that, we need all Yoast plugins to be up to date. We\'ve detected this isn\'t the case, so please update the Yoast plugins that aren\'t up to date yet.',
			'wordpress-seo'
		);

		$options = array(
			'type'         => 'error',
			'id'           => 'wpseo-api-libs-required-version',
			'capabilities' => array( 'update_plugins' ),
		);

		return new Yoast_Notification( $notice, $options );
	}
}

<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class Yoast_GA_Compatibility_Notifier
 */
class Yoast_GA_Compatibility_Notifier implements Yoast_Notifier_Interface {

	/**
	 * Create the notification
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {
		$info_message = sprintf(
		/* Translators: %1$s expands to Yoast SEO, %2$s expands to 5.4.3, %3$s expands to Google Analytics by Yoast. */
			__(
				'%1$s detected you are using version %2$s of %3$s, please update to the latest version to prevent compatibility issues.',
				'wordpress-seo'
			),
			'Yoast SEO',
			'5.4.3',
			'Google Analytics by Yoast'
		);

		$notification_options = array(
			'id'                    => 'ga_compatibility',
			'type'                  => 'error',
			'capabilities_required' => array( 'update_plugins' ),
		);

		return new Yoast_Notification( $info_message, $notification_options );
	}

	/**
	 * Check if the cause for the notification is present
	 *
	 * @return bool True if notification is no longer relevant, False if it is still active.
	 */
	public function notify() {
		return ( defined( 'GAWP_VERSION' ) && '5.4.3' === GAWP_VERSION );
	}
}

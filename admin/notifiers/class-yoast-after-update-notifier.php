<?php
/**
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Class Yoast_After_Update_Notifier
 */
class Yoast_After_Update_Notifier implements Yoast_Notifier_Interface {

	/**
	 * Check if the cause for the notification is present
	 *
	 * @return bool True if notification is no longer relevant, False if it is still active.
	 */
	public function notify() {
		return ( WPSEO_Admin_Init::has_ignored_tour() && ! WPSEO_Admin_Init::seen_about() );
	}

	/**
	 * Create the notification
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {
		$info_message = sprintf(
			/* translators: %1$s expands to Yoast SEO, $2%s to the version number, %3$s and %4$s to anchor tags with link to intro page  */
			__( '%1$s has been updated to version %2$s. %3$sClick here%4$s to find out what\'s new!', 'wordpress-seo' ),
			'Yoast SEO',
			WPSEO_VERSION,
			'<a href="' . admin_url( 'admin.php?page=wpseo_dashboard&intro=1' ) . '">',
			'</a>'
		);

		$notification_options = array(
			'type'         => 'updated',
			'id'           => 'wpseo-dismiss-about',
			'priority'     => 0.0,
			'nonce'        => wp_create_nonce( 'wpseo-dismiss-about' ),
			'capabilities' => array( 'manage_options' ),
		);

		return new Yoast_Notification( $info_message, $notification_options );
	}
}

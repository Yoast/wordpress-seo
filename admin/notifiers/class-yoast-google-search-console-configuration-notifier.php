<?php
/**
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Class Yoast_Google_Search_Console_Configuration_Notifier
 */
class Yoast_Google_Search_Console_Configuration_Notifier implements Yoast_Notifier_Interface {

	/**
	 * Check if the cause for the notification is present
	 *
	 * @return bool True if notification is no longer relevant, False if it is still active.
	 */
	public function notify() {
		return ( WPSEO_GSC_Settings::get_profile() === '' );
	}

	/**
	 * Create the notification
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {
		$message = sprintf(
		/* translators: 1: is a link to 'admin_url / admin.php?page=wpseo_search_console&tab=settings' 2: closing link tag */
			__(
				'Don\'t miss your crawl errors: %1$sconnect with Google Search Console here%2$s.',
				'wordpress-seo'
			),
			'<a href="' . admin_url( 'admin.php?page=wpseo_search_console&tab=settings' ) . '">',
			'</a>'
		);

		$options = array(
			'type'                  => 'updated yoast-dismissible',
			'id'                    => 'wpseo-dismiss-gsc',
			'dismissal_key'         => 'wpseo_dismissed_gsc_notice',
			'capabilities_required' => array( 'manage_options' ),
			'wpseo_page_only'       => true,
		);

		return new Yoast_Notification(
			$message,
			$options
		);
	}
}

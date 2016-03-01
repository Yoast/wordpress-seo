<?php
/**
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Class Yoast_Search_Engine_Visibility_Notifier
 */
class Yoast_Search_Engine_Visibility_Notifier implements Yoast_Notifier_Interface {

	/**
	 * Check if the cause for the notification is present
	 *
	 * @return bool True if notification is no longer relevant, False if it is still active.
	 */
	public function notify() {
		return ( '0' === get_option( 'blog_public' ) );
	}

	/**
	 * Create the notification
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {

		$link_start  = sprintf( '<a href="%s">', esc_url( admin_url( 'options-reading.php' ) ) );
		$description = sprintf(
			__( 'You must %sgo to your Reading Settings%s and uncheck the box for Search Engine Visibility.', 'wordpress-seo' ),
			$link_start,
			'</a>'
		);

		$message = sprintf( '<strong>%1$s</strong> %2$s',
			__( 'Huge SEO Issue: You\'re blocking access to robots.', 'wordpress-seo' ),
			$description
		);

		$options = array(
			'type'         => 'error',
			'priority'     => 1.0,
			'id'           => 'wpseo-search-engine-visibility',
			'capabilities' => array( 'manage_options' ),
		);

		return new Yoast_Notification(
			$message,
			$options
		);
	}
}

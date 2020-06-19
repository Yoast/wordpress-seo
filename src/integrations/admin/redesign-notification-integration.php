<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */

namespace Yoast\WP\SEO\Integrations\Admin;

/**
 * Redesign_Notification_Integration class
 */
class Redesign_Notification_Integration extends Dismissable_Notification_Integration {

	/**
	 * The notification identifier.
	 *
	 * @var string
	 */
	const IDENTIFIER = 'wpseo-notification-redesign-14.5';

	/**
	 * Provides the identifier for this notification.
	 *
	 * @return string The identifier for this notification.
	 */
	protected function get_identifier() {
		return self::IDENTIFIER;
	}

	/**
	 * Provides the message to be displayed in the notification.
	 *
	 * @return string The message to be displayed.
	 */
	protected function get_message() {
		return \sprintf(
			__(
				'We decided to give %1$s a new look. Don’t worry, all your settings are secure and can still be found in the same place as before.',
				'wordpress-seo'
			),
			'Yoast SEO'
		);
	}

	/**
	 * Provides the label to be shown on the dismiss button.
	 *
	 * @return string The label to be shown on the dismiss button.
	 */
	protected function get_dismiss_label() {
		return \__( 'Hide this notice', 'wordpress-seo' );
	}

	/**
	 * Provides the type of notification that will be shown.
	 *
	 * @return string The type of notification to show.
	 */
	protected function get_notification_type() {
		return 'info';
	}

	/**
	 * Determines if the notification should be shown.
	 *
	 * @return bool True if the notification should be shown.
	 */
	protected function can_show_notification() {
		if ( ! $this->is_installed_before_redesign() ) {
			return false;
		}

		return ! $this->is_notification_dismissed();
	}

	/**
	 * Checks if the notification is dismissed.
	 *
	 * @return bool True if the notification is dismissed.
	 */
	private function is_notification_dismissed() {
		$user_id = \get_current_user_id();
		if ( 0 === $user_id ) {
			return true;
		}

		$notification_dismissed = \get_user_meta( $user_id, $this->get_identifier(), true );

		return ! empty( $notification_dismissed );
	}

	/**
	 * Checks if the plugin was activated before the redesign release.
	 *
	 * @return bool True if it was installed before the release date.
	 */
	private function is_installed_before_redesign() {
		// July 7th 2020, 12:00 CEST.
		$redesign_release_date = 1594116000;
		$activation_time       = \WPSEO_Options::get( 'first_activated_on' );

		return ( $activation_time < $redesign_release_date );
	}
}

<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the logic for showing the notification.
 */
class WPSEO_Configuration_Notifier implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {
		if ( ! $this->show_notification() ) {
			return;
		}

		// @todo Register the things that are required to render the notification.
	}

	/**
	 * Checks if the notification should be added.
	 *
	 * @return bool True when the notification should be visible.
	 */
	public function show_notification() {
		$options           = WPSEO_Options::get_options( array( 'wpseo' ) );
		$show_notification = $options['show_onboarding_notice'] === true;

		return $show_notification && WPSEO_Configuration_Notification::is_dismissed( get_current_user_id() );
	}
}

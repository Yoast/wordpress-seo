<?php
/**
 * @package WPSEO\Admin\Listeners
 */

/**
 * Listener for dismissing the configuration notification.
 */
class WPSEO_Configuration_Notifier_Listener implements WPSEO_Listener {

	/**
	 * Listens to an argument in the request URL, when triggered just set the notification to dismissed.
	 *
	 * @return void
	 */
	public function listen() {
		if ( ! $this->is_triggered()  ) {
			return;
		}

		WPSEO_Configuration_Notification::set_dismissed( get_current_user_id() );
	}

	/**
	 * Checks if the request url contains the required argument.
	 *
	 * @return bool True when action has been triggered.
	 */
	protected function is_triggered() {
		return filter_input( INPUT_GET, 'dismiss_get_started' ) !== '1';
	}
}

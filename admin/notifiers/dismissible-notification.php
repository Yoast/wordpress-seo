<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Abstract class representing a dismissible notification.
 */
abstract class WPSEO_Dismissible_Notification implements WPSEO_Listener {

	/**
	 * The identifier for the notification.
	 *
	 * @var string
	 */
	protected $notification_identifier = '';

	/**
	 * Dissmisses the notification.
	 *
	 * @return void
	 */
	abstract protected function dismiss();

	/**
	 * Listens to an argument in the request URL and triggers an action.
	 *
	 * @return void
	 */
	public function listen() {
		if ( $this->get_listener_value() !== $this->notification_identifier ) {
			return;
		}

		$this->dismiss();
	}

	/**
	 * Checks whether the notification has been dismissed.
	 *
	 * @return bool True when notification is dismissed.
	 *
	 * @codeCoverageIgnore
	 */
	protected function is_notice_dismissed() {
		return get_user_meta( get_current_user_id(), 'wpseo-remove-' . $this->notification_identifier, true ) === '1';
	}

	/**
	 * Retrevies the value where listener is listening for.
	 *
	 * @return string The listener value.
	 *
	 * @codeCoverageIgnore
	 */
	protected function get_listener_value() {
		return filter_input( INPUT_GET, 'yoast_dismiss' );
	}

	/**
	 * Dismisses the notification.
	 *
	 * @return void
	 *
	 * @codeCoverageIgnore
	 */
	protected function set_dismissal_state() {
		update_user_meta( get_current_user_id(), 'wpseo-remove-' . $this->notification_identifier, true );
	}
}

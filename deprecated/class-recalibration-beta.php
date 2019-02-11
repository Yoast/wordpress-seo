<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing recalibration beta notice.
 *
 * @deprecated 9.6
 */
class WPSEO_Recalibration_Beta_Notification implements WPSEO_WordPress_Integration {

	/**
	 * The name of the notifier.
	 *
	 * @var string
	 */
	protected $notification_identifier = 'recalibration-meta-notification';

	/**
	 * Class constructor.
	 *
	 * @deprecated 9.6
	 */
	public function __construct() {
		_deprecated_constructor( 'WPSEO_Recalibration_Beta_Notification', '9.6' );
	}

	/**
	 * Registers all hooks to WordPress
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_init', array( $this, 'handle_notice' ), 15 );
	}

	/**
	 * Shows the notification when applicable.
	 *
	 * @return void.
	 */
	public function handle_notice() {
		$this->get_notification_center()->remove_notification_by_id( 'wpseo-' . $this->notification_identifier );
	}

	/**
	 * Retrieves an instance of the notification center.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return Yoast_Notification_Center Instance of the notification center.
	 */
	protected function get_notification_center() {
		return Yoast_Notification_Center::get();
	}
}

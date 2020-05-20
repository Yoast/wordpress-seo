<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing the configuration wizard notification.
 */
class WPSEO_Configuration_Notifier {

	/**
	 * Whether the notification should be shown.
	 *
	 * @var bool
	 */
	protected $show_notification;

	/**
	 * Constructs the object by setting the show notification property based on the given option.
	 */
	public function __construct() {
		$this->show_notification = WPSEO_Options::get( 'show_onboarding_notice', false );
	}

	/**
	 * Returns the content of the notification.
	 *
	 * @return string A string with the notification HTML, or empty string when no notification is needed.
	 */
	public function notify() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification_by_id( 'wpseo-wizard-notification' );

		if ( ! $this->show_notification() ) {
			$this->re_run_notification();
			return;
		}
		if ( WPSEO_Options::get( 'started_configuration_wizard' ) ) {
			$this->continue_notification();
			return;
		}
		$this->first_time_notification();
	}


	/**
	 * Checks if the notification should be shown.
	 *
	 * @return bool True when notification should be shown.
	 */
	protected function show_notification() {
		return $this->show_notification;
	}

	/**
	 * Adds the re-run notification to the notification center.
	 *
	 * @return void
	 */
	public function re_run_notification() {
		$note         = new Wizard_Notification();
		$message      = $note->get_notification_message( 'finish' );
		$notification = new Yoast_Notification(
			$message,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-wizard-notification',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.1,
			]
		);

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $notification );
	}

	/**
	 * Adds the first-time notification to the notification center.
	 *
	 * @return void
	 */
	public function first_time_notification() {
		$note         = new Wizard_Notification();
		$message      = $note->get_notification_message( 'start' );
		$notification = new Yoast_Notification(
			$message,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-wizard-notification',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 1,
			]
		);

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $notification );
	}

	/**
	 * Adds the continue notification to the notification center.
	 *
	 * @return void
	 */
	public function continue_notification() {
		$note         = new Wizard_Notification();
		$message      = $note->get_notification_message( 'continue' );
		$notification = new Yoast_Notification(
			$message,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-wizard-notification',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 1,
			]
		);

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $notification );
	}
}

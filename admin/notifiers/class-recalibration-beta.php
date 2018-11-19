<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing recalibration beta notice.
 */
class WPSEO_Recalibration_Beta_Notification implements WPSEO_WordPress_Integration {

	/**
	 * The name of the notifier.
	 *
	 * @var string
	 */
	protected $notification_identifier = 'recalibration-meta-notification';

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
		$recalibration_beta = new WPSEO_Recalibration_Beta();
		if ( $this->is_applicable( WPSEO_Recalibration_Beta::is_enabled(), $recalibration_beta->has_mailinglist_subscription() ) ) {
			$this->get_notification_center()->add_notification(
				$this->get_notification()
			);

			return;
		}

		$this->get_notification_center()->remove_notification_by_id( 'wpseo-' . $this->notification_identifier );
	}

	/**
	 * Checks if the beta is enabled.
	 *
	 * @param bool $is_beta_enabled  Checks if the beta has been enabled.
	 * @param bool $was_ever_enabled Checks if the beta was ever enabled.
	 *
	 * @return bool Whether the beta is enabled or not.
	 */
	protected function is_applicable( $is_beta_enabled, $was_ever_enabled ) {
		if ( $was_ever_enabled ) {
			return false;
		}

		return ! $is_beta_enabled;
	}

	/**
	 * Returns the notification.
	 *
	 * @return Yoast_Notification The notification for the notification center.
	 *
	 * @codeCoverageIgnore
	 */
	protected function get_notification() {
		$message  = sprintf(
			esc_html__(
				/* translators: 1: link opening tag to the features page, 2: link closing tag, 3: Link to KB article, 4: expands to Yoast SEO */
				'We\'d love for you to try our new and improved %4$s analysis! Use the toggle on the %1$sFeatures tab%2$s in your %4$s settings. %3$sRead more about the new analysis%2$s.',
				'wordpress-seo'
			),
			'<a href="#top#features" onclick="jQuery(\'#features-tab\').click()">',
			'</a>',
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/recalibration-beta-notice' ) . '" target="_blank">',
			'Yoast SEO'
		);

		$notification_options = array(
			'type'         => Yoast_Notification::WARNING,
			'id'           => 'wpseo-' . $this->notification_identifier,
			'priority'     => 1.0,
			'capabilities' => 'wpseo_manage_options',
		);

		return new Yoast_Notification( $message, $notification_options );
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

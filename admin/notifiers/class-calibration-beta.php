<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing calibration beta notice.
 */
class WPSEO_Calibration_Beta_Notification extends WPSEO_Dismissible_Notification {

	/**
	 * Sets the notification identifier.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function __construct() {
		$this->notification_identifier = 'calibration-meta-notification';
	}

	/**
	 * Checks if the notice should be shown.
	 *
	 * @return bool True when applicable.
	 */
	protected function is_applicable() {
		if ( $this->is_notice_dismissed() ) {
			return false;
		}

		return ! $this->is_beta_enabled();
	}

	/**
	 * Checks if the beta is enabled.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the beta is enabled or not.
	 */
	protected function is_beta_enabled() {
		return ! WPSEO_Calibration_Beta::is_enabled();
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
				/* translators: 1: link opening tag to the features page, 2: link clossing tag   */
				'We\'d love you to try our new and improved Yoast SEO analysis! Use the toggle on the %1$sFeatures tab%2$s in your Yoast SEO settings.',
				'wordpress-seo'
			),
			'<a href="#top#features" onclick="jQuery(\'#features-tab\').click()">',
			'</a>'
		);

		$message .= PHP_EOL . PHP_EOL;

		$message .= sprintf(
		/* translators: %1$s is the notification dismissal link start tag, %2$s is the link closing tag. */
			__( '%1$sPlease don\'t show me this notification anymore%2$s', 'wordpress-seo' ),
			'<a class="button" href="' . admin_url( '?page=' . WPSEO_Admin::PAGE_IDENTIFIER . '&yoast_dismiss=' . $this->notification_identifier ) . '">',
			'</a>'
		);

		$notification_options = array(
			'type'         => Yoast_Notification::WARNING,
			'id'           => 'wpseo-' . $this->notification_identifier,
			'priority'     => 1.0,
			'capabilities' => 'wpseo_manage_options',
		);

		return new Yoast_Notification( $message, $notification_options );
	}
}

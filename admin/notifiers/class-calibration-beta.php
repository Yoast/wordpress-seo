<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Represents the logic for showing calibration beta notice.
 */
class WPSEO_Calibration_Beta_Notification extends WPSEO_Dismissible_Notification implements WPSEO_Notification_Handler {

	/**
	 * Sets the notification identifier.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->notification_identifier = 'calibration-meta-notification';
	}

	/**
	 * Listens to an argument in the request URL and triggers an action.
	 *
	 * @return void
	 */
	protected function dismiss() {
		$this->set_dismissal_state();
		$this->redirect_to_dashboard();
	}

	/**
	 * Adds the notification if applicable, otherwise removes it.
	 *
	 * @param Yoast_Notification_Center $notification_center The notification center object.
	 *
	 * @return void
	 */
	public function handle( Yoast_Notification_Center $notification_center ) {
		if ( $this->is_notice_dismissed() || WPSEO_Calibration_Beta::is_enabled() ) {
			$notification_center->remove_notification_by_id( 'wpseo-' . $this->notification_identifier );

			return;
		}

		$notification = $this->get_notification();
		$notification_center->add_notification( $notification );
	}

	/**
	 * Redirects the user back to the dashboard.
	 *
	 * @return void
	 *
	 * @codeCoverageIgnore
	 */
	protected function redirect_to_dashboard() {
		wp_safe_redirect( admin_url( 'admin.php?page=wpseo_dashboard' ) );
		exit;
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

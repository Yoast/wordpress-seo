<?php
/**
 * @package \Yoast\Admin\Notifiers
 */

/**
 * Class Yoast_Default_Tagline_Notifier
 */
class Yoast_Default_Tagline_Notifier implements Yoast_Notifier_Interface {

	/**
	 * Check if the cause for the notification is present
	 *
	 * @return bool True if notification is no longer relevant, False if it is still active.
	 */
	public function notify() {
		return __( 'Just another WordPress site' ) === get_bloginfo( 'description' );
	}

	/**
	 * Create the notification
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {
		$current_url = ( is_ssl() ? 'https://' : 'http://' );
		$current_url .= sanitize_text_field( $_SERVER['SERVER_NAME'] ) . sanitize_text_field( $_SERVER['REQUEST_URI'] );

		$customize_url = add_query_arg( array(
			'url' => urlencode( $current_url ),
		), wp_customize_url() );

		$info_message = sprintf(
			__(
				'You still have the default WordPress tagline, even an empty one is probably better. %1$sYou can fix this in the customizer%2$s.',
				'wordpress-seo'
			),
			'<a href="' . esc_attr( $customize_url ) . '">',
			'</a>'
		);

		$notification_options = array(
			'type'         => 'error',
			'id'           => 'wpseo-dismiss-tagline-notice',
			'capabilities' => array( 'manage_options' ),
		);

		return new Yoast_Notification( $info_message, $notification_options );
	}
}

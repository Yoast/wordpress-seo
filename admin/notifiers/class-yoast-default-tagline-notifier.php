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
		$blog_description = get_bloginfo( 'description' );

		return __( 'Just another WordPress site' ) === $blog_description || 'Just another WordPress site' === $blog_description;
	}

	/**
	 * Create the notification
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {
		$info_message = '';

		if ( current_user_can( 'customize' ) ) {
			$current_url = ( is_ssl() ? 'https://' : 'http://' );
			$current_url .= sanitize_text_field( $_SERVER['SERVER_NAME'] ) . sanitize_text_field( $_SERVER['REQUEST_URI'] );
			$customize_url = add_query_arg( array( 'url' => urlencode( $current_url ) ), wp_customize_url() );

			$info_message = sprintf(
				/* translators: 1: is a link to the customizer, 2: closing link tag */
				__( 'You still have the default WordPress tagline, even an empty one is probably better. %1$sYou can fix this in the customizer%2$s.', 'wordpress-seo' ),
				'<a href="' . esc_attr( $customize_url ) . '">',
				'</a>'
			);
		}
		elseif ( current_user_can( 'manage_options' ) ) {
			$general_options_url = admin_url( 'options-general.php' );

			$info_message = sprintf(
				/* translators: 1: is a link to the general options page, 2: closing link tag */
				__( 'You still have the default WordPress tagline, even an empty one is probably better. %1$sYou can fix this on the general options page%2$s.', 'wordpress-seo' ),
				'<a href="' . esc_attr( $general_options_url ) . '">',
				'</a>'
			);
		}

		$notification_options = array(
			'type'             => 'error',
			'priority'         => 0.8,
			'id'               => 'wpseo-dismiss-tagline-notice',
			'capabilities'     => array( 'manage_options', 'customize' ),
			'capability_check' => 'any',
		);

		return new Yoast_Notification( $info_message, $notification_options );
	}
}

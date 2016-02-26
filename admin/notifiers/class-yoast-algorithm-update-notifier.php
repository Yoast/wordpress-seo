<?php
/**
 * @package WPSEO\Admin\Notifiers
 */

/**
 * Class Yoast_Algorithm_Update_Notifier
 *
 * @since 3.2
 */
class Yoast_Algorithm_Update_Notifier implements Yoast_Notifier_Interface {

	/**
	 * Register or resolve the notification with the Notification Center
	 *
	 * @since 3.2
	 *
	 * @return bool
	 */
	public function notify() {
		return '1' !== get_option( 'wpseo_dismiss_recalculate', false );
	}

	/**
	 * Create the notification
	 *
	 * @since 3.2
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {
		/* translators: 1: is a link to 'admin_url / admin.php?page=wpseo_tools&recalculate=1' 2: closing link tag */
		$message = sprintf(
			__(
				'We\'ve updated our SEO score algorithm. %1$sClick here to recalculate the SEO scores%2$s for all posts and pages.',
				'wordpress-seo'
			),
			'<a href="' . admin_url( 'admin.php?page=wpseo_tools&recalculate=1' ) . '">',
			'</a>'
		);

		$options = array(
			'type'                  => 'updated',
			'id'                    => 'wpseo-dismiss-recalculate',
			'dismissal_key'         => 'wpseo_dismiss_recalculate',
			'dismissal_value'       => '1',
			'capabilities_required' => array( 'manage_options' ),
		);

		return new Yoast_Notification( $message, $options );
	}
}

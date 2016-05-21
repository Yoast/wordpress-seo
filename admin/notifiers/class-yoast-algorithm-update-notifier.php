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
		$last_recalculated_version = get_option( 'wpseo_last_recalculation', true );
		if ( empty( $last_recalculated_version ) ) {
			return false;
		}

		// If the recalculated version is before the current version we need to recalculate.
		$outdated = version_compare( $last_recalculated_version, WPSEO_ALGORITHM_VERSION, '<' );

		return $outdated;
	}

	/**
	 * Create the notification
	 *
	 * @since 3.2
	 *
	 * @return Yoast_Notification
	 */
	public function get_notification() {
		$message = sprintf(
			/* translators: 1: is a link to 'admin_url / admin.php?page=wpseo_tools&recalculate=1' 2: closing link tag */
			__( 'We\'ve updated our SEO score algorithm. %1$sClick here to recalculate the SEO scores%2$s for all posts and pages.', 'wordpress-seo' ),
			'<a href="' . admin_url( 'admin.php?page=wpseo_tools&recalculate=1' ) . '">',
			'</a>'
		);

		$options = array(
			'type'          => 'updated',
			'priority'      => 1.0,
			'id'            => 'wpseo-dismiss-recalculate',
			'dismissal_key' => 'wpseo_dismiss_recalculate',
			'capabilities'  => array( 'manage_options' ),
		);

		return new Yoast_Notification( $message, $options );
	}
}

<?php


class WPSEO_Subscription_Notifier implements WPSEO_Listener {

	/**
	 * WPSEO_Subscription_Notifier constructor.
	 */
	public function __construct() {
	}

	/**
	 * Listens to an argument in the request URL and triggers an action.
	 *
	 * @return void
	 */
	public function listen() {
		// TODO: Implement listen() method.
	}



	public function notify() {
		// translators: %1$s expands to Yoast
		$title = sprintf(  __( 'One or more %1$s plugins are about to expire!', 'wordpress-seo' ), 'Yoast' );
		$image_url = esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/subscription-notification.svg' );

		return WPSEO_Notification::display( $title, '', $image_url );
	}
}
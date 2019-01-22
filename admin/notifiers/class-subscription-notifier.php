<?php


class WPSEO_Subscription_Notifier implements WPSEO_Notifier {

	private $next_expiry_date;

	/**
	 * WPSEO_Subscription_Notifier constructor.
	 */
	public function __construct() {
		$extensions_list = new WPSEO_Extensions();
		$this->next_expiry_date = $extensions_list->get_first_expiry_date();
	}

	public function notify() {
		// translators: %1$s expands to Yoast
		$title = sprintf(  __( 'One or more %1$s plugins are about to expire!', 'wordpress-seo' ), 'Yoast' );
		$image_url = esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/subscription-notification.svg' );

		return WPSEO_Notification::display( $title, '', $image_url );
	}
}

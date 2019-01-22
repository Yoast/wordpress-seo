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
		$notification  = '<div class="yoast-container yoast-container__configuration-wizard">';
		$notification .= sprintf(
			'<img src="%1$s" height="%2$s" width="%3$d" />',
			esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/subscription-notification.svg' ),
			60,
			60
		);
		$notification .= '<div class="yoast-container__configuration-wizard--content">';
		// translators: %1$s expands to Yoast
		$notification .= '<h3>' . sprintf( esc_html__( 'One or more %1$s plugins are about to expire!', 'wordpress-seo' ), 'Yoast' ) . '</h3>';

		$notification .= '</div>';
		$notification .= '</div>';

		return $notification;
	}
}

<?php


class WPSEO_Subscription_Notifier implements WPSEO_WordPress_Integration, WPSEO_Notifier {

	private $next_expiry_date;
	private $days_to_expiration;

	private static $instance = null;

	private function __construct() {
		$this->init();
	}

	public static function get_instance() {
		if ( self::$instance === null ) {
			self::$instance = new WPSEO_Subscription_Notifier();
		}

		return self::$instance;
	}

	/**
	 * Initialize notification.
	 */
	private function init() {
		$extensions_list = new WPSEO_Extensions();
		$this->next_expiry_date = $extensions_list->get_first_expiry_date();

		$this->next_expiry_date = '2019-03-18T09:31:40Z';

		$current_time = time();
		$expiry_time  = strtotime( $this->next_expiry_date );

		if ( ! $expiry_time ) {
			return;
		}

		$this->days_to_expiration = (int) ceil( ( $current_time - $expiry_time ) / DAY_IN_SECONDS );
	}

	public function banner() {
	}

	public function notify( $status = 'expired' ) {
		$message = sprintf( esc_html__( 'Your %1$s plugin(s) will expire in 4 weeks. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a 25%% discount!%3$s', 'wordpress-seo' ), 'Yoast', '<i>', '</i>' );
		switch ( $status ) {
			case 'less_than_1_week':
				$message = sprintf( esc_html__( 'Your %1$s plugin(s) will expire in 4 weeks. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a 25%% discount!%3$s', 'wordpress-seo' ), 'Yoast', '<i>', '</i>' );
				break;
			case '1_day':
				$message = sprintf( esc_html__( 'Your %1$s plugin(s) will expire in 4 weeks. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a 25%% discount!%3$s', 'wordpress-seo' ), 'Yoast', '<i>', '</i>' );
		}

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
		// translators: %1$s expands to Yoast, %2$s expands to <i>, %3$s expands to </i>
		$notification .= '<p>' . $message . '</p>';

		$notification .= '</div>';
		$notification .= '</div>';

		return $notification;
	}

	/**
	 * Registers all hooks to WordPress
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( filter_input( INPUT_GET, 'page' ) !== 'wpseo_dashboard' ) {
			return;
		}

		add_action( 'admin_init', array( $this, 'init' ) );
	}
}

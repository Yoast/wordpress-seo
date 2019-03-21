<?php


class WPSEO_Subscription_Notifier implements WPSEO_WordPress_Integration {

	private $days_to_expiration;
	private $next_expiry_date_timestamp;

	/**
	 * Initialize notification.
	 */
	public function init() {
		$this->next_expiry_date_timestamp = $this->get_first_expiry_date();

		if ( ! $this->next_expiry_date_timestamp ) {
			return;
		}

		$this->days_to_expiration = (int) ceil( ( time() - $this->next_expiry_date_timestamp ) / DAY_IN_SECONDS );
	}


	private function get_first_expiry_date() {
		$addon_manager = new WPSEO_Addon_Manager();
		$subscriptions = $addon_manager->get_subscriptions_for_active_addons();

		$expiry_dates = array();

		foreach ( $subscriptions as $subscription ) {
			if ( empty( $subscription->product->name ) ) {
				continue;
			}

			$product_name =  $subscription->product->name;

			$expiry_dates[ $product_name ] = $subscription->expiryDate;
		}

//		var_dump( $expiry_dates ); die;

		return strtotime( max( $expiry_dates ) );
	}

	public function show_banner() {
		if ( $this->days_to_expiration < 7 && $this->days_to_expiration >= 0 ) {
			// translators: %1$s expands to Yoast
			$title          = sprintf( esc_html__( 'One or more %1$s plugins are about to expire!', 'wordpress-seo' ), 'Yoast' );
			$formatted_date = date_i18n( 'F jS, Y', strtotime( $this->next_expiry_date_timestamp ) );
			// translators: %1$s expands to Yoast, %2$s expands to a date string, %3$s expands to an opening anchor tag, %4$s expands to a closing anchor tag
			$message        = sprintf( esc_html__( 'When plugins expire, you will no longer receive updates or support. You have until %2$s to renew with a 25%% discount. %3$sRenew now!%4$s', 'wordpress-seo' ), 'Yoast', $formatted_date, '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_licenses' ) ) . '">', '</a>' );

			echo $this->notify( $title, $message );
			return;
		}
		if ( $this->days_to_expiration ) {

		}
	}

	public function notify( $title, $message ) {
		$notification  = '<div class="yoast-container yoast-container__configuration-wizard">';
		$notification .= sprintf(
			'<img src="%1$s" height="%2$s" width="%3$d" />',
			esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/subscription-notification.svg' ),
			60,
			60
		);
		$notification .= '<div class="yoast-container__configuration-wizard--content">';
		$notification .= '<h3>' . $title . '</h3>';
		$notification .= '<p>' . $message . '</p>';
		$notification .= '</div>';
		$notification .= sprintf(
			'<a href="%1$s" style="" class="button dismiss yoast-container__configuration-wizard--dismiss"><span class="screen-reader-text">%2$s</span><span class="dashicons dashicons-no-alt"></span></a>',
			esc_url( admin_url( 'admin.php?page=wpseo_dashboard&amp;dismiss_get_started=1' ) ),
			esc_html__( 'Dismiss this item.', 'wordpress-seo' )
		);
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
		add_action( 'wpseo_admin_seo_dashboard_banners', array( $this, 'show_banner' ) );
	}
}

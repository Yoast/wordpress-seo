<?php


class WPSEO_Subscription_Notifier implements WPSEO_WordPress_Integration {

	private $days_to_expiration;
	private $first_expiring_subscription;
	private $current_notification;

	/**
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	const EXPIRATION_4_WEEKS      = 'plugins-expiration-4-weeks';
	const EXPIRATION_1_WEEK       = 'plugins-expiration-1-week';
	const EXPIRATION_1_DAY        = 'plugins-expiration-1-day';
	const EXPIRED_1_DAY           = 'plugins-expired-1-day';
	const EXPIRED_MORE_THAN_1_DAY = 'plugins-expired-more-than-1-day';

	const CURRENT_NOTIFICATION    = 'wpseo-current-expiration-notification';


	/**
	 * Initialize notification.
	 */
	public function init() {
		$this->addon_manager       = new WPSEO_Addon_Manager();
		$this->notification_center = Yoast_Notification_Center::get();

		$this->first_expiring_subscription = $this->get_first_expiring_subscription();

		if ( ! $this->first_expiring_subscription ) {
			return;
		}

		$this->current_notification = get_option( self::CURRENT_NOTIFICATION );
		$this->days_to_expiration = (int) ceil( ( time() - strtotime( $this->first_expiring_subscription->expiry_date ) ) / DAY_IN_SECONDS );

		$this->days_to_expiration = 0;

		$this->determine_notification();

		$this->show_notification();
	}

	private function determine_notification() {
		if ( $this->days_to_expiration < 28 && $this->days_to_expiration > 7 ) {
			$this->set_current_notification( self::EXPIRATION_4_WEEKS );
			return;
		}
		if ( $this->days_to_expiration <= 7 && $this->days_to_expiration > 1 ) {
			$this->set_current_notification( self::EXPIRATION_1_WEEK );
			return;
		}
		if ( $this->days_to_expiration === 1 ) {
			$this->set_current_notification( self::EXPIRATION_1_DAY );
			return;
		}
		if ( $this->days_to_expiration === 0 ) {
			$this->set_current_notification( self::EXPIRED_1_DAY );
			return;
		}
		if ( $this->days_to_expiration < 0 && $this->days_to_expiration > -30 ) {
			$this->set_current_notification( self::EXPIRED_MORE_THAN_1_DAY );
			return;
		}
		$this->remove_all_notifications();
		delete_option( self::CURRENT_NOTIFICATION );
	}

	private function set_current_notification( $notification_id ) {
		if ( $this->current_notification === $notification_id ) {
			return;
		}

		$this->current_notification = $notification_id;
		update_option( self::CURRENT_NOTIFICATION, $notification_id );
		$this->remove_all_notifications();
	}

	private function remove_all_notifications() {
		$this->notification_center->remove_notification_by_id( self::EXPIRATION_4_WEEKS );
		$this->notification_center->remove_notification_by_id( self::EXPIRATION_1_DAY );
	}

	private function get_first_expiring_subscription() {
		$subscriptions = $this->addon_manager->get_subscriptions_for_active_addons();

		$subscriptions = array_filter( $subscriptions, array( $this, 'filter' ) );

		usort( $subscriptions, array( $this, 'compare_subscription_dates' ) );

		return $subscriptions[ 0 ];
	}

	public function filter( $subscription ) {
		if ( empty( $subscription->product->name ) ) {
			return false;
		}
		return true;
	}

	public function compare_subscription_dates( $subscription1, $subscription2 ) {
		return strtotime( $subscription1->expiry_date ) - strtotime( $subscription2->expiry_date ) > 0;
	}

	private function show_notification() {
		if ( $this->current_notification === self::EXPIRATION_4_WEEKS ) {
			$message = sprintf( __( 'Your %1$s plugin(s) will expire within 4 weeks. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a 25%% discount!%3$s' ), 'Yoast', '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '"">'  , '</a>' );

			$notification_options = array(
				'type'         => Yoast_Notification::ERROR,
				'id'           => self::EXPIRATION_4_WEEKS,
				'capabilities' => 'wpseo_manage_options',
			);

			$notification = new Yoast_Notification(
				$message,
				$notification_options
			);

			$this->notification_center->add_notification( $notification );
		}
		if ( $this->current_notification === self::EXPIRATION_1_DAY ) {
			$message = sprintf( __( 'Your %1$s plugin(s) will expire in 1 day. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a 25%% discount!%3$s' ), 'Yoast', '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '"">'  , '</a>' );

			$notification_options = array(
				'type'         => Yoast_Notification::ERROR,
				'id'           => self::EXPIRATION_1_DAY,
				'capabilities' => 'wpseo_manage_options',
			);

			$notification = new Yoast_Notification(
				$message,
				$notification_options
			);

			$this->notification_center->add_notification( $notification );
		}
	}

	public function show_banner() {
		if ( $this->current_notification === self::EXPIRATION_1_WEEK ) {
			// translators: %1$s expands to Yoast
			$title          = sprintf( esc_html__( 'One or more %1$s plugins are about to expire!', 'wordpress-seo' ), 'Yoast' );
			$formatted_date = '<b>' . date_i18n( 'F jS, Y', strtotime( $this->first_expiring_subscription->expiry_date ) ) . '</b>';
			// translators: %1$s expands to Yoast, %2$s expands to a date string, %3$s expands to an opening anchor tag, %4$s expands to a closing anchor tag
			$message        = sprintf( esc_html__( 'When plugins expire, you will no longer receive updates or support. You have until %2$s to renew with a 25%% discount. %3$sRenew now!%4$s', 'wordpress-seo' ), 'Yoast', $formatted_date, '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '">', '</a>' );

			echo $this->get_banner( $title, $message );
			return;
		}
		if ( $this->current_notification === self::EXPIRED_1_DAY ) {
			// translators: %1$s expands to Yoast
			$title          = sprintf( esc_html__( 'Your %1$s plugins are expired!', 'wordpress-seo' ), 'Yoast' );
			$formatted_date = '<b>' . date_i18n( 'F jS, Y', strtotime( $this->first_expiring_subscription->expiry_date ) ) . '</b>';
			// translators: %1$s expands to Yoast, %2$s expands to a date string, %3$s expands to an opening anchor tag, %4$s expands to a closing anchor tag
			$message        = sprintf( esc_html__( 'When plugins expire, you will no longer receive updates or support. You have until %2$s to renew with a 25%% discount. %3$sRenew now!%4$s', 'wordpress-seo' ), 'Yoast', $formatted_date, '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '">', '</a>' );

			echo $this->get_banner( $title, $message );
			return;
		}
	}

	public function get_banner( $title, $message, $dismissable = false ) {
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
		if ( $dismissable ) {
			$notification .= sprintf(
				'<a href="%1$s" style="" class="button dismiss yoast-container__configuration-wizard--dismiss"><span class="screen-reader-text">%2$s</span><span class="dashicons dashicons-no-alt"></span></a>',
				esc_url( admin_url( 'admin.php?page=wpseo_dashboard&amp;dismiss_get_started=1' ) ),
				esc_html__( 'Dismiss this item.', 'wordpress-seo' )
			);
		}
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

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * WordPress integration for displaying a notification or banner for expiring add-ons.
 */
class WPSEO_Subscription_Notifier implements WPSEO_WordPress_Integration {

	/**
	 * Object representing a subscription.
	 *
	 * @var stdClass
	 */
	private $first_expiring_subscription;

	/**
	 * String representing the notification that should be shown.
	 *
	 * @var string
	 */
	private $current_notification;

	/**
	 * Yoast_Notification_Center instance.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * WPSEO_Addon_Manager instance.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * First plugin or addon to expire, will do so within 4 week.
	 *
	 * @var string
	 */
	const EXPIRATION_4_WEEKS      = 'plugins-expiration-4-weeks';
	/**
	 * First plugin or addon to expire, will do so within 1 week.
	 *
	 * @var string
	 */
	const EXPIRATION_1_WEEK       = 'plugins-expiration-1-week';
	/**
	 * First plugin or addon to expire, will do so within 1 day.
	 *
	 * @var string
	 */
	const EXPIRATION_1_DAY        = 'plugins-expiration-1-day';
	/**
	 * First plugin or addon to expire has expired today.
	 *
	 * @var string
	 */
	const EXPIRED_1_DAY           = 'plugins-expired-1-day';
	/**
	 * First plugin or addon to expire has expired in the last month.
	 *
	 * @var string
	 */
	const EXPIRED_MORE_THAN_1_DAY = 'plugins-expired-more-than-1-day';

	/**
	 * Identifier for the option containing the current notification.
	 *
	 * @var string
	 */
	const CURRENT_NOTIFICATION    = 'wpseo-current-expiration-notification';

	/**
	 * WPSEO_Subscription_Notifier constructor.
	 */
	public function __construct() {
		$this->addon_manager       = $this->get_addon_manager();
		$this->notification_center = $this->get_notification_center();
	}

	/**
	 * Get the addon manager.
	 *
	 * @return WPSEO_Addon_Manager
	 */
	protected function get_addon_manager() {
		return new WPSEO_Addon_Manager();
	}

	protected function get_notification_center() {
		return Yoast_Notification_Center::get();
	}

	/**
	 * Initialize notification.
	 *
	 * @returns void
	 */
	public function init() {
		$this->first_expiring_subscription = $this->get_first_expiring_subscription();

		if ( ! $this->first_expiring_subscription ) {
			return;
		}

		$this->current_notification = get_option( self::CURRENT_NOTIFICATION );

		$days_to_expiration = (int) ceil( ( time() - strtotime( $this->first_expiring_subscription->expiry_date ) ) / DAY_IN_SECONDS );

		$this->determine_notification( $days_to_expiration );

		$this->show_notification();
	}

	/**
	 * Sets the current notification to one of the defined constants, based on a set of conditions.
	 *
	 * @param int $days_to_expiration Days until the subscription expires.
	 *
	 * @return void
	 */
	private function determine_notification( $days_to_expiration ) {
		if ( $days_to_expiration < 28 && $days_to_expiration > 7 ) {
			$this->set_current_notification( self::EXPIRATION_4_WEEKS );
			return;
		}
		if ( $days_to_expiration <= 7 && $days_to_expiration > 1 ) {
			$this->set_current_notification( self::EXPIRATION_1_WEEK );
			return;
		}
		if ( $days_to_expiration === 1 ) {
			$this->set_current_notification( self::EXPIRATION_1_DAY );
			return;
		}
		if ( $days_to_expiration === 0 ) {
			$this->set_current_notification( self::EXPIRED_1_DAY );
			return;
		}
		if ( $days_to_expiration < 0 && $days_to_expiration > -30 ) {
			$this->set_current_notification( self::EXPIRED_MORE_THAN_1_DAY );
			return;
		}
		// If no condition is applicable, clean up the options and notifications.
		$this->clean_up();
	}

	/**
	 * Given a new notification identifier, checks if it differs versus the saved notification id and
	 * perform some clean up actions if it has changed.
	 *
	 * @param string $notification_id Identifier for the new notification that should be shown.
	 *
	 * @returns void
	 */
	private function set_current_notification( $notification_id ) {
		if ( $this->current_notification === $notification_id ) {
			return;
		}

		$this->current_notification = $notification_id;
		update_option( self::CURRENT_NOTIFICATION, $notification_id );
		$this->remove_all_notifications();
	}

	/**
	 * Clean up all persistent data related to this class.
	 *
	 * @returns void
	 */
	private function clean_up() {
		$this->current_notification = null;
		delete_option( self::CURRENT_NOTIFICATION );
		$this->remove_all_notifications();
	}

	/**
	 * Removes all notifications that can be added in $this->show_notification.
	 *
	 * @returns void
	 */
	private function remove_all_notifications() {
		$this->notification_center->remove_notification_by_id( self::EXPIRATION_4_WEEKS );
		$this->notification_center->remove_notification_by_id( self::EXPIRATION_1_DAY );
	}

	/**
	 * Gets the first add-on that will expire from teh add-on manager.
	 *
	 * @returns stdClass Object representing a subscription.
	 */
	protected function get_first_expiring_subscription() {
		// Required to make sure we only get the latest data.
		delete_transient( WPSEO_Addon_Manager::SITE_INFORMATION_TRANSIENT );

		$subscriptions = $this->addon_manager->get_subscriptions_for_active_addons();

		$subscriptions = array_filter( $subscriptions, array( $this, 'filter' ) );

		usort( $subscriptions, array( $this, 'compare_subscription_dates' ) );

		return $subscriptions[0];
	}

	/**
	 * Filter function to filter out invalid add-ons.
	 *
	 * @param stdClass $subscription Object representing a subscription.
	 *
	 * @return bool Whether or not it's a valid subscription
	 */
	public function filter( $subscription ) {
		if ( empty( $subscription->product->name ) ) {
			return false;
		}
		return true;
	}

	/**
	 * Compare function for usort to check which subscription expires sooner.
	 *
	 * @param stdClass $subscription1 Object representing a subscription.
	 * @param stdClass $subscription2 Object representing a subscription.
	 *
	 * @return int Positive if the first subscription expires later than the second.
	 */
	public function compare_subscription_dates( $subscription1, $subscription2 ) {
		return ( strtotime( $subscription1->expiry_date ) - strtotime( $subscription2->expiry_date ) ) > 0;
	}

	/**
	 * Show the appropriate notification based on the current notification id.
	 *
	 * @returns void
	 */
	private function show_notification() {
		if ( $this->current_notification === self::EXPIRATION_4_WEEKS ) {
			$message = sprintf( __( 'Your %1$s plugin(s) will expire within 4 weeks. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a 25%% discount!%3$s', 'wordpress-seo' ), 'Yoast', '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '"">'  , '</a>' );

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
			$message = sprintf( __( 'Your %1$s plugin(s) will expire in 1 day. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a 25%% discount!%3$s', 'wordpress-seo' ), 'Yoast', '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '"">'  , '</a>' );

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

	/**
	 * Show the appropriate banner based on the current notification id.
	 *
	 * @returns void
	 */
	public function show_banner() {
		if ( $this->current_notification === self::EXPIRATION_1_WEEK ) {
			// translators: %1$s expands to Yoast.
			$title          = sprintf( esc_html__( 'One or more %1$s plugins are about to expire!', 'wordpress-seo' ), 'Yoast' );
			$formatted_date = '<b>' . date_i18n( 'F jS, Y', strtotime( $this->first_expiring_subscription->expiry_date ) ) . '</b>';
			// translators: %1$s expands to Yoast, %2$s expands to a date string, %3$s expands to an opening anchor tag, %4$s expands to a closing anchor tag.
			$message        = sprintf( esc_html__( 'When plugins expire, you will no longer receive updates or support. You have until %2$s to renew with a 25%% discount. %3$sRenew now!%4$s', 'wordpress-seo' ), 'Yoast', $formatted_date, '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '">', '</a>' );

			echo $this->get_banner( $title, $message );
			return;
		}
		if ( $this->current_notification === self::EXPIRED_1_DAY ) {
			// translators: %1$s expands to Yoast.
			$title          = sprintf( esc_html__( 'Your %1$s plugins are expired!', 'wordpress-seo' ), 'Yoast' );
			$formatted_date = '<b>' . date_i18n( 'F jS, Y', strtotime( $this->first_expiring_subscription->expiry_date ) ) . '</b>';
			// translators: %1$s expands to Yoast, %2$s expands to a date string, %3$s expands to an opening anchor tag, %4$s expands to a closing anchor tag.
			$message        = sprintf( esc_html__( 'When plugins expire, you will no longer receive updates or support. You have until %2$s to renew with a 25%% discount. %3$sRenew now!%4$s', 'wordpress-seo' ), 'Yoast', $formatted_date, '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '">', '</a>' );

			echo $this->get_banner( $title, $message );
			return;
		}
	}

	/**
	 * Show the appropriate notification based on the current notification id.
	 *
	 * @param string $title       Banner title.
	 * @param string $message     Banner message.
	 * @param bool   $dismissable Whether or not the banner can be dismissed.
	 *
	 * @return string HTML for the banner.
	 */
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

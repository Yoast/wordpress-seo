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
	 * Used to store whether the notification has changed to reset the notification dismissal state.
	 *
	 * @var bool
	 */
	private $notification_has_changed = false;

	/**
	 * Id for the current notification.
	 *
	 * @var string
	 */
	private $current_notification_id;

	/**
	 * Notification id.
	 *
	 * @var string
	 */
	const EXPIRATION_NOTIFICATION_ID = 'wpseo-plugins-expiration-notification';

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

	/**
	 * Get the notification center.
	 *
	 * @return Yoast_Notification_Center
	 */
	protected function get_notification_center() {
		return Yoast_Notification_Center::get();
	}

	/**
	 * Initialize notification.
	 *
	 * @returns void
	 */
	public function init() {
		$this->current_notification_id = get_option( self::EXPIRATION_NOTIFICATION_ID );

		$this->first_expiring_subscription = $this->get_first_expiring_subscription();

		if ( $this->first_expiring_subscription === null ) {
			$this->clean_up();
			return;
		}

		$days_to_expiration = $this->get_days_until_expiration( $this->first_expiring_subscription );

		$this->determine_notification( $days_to_expiration );
	}

	/**
	 * Get the number of days until a subscription expires. 0 means the subscription has expired.
	 *
	 * @param stdClass $subscription Subscription to get the subscription expiration time for.
	 *
	 * @return int Number of days until expiration.
	 */
	protected function get_days_until_expiration( $subscription ) {
		return (int) ceil( ( strtotime( $subscription->expiry_date ) - time() ) / DAY_IN_SECONDS );
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

			$message = sprintf( __( 'Your %1$s plugin(s) will expire within 4 weeks. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a 25%% discount!%3$s', 'wordpress-seo' ), 'Yoast', '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '"">'  , '</a>' );
			$this->show_notification( $message );
			return;
		}
		if ( $days_to_expiration <= 7 && $days_to_expiration > 1 ) {
			$this->set_current_notification( self::EXPIRATION_1_WEEK );

			$formatted_date = '<b>' . date_i18n( 'F jS, Y', strtotime( $this->first_expiring_subscription->expiry_date ) ) . '</b>';
			$message        = sprintf( esc_html__( 'Your %1$s plugins are expired! When plugins expire, you will no longer receive updates or support. You have until %2$s to renew with a 25%% discount. %3$sRenew now!%4$s', 'wordpress-seo' ), 'Yoast', $formatted_date, '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '">', '</a>' );
			$this->show_notification( $message );
			return;
		}
		if ( $days_to_expiration === 1 ) {
			$this->set_current_notification( self::EXPIRATION_1_DAY );

			$message = sprintf( __( 'Your %1$s plugin(s) will expire in 1 day. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a 25%% discount!%3$s', 'wordpress-seo' ), 'Yoast', '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '"">'  , '</a>' );
			$this->show_notification( $message );
			return;
		}
		if ( $days_to_expiration === 0 ) {
			$this->set_current_notification( self::EXPIRED_1_DAY );

			$message = sprintf( __( 'Your %1$s plugin(s) are expired. When plugins expire you will no longer receive updates or support. Hereby, we give you the opportunity to renew your license with a %2$s25%% discount for a few more days!%3$s', 'wordpress-seo' ), 'Yoast', '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '">', '</a>' );
			$this->show_notification( $message );
			return;
		}
		if ( $days_to_expiration < 0 && $days_to_expiration > -30 ) {
			$this->set_current_notification( self::EXPIRED_MORE_THAN_1_DAY );

			$message = sprintf( esc_html__( 'When plugins expire, you will no longer receive updates or support. %3$sRenew now!%4$s', 'wordpress-seo' ), 'Yoast', '<a href="' . esc_url( $this->first_expiring_subscription->renewal_url ) . '">', '</a>' );
			$this->show_notification( $message );
			return;
		}
		// If no condition is applicable, clean up the options and notifications.
		$this->clean_up();
	}

	/**
	 * Set the current notification id, and if it has changed opposed to the saved id set notification_has_changed.
	 *
	 * @param string $notification_id Notification id.
	 *
	 * @returns void
	 */
	private function set_current_notification( $notification_id ) {
		if ( $this->current_notification_id === $notification_id ) {
			return;
		}

		update_option( self::EXPIRATION_NOTIFICATION_ID, $notification_id );
		$this->notification_has_changed = true;
	}

	/**
	 * Clean up all persistent data related to this class.
	 *
	 * @returns void
	 */
	private function clean_up() {
		$this->notification_center->remove_notification_by_id( self::EXPIRATION_NOTIFICATION_ID );
	}

	/**
	 * Gets the first add-on that will expire from teh add-on manager.
	 *
	 * @returns stdClass|null Object representing a subscription.
	 */
	protected function get_first_expiring_subscription() {
		// Required to make sure we only get the latest data.
		delete_transient( WPSEO_Addon_Manager::SITE_INFORMATION_TRANSIENT );

		$subscriptions = $this->addon_manager->get_subscriptions_for_active_addons();

		$subscriptions = array_filter( $subscriptions, array( $this, 'filter' ) );

		usort( $subscriptions, array( $this, 'compare_subscription_dates' ) );

		if ( count( $subscriptions ) === 0 ) {
			return null;
		}

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
	 * Show a notification.
	 *
	 * @param string $message Message to be shown.
	 *
	 * @returns void
	 */
	private function show_notification( $message ) {
		if ( $this->notification_has_changed ) {
			$this->notification_center->clear_dismissal( self::EXPIRATION_NOTIFICATION_ID );
		}

		$notification_options = array(
			'type'         => Yoast_Notification::ERROR,
			'id'           => self::EXPIRATION_NOTIFICATION_ID,
			'capabilities' => 'wpseo_manage_options',
		);

		$notification = new Yoast_Notification(
			$message,
			$notification_options
		);

		$this->notification_center->add_notification( $notification );
	}

	/**
	 * Registers all hooks to WordPress
	 *
	 * @return void
	 *
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		if ( filter_input( INPUT_GET, 'page' ) !== 'wpseo_dashboard' ) {
			return;
		}

		add_action( 'admin_init', array( $this, 'init' ) );
	}
}

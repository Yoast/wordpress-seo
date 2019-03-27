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
	 * Object representing a subscription with the earliest subscription expiration date.
	 *
	 * @var stdClass
	 */
	private $subscription_with_earliest_expiry_date;

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
	 * This value will be one of the constants listed below, starting with EXPIRATION_ or EXPIRED_.
	 *
	 * @var string
	 */
	private $current_notification_id;

	/**
	 * Notification id.
	 *
	 * @var string
	 */
	const NOTIFICATION_ID = 'wpseo-plugins-expiration-notification';

	/**
	 * First plugin or addon to expire, will do so within 4 weeks.
	 *
	 * @var string
	 */
	const EXPIRATION_WITHIN_4_WEEKS = 'plugins-expiration-within-4-weeks';

	/**
	 * First plugin or addon to expire, will do so within 1 week.
	 *
	 * @var string
	 */
	const EXPIRATION_WITHIN_1_WEEK = 'plugins-expiration-within-1-week';

	/**
	 * First plugin or addon to expire, will do so within 1 day.
	 *
	 * @var string
	 */
	const EXPIRATION_WITHIN_1_DAY = 'plugins-expiration-within-1-day';

	/**
	 * First plugin or addon to expire has expired today.
	 *
	 * @var string
	 */
	const EXPIRED_WITHIN_LAST_DAY = 'plugins-expired-within-last-day';

	/**
	 * First plugin or addon to expire has expired more than 1 day and less that 30 days.
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
	 * Gets the addon manager.
	 *
	 * @return WPSEO_Addon_Manager
	 */
	protected function get_addon_manager() {
		return new WPSEO_Addon_Manager();
	}

	/**
	 * Gets the notification center.
	 *
	 * @return Yoast_Notification_Center
	 */
	protected function get_notification_center() {
		return Yoast_Notification_Center::get();
	}

	/**
	 * Initializes the subscription notification.
	 *
	 * @return void
	 */
	public function init() {
		$this->current_notification_id = get_option( self::NOTIFICATION_ID );

		$this->subscription_with_earliest_expiry_date = $this->determine_subscription_with_earliest_expiry_date();

		if ( $this->subscription_with_earliest_expiry_date === null ) {
			$this->clean_up();
			return;
		}

		$days_until_expiration = $this->calculate_days_until_expiration( $this->subscription_with_earliest_expiry_date );

		$this->determine_notification( $days_until_expiration );
	}

	/**
	 * Calculates the number of days until a subscription expires. 0 or below means the subscription has expired.
	 *
	 * @param stdClass $subscription Subscription to get the subscription expiration time for.
	 *
	 * @return int Number of days until expiration.
	 */
	protected function calculate_days_until_expiration( $subscription ) {
		return (int) ceil( ( strtotime( $subscription->expiry_date ) - time() ) / DAY_IN_SECONDS );
	}

	/**
	 * Sets the current notification to one of the defined constants, based on a set of conditions.
	 *
	 * @param int $days_until_expiration Days until the subscription expires.
	 *
	 * @return void
	 */
	private function determine_notification( $days_until_expiration ) {
		if ( $days_until_expiration < 28 && $days_until_expiration > 7 ) {
			$this->set_current_notification( self::EXPIRATION_WITHIN_4_WEEKS );

			/* translators: %1$s expands to Yoast, %2$s expands to an opening anchor tag, %3$s expands to a percentage, %4$s expands to an closing anchor tag. */
			$message = sprintf( __( 'Your %1$s plugin(s) will expire within 4 weeks. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a %3$s discount!%4$s', 'wordpress-seo' ), 'Yoast', '<a href="' . $this->get_url() . '"">', '25%', '</a>' );
			$this->show_notification( $message );
			return;
		}
		if ( $days_until_expiration <= 7 && $days_until_expiration > 1 ) {
			$this->set_current_notification( self::EXPIRATION_WITHIN_1_WEEK );

			$formatted_date = '<b>' . date_i18n( 'F jS, HH:MM', strtotime( $this->subscription_with_earliest_expiry_date->expiry_date ) ) . '</b>';
			/* translators: %1$s expands to Yoast, %2$s expands to a formatted date and time (e.g. "Februari 8th 15:00"), %3$s expands to a percentage, %4$s expands to an opening anchor tag, %5$s expands to an closing anchor tag. */
			$message        = sprintf( esc_html__( 'Your %1$s plugins are about to expire! When plugins expire, you will no longer receive updates or support. You have until %2$s to renew with a %3%s discount. %4$sRenew now!%5$s', 'wordpress-seo' ), 'Yoast', $formatted_date, '25%', '<a href="' . $this->get_url() . '">', '</a>' );
			$this->show_notification( $message );
			return;
		}
		if ( $days_until_expiration === 1 ) {
			$this->set_current_notification( self::EXPIRATION_WITHIN_1_DAY );

			/* translators: %1$s expands to Yoast, %2$s expands to an opening anchor tag, %3$s expands to a percentage, %4$s expands to an closing anchor tag. */
			$message = sprintf( __( 'Your %1$s plugin(s) will expire in 1 day. When plugins expire, you will no longer receive updates or support. %2$sRenew now to get a %3%s discount!%4$s', 'wordpress-seo' ), 'Yoast', '<a href="' . $this->get_url() . '"">', '25%', '</a>' );
			$this->show_notification( $message );
			return;
		}
		if ( $days_until_expiration === 0 ) {
			$this->set_current_notification( self::EXPIRED_WITHIN_LAST_DAY );

			/* translators: %1$s expands to Yoast, %2$s expands to an opening anchor tag, %3$s expands to a percentage, %4$s expands to an closing anchor tag. */
			$message = sprintf( __( 'Your %1$s plugin(s) are expired. When plugins expire you will no longer receive updates or support. Hereby, we give you the opportunity to %2$srenew your license with a %3$s discount for a few more days!%3$s', 'wordpress-seo' ), 'Yoast', '<a href="' . $this->get_url() . '">', '25%', '</a>' );
			$this->show_notification( $message );
			return;
		}
		if ( $days_until_expiration < 0 && $days_until_expiration > -30 ) {
			$this->set_current_notification( self::EXPIRED_MORE_THAN_1_DAY );

			/* translators: %1$s expands to Yoast, %2$s expands to an opening anchor tag, %3$s expands to a percentage, %4$s expands to an closing anchor tag. */
			$message = sprintf( esc_html__( 'Your %1$s plugin(s) has expired within the last month. When plugins expire, you will no longer receive updates or support. Grab your last chance to %2$srenew with a %3$s discount!%4$s', 'wordpress-seo' ), 'Yoast', '<a href="' . $this->get_url() . '">', '25%', '</a>' );
			$this->show_notification( $message );
			return;
		}
		// If no condition is applicable, clean up the options and notifications.
		$this->clean_up();
	}

	/**
	 * Gets the URL for the expiration notification message.
	 *
	 * For implementation details see https://github.com/Yoast/wordpress-seo/pull/11170#issuecomment-477026724.
	 *
	 * @return string Escaped URL string.
	 */
	private function get_url() {
		if ( ! empty( $this->subscription_with_earliest_expiry_date->renewal_url ) ) {
			$url = $this->apply_utm_tags( $this->subscription_with_earliest_expiry_date->renewal_url );
		}
		else {
			$url = $this->get_shortlink();
		}

		return esc_url( $url );
	}

	/**
	 * Applies UTM tags to a URL.
	 *
	 * @param string $url The url to apply to.
	 *
	 * @return string The URL with applied UTM tags.
	 */
	private function apply_utm_tags( $url ) {
		return $url . $this->get_utm_tags();
	}

	/**
	 * Gets the UTM tags.
	 *
	 * @return string The UTM tags.
	 */
	private function get_utm_tags() {
		$tags = array(
			'utm_source'   => 'yoast-seo',
			'utm_medium'   => 'software',
			'utm_content'  => 'renewal-notification',
			'utm_campaign' => 'wordpress-ad',
			'utm_term'     => $this->get_utm_term(),
		);

		$utm_tags = '#';

		foreach ( $tags as $key => $value ) {
			$utm_tags .= $key . '=' . $value;
		}

		return $utm_tags;
	}

	/**
	 * Determines the UTM term that should be output.
	 *
	 * @return string The UTM term.
	 */
	private function get_utm_term() {
		switch ( $this->current_notification_id ) {
			case self::EXPIRATION_WITHIN_4_WEEKS:
				return '4-weeks-before';
			case self::EXPIRATION_WITHIN_1_WEEK:
				return '1-week-before';
			case self::EXPIRATION_WITHIN_1_DAY:
				return '1-day-before';
			case self::EXPIRED_WITHIN_LAST_DAY:
				return '1-day-after';
			case self::EXPIRED_MORE_THAN_1_DAY:
				return '29-days-after';
		}
		return '';
	}

	/**
	 * Gets the appropriate shortlink based on the expiration date.
	 *
	 * @return string The shortlink.
	 *
	 * @codeCoverageIgnore
	 */
	private function get_shortlink() {
		switch ( $this->current_notification_id ) {
			case self::EXPIRATION_WITHIN_4_WEEKS:
				return WPSEO_Shortlinker::get( 'https://yoa.st/3me' );
			case self::EXPIRATION_WITHIN_1_WEEK:
				return WPSEO_Shortlinker::get( 'https://yoa.st/3mf' );
			case self::EXPIRATION_WITHIN_1_DAY:
				return WPSEO_Shortlinker::get( 'https://yoa.st/3mg' );
			case self::EXPIRED_WITHIN_LAST_DAY:
				return WPSEO_Shortlinker::get( 'https://yoa.st/3mh' );
			case self::EXPIRED_MORE_THAN_1_DAY:
				return WPSEO_Shortlinker::get( 'https://yoa.st/3mi' );
			default:
				return '';
		}
	}

	/**
	 * Updates the current notification id when needed.
	 *
	 * @param string $notification_id Notification id.
	 *
	 * @return void
	 */
	private function set_current_notification( $notification_id ) {
		if ( $this->current_notification_id === $notification_id ) {
			return;
		}

		update_option( self::NOTIFICATION_ID, $notification_id );
		$this->notification_has_changed = true;
	}

	/**
	 * Clean up all persistent data related to this class.
	 *
	 * @return void
	 */
	private function clean_up() {
		delete_option( self::NOTIFICATION_ID );
		$this->notification_center->remove_notification_by_id( self::NOTIFICATION_ID );
	}

	/**
	 * Gets the first add-on that will expire (or has expired) from the add-on manager.
	 *
	 * @return stdClass|null Object representing a subscription.
	 */
	protected function determine_subscription_with_earliest_expiry_date() {
		// Required to make sure we only get the latest data.
		delete_transient( WPSEO_Addon_Manager::SITE_INFORMATION_TRANSIENT );

		$subscriptions = $this->addon_manager->get_subscriptions_for_active_addons();

		$subscriptions = array_filter( $subscriptions, array( $this, 'filter_out_invalid_subscriptions' ) );

		$subscriptions = array_values( $subscriptions );

		if ( count( $subscriptions ) === 0 ) {
			return null;
		}

		if ( count( $subscriptions ) === 1 ) {
			return $subscriptions[0];
		}

		$subscription_with_earliest_expiry_date = $subscriptions[0];
		$subscription_timestamp                 = strtotime( $subscription_with_earliest_expiry_date->expiry_date );

		for ( $i = 1; $i < count( $subscriptions ); $i ++ ) {
			$compare_timestamp = strtotime( $subscriptions[ $i ]->expiry_date );

			if ( $subscription_timestamp < $compare_timestamp ) {
				continue;
			}

			$subscription_with_earliest_expiry_date = $subscriptions[ $i ];
			$subscription_timestamp                 = $compare_timestamp;
		}

		return $subscription_with_earliest_expiry_date;
	}

	/**
	 * Filter function to filter out invalid add-ons.
	 *
	 * @param stdClass $subscription Object representing a subscription.
	 *
	 * @return bool Whether or not it's a valid subscription.
	 */
	public function filter_out_invalid_subscriptions( $subscription ) {
		if ( empty( $subscription->product->name ) ) {
			return false;
		}
		return true;
	}

	/**
	 * Shows a notification.
	 *
	 * @param string $message Message to be shown.
	 *
	 * @return void
	 */
	private function show_notification( $message ) {
		if ( $this->notification_has_changed ) {
			$this->notification_center->clear_dismissal( self::NOTIFICATION_ID );
		}

		$notification_options = array(
			'type'         => Yoast_Notification::ERROR,
			'id'           => self::NOTIFICATION_ID,
			'capabilities' => 'wpseo_manage_options',
		);

		$notification = new Yoast_Notification(
			$message,
			$notification_options
		);

		$this->notification_center->add_notification( $notification );
	}

	/**
	 * Registers all hooks to WordPress.
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

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents the upsell notice.
 */
class WPSEO_Product_Upsell_Notice {

	/**
	 * Holds the name of the user meta key.
	 *
	 * The value of this database field holds whether the user has dismissed this notice or not.
	 *
	 * @var string
	 */
	const USER_META_DISMISSED = 'wpseo-remove-upsell-notice';

	/**
	 * Holds the option name.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'wpseo';

	/**
	 * Holds the options.
	 *
	 * @var array
	 */
	protected $options;

	/**
	 * Sets the options, because they always have to be there on instance.
	 */
	public function __construct() {
		$this->options = $this->get_options();
	}

	/**
	 * Checks if the notice should be added or removed.
	 */
	public function initialize() {
		$this->remove_notification();
	}

	/**
	 * Sets the upgrade notice.
	 */
	public function set_upgrade_notice() {

		if ( $this->has_first_activated_on() ) {
			return;
		}

		$this->set_first_activated_on();
		$this->add_notification();
	}

	/**
	 * Listener for the upsell notice.
	 */
	public function dismiss_notice_listener() {
		if ( filter_input( INPUT_GET, 'yoast_dismiss' ) !== 'upsell' ) {
			return;
		}

		$this->dismiss_notice();

		wp_safe_redirect( admin_url( 'admin.php?page=wpseo_dashboard' ) );
		exit;
	}

	/**
	 * When the notice should be shown.
	 *
	 * @return bool
	 */
	protected function should_add_notification() {
		return ( $this->options['first_activated_on'] < strtotime( '-2weeks' ) );
	}

	/**
	 * Checks if the options has a first activated on date value.
	 *
	 * @return bool
	 */
	protected function has_first_activated_on() {
		return $this->options['first_activated_on'] !== false;
	}

	/**
	 * Sets the first activated on.
	 */
	protected function set_first_activated_on() {
		$this->options['first_activated_on'] = strtotime( '-2weeks' );

		$this->save_options();
	}

	/**
	 * Adds a notification to the notification center.
	 */
	protected function add_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $this->get_notification() );
	}

	/**
	 * Removes a notification to the notification center.
	 */
	protected function remove_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification( $this->get_notification() );
	}

	/**
	 * Returns a premium upsell section if using the free plugin.
	 *
	 * @return string
	 */
	protected function get_premium_upsell_section() {
		if ( ! YoastSEO()->helpers->product->is_premium() ) {
			return sprintf(
				/* translators: %1$s expands anchor to premium plugin page, %2$s expands to </a> */
				__( 'By the way, did you know we also have a %1$sPremium plugin%2$s? It offers advanced features, like a redirect manager and support for multiple keyphrases. It also comes with 24/7 personal support.', 'wordpress-seo' ),
				"<a href='" . WPSEO_Shortlinker::get( 'https://yoa.st/premium-notification' ) . "'>",
				'</a>'
			);
		}

		return '';
	}

	/**
	 * Gets the notification value.
	 *
	 * @return Yoast_Notification
	 */
	protected function get_notification() {
		$message = sprintf(
			/* translators: %1$s expands to Yoast SEO, %2$s is a link start tag to the plugin page on WordPress.org, %3$s is the link closing tag. */
			__( 'We\'ve noticed you\'ve been using %1$s for some time now; we hope you love it! We\'d be thrilled if you could %2$sgive us a 5 stars rating on WordPress.org%3$s!', 'wordpress-seo' ),
			'Yoast SEO',
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/rate-yoast-seo' ) . '">',
			'</a>'
		) . "\n\n";

		$message .= sprintf(
			/* translators: %1$s is a link start tag to the bugreport guidelines on the Yoast help center, %2$s is the link closing tag. */
			__( 'If you are experiencing issues, %1$splease file a bug report%2$s and we\'ll do our best to help you out.', 'wordpress-seo' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/bugreport' ) . '">',
			'</a>'
		) . "\n\n";

		$message .= $this->get_premium_upsell_section() . "\n\n";

		$message .= '<a class="button" href="' . admin_url( '?page=' . WPSEO_Admin::PAGE_IDENTIFIER . '&yoast_dismiss=upsell' ) . '">' . __( 'Please don\'t show me this notification anymore', 'wordpress-seo' ) . '</a>';

		$notification = new Yoast_Notification(
			$message,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-upsell-notice',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);

		return $notification;
	}

	/**
	 * Dismisses the notice.
	 *
	 * @return bool
	 */
	protected function is_notice_dismissed() {
		return get_user_meta( get_current_user_id(), self::USER_META_DISMISSED, true ) === '1';
	}

	/**
	 * Dismisses the notice.
	 */
	protected function dismiss_notice() {
		update_user_meta( get_current_user_id(), self::USER_META_DISMISSED, true );
	}

	/**
	 * Returns the set options.
	 *
	 * @return mixed
	 */
	protected function get_options() {
		return get_option( self::OPTION_NAME );
	}

	/**
	 * Saves the options to the database.
	 */
	protected function save_options() {
		update_option( self::OPTION_NAME, $this->options );
	}
}

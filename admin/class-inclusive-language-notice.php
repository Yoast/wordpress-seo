<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents the notice for the Inclusive language feature.
 */
class WPSEO_Inclusive_Language_Notice {

	/**
	 * Holds the name of the user meta key.
	 *
	 * The value of this database field holds whether the user has dismissed this notice or not.
	 *
	 * @var string
	 */
	const USER_META_DISMISSED = 'wpseo-remove-inclusive-language-notice';

	/**
	 * Holds the option name.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'wpseo';

	/**
	 * The Premium version in which the Inclusive language feature was added.
	 */
	const PREMIUM_VERSION_ADDED = '19.2-RC1';

	/**
	 * Holds the notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * WPSEO_Inclusive_Language_Notice constructor.
	 *
	 * @param Yoast_Notification_Center $notification_center  The notification center to add notifications to.
	 */
	public function __construct( Yoast_Notification_Center $notification_center ) {
		$this->notification_center = $notification_center;
	}

	/**
	 * Listener for the notice.
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
	 * Adds a notification to the notification center.
	 */
	public function add_notification() {
		$this->notification_center->add_notification( $this->get_notification() );
	}

	/**
	 * Removes a notification from the notification center.
	 */
	public function remove_notification() {
		$this->notification_center->remove_notification( $this->get_notification() );
	}

	/**
	 * Whether the notification should be shown.
	 *
	 * @return bool Whether or not the notification should be shown.
	 */
	public function should_show_notification() {
		$availability = new WPSEO_Metabox_Analysis_Inclusive_Language();

		return YoastSEO()->helpers->product->is_premium()
			&& YoastSEO()->helpers->language->has_inclusive_language_support( \WPSEO_Language_Utils::get_language( \get_locale() ) )
			&& ! $availability->is_globally_enabled()
			&& \version_compare( YoastSEO()->helpers->product->get_premium_version(), self::PREMIUM_VERSION_ADDED, '>=' );
	}

	/**
	 * Gets the notification value.
	 *
	 * @return Yoast_Notification
	 */
	protected function get_notification() {
		if ( is_multisite() && get_site_option( 'wpseo_ms' )['allow_inclusive_language_analysis_active'] === false ) {
			$message = sprintf(
			/* translators: %1$s is a link to the Features tab on the Yoast SEO Dashboard page, %2$s is a link to the blog post about this feature, %3$s is the link closing tag. */
				__(
					'<strong>New in Yoast SEO Premium 19.2:</strong> Did you know that you can now get feedback on the use of inclusive language? This feature is disabled by default. Please contact your Network admin if you want to enable it. %2$sLearn more about this feature%3$s.',
					'wordpress-seo'
				),
				'<a href="' . admin_url( 'admin.php?page=wpseo_dashboard#top#features' ) . '">',
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/inclusive-language-notification' ) . '" target="_blank">',
				'</a>'
			);
		}
		else {
			$message = sprintf(
			/* translators: %1$s is a link to the Features tab on the Yoast SEO Dashboard page, %2$s is a link to the blog post about this feature, %3$s is the link closing tag. */
				__(
					'<strong>New in Yoast SEO Premium 19.2:</strong> Did you know that you can now %1$senable the beta version of our inclusive language feature%3$s to get feedback on the use of inclusive language? This feature is disabled by default. %2$sLearn more about this feature%3$s.',
					'wordpress-seo'
				),
				'<a href="' . admin_url( 'admin.php?page=wpseo_dashboard#top#features' ) . '">',
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/inclusive-language-notification' ) . '" target="_blank">',
				'</a>'
			);
		}

		$notification = new Yoast_Notification(
			$message,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-inclusive-language-notice',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);

		return $notification;
	}

	/**
	 * Dismisses the notice.
	 */
	protected function dismiss_notice() {
		update_user_meta( get_current_user_id(), self::USER_META_DISMISSED, true );
	}
}

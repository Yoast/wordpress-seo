<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Alerts\Application\Debug_Display;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Environment_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Warns when PHP debug output may be visible on a production site.
 */
class Debug_Display_Alert implements Integration_Interface {

	public const NOTIFICATION_ID = 'wpseo-debug-display-enabled';

	/**
	 * Learn more URL for WordPress debugging docs.
	 */
	public const LEARN_MORE_URL = 'https://wordpress.org/documentation/article/debugging-in-wordpress/';

	/**
	 * The notifications center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * The environment helper.
	 *
	 * @var Environment_Helper
	 */
	private $environment_helper;

	/**
	 * Debug_Display_Alert constructor.
	 *
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 * @param Environment_Helper        $environment_helper  The environment helper.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		Environment_Helper $environment_helper
	) {
		$this->notification_center = $notification_center;
		$this->environment_helper  = $environment_helper;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'add_notifications' ] );
	}

	/**
	 * Adds or removes the notification based on debug display settings.
	 *
	 * @return void
	 */
	public function add_notifications() {
		if ( ! $this->should_show_notification() ) {
			$this->notification_center->remove_notification_by_id( self::NOTIFICATION_ID );
			return;
		}

		$this->notification_center->add_notification( $this->get_notification() );
	}

	/**
	 * Whether the debug display notification should be shown.
	 *
	 * @return bool
	 */
	protected function should_show_notification(): bool {
		return $this->environment_helper->is_production_mode()
			&& $this->is_debug_display_enabled();
	}

	/**
	 * Whether WP debug display is enabled.
	 *
	 * Mirrors core: when WP_DEBUG is true and WP_DEBUG_DISPLAY is not defined,
	 * WordPress defaults WP_DEBUG_DISPLAY to true.
	 *
	 * @return bool
	 */
	protected function is_debug_display_enabled(): bool {
		if ( ! \defined( 'WP_DEBUG' ) || ! \WP_DEBUG ) {
			return false;
		}

		return ! \defined( 'WP_DEBUG_DISPLAY' ) || \WP_DEBUG_DISPLAY;
	}

	/**
	 * Builds the debug display notification.
	 *
	 * @return Yoast_Notification The notification.
	 */
	private function get_notification(): Yoast_Notification {
		return new Yoast_Notification(
			$this->get_message(),
			[
				'id'           => self::NOTIFICATION_ID,
				'type'         => Yoast_Notification::WARNING,
				'capabilities' => [ 'wpseo_manage_options' ],
			],
		);
	}

	/**
	 * Returns the notification message as an HTML string.
	 *
	 * @return string The HTML string representation of the notification.
	 */
	private function get_message(): string {
		return \sprintf(
			/* translators: %1$s expands to the opening strong tag, %2$s expands to the closing strong tag, %3$s expands to the opening anchor tag, %4$s expands to the closing anchor tag. */
			\esc_html__(
				'%1$sSEO issue: PHP debug output may be visible on your site.%2$s Your site is running with WP_DEBUG and WP_DEBUG_DISPLAY enabled. Error messages can appear on the frontend and get indexed by search engines. In wp-config.php, set WP_DEBUG_DISPLAY to false (and prefer WP_DEBUG_LOG if you still need debugging). %3$sLearn more about debugging in WordPress%4$s.',
				'wordpress-seo',
			),
			'<strong>',
			'</strong>',
			'<a href="' . \esc_url( self::LEARN_MORE_URL ) . '" target="_blank" rel="noopener noreferrer">',
			'</a>',
		);
	}
}

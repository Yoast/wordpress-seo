<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Presenters\Admin\Auto_Update_Notification_Presenter;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Shows a notification for users who have WordPress auto updates enabled but not Yoast SEO auto updates.
 */
class Auto_Update implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The notification ID.
	 */
	const NOTIFICATION_ID = 'wpseo-auto-update';

	/**
	 * The Yoast notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The notification helper.
	 *
	 * @var Notification_Helper
	 */
	protected $notification_helper;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	protected $product_helper;

	/**
	 * Auto_Update constructor.
	 *
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 * @param Notification_Helper       $notification_helper The notification helper.
	 * @param Product_Helper            $product_helper      The product helper.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		Notification_Helper $notification_helper,
		Product_Helper $product_helper
	) {
		$this->notification_center = $notification_center;
		$this->notification_helper = $notification_helper;
		$this->product_helper      = $product_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * On admin_init, it is checked whether the notification to auto-update Yoast SEO needs to be shown or removed.
	 * This is also done when major WP core updates are being enabled or disabled,
	 * and when automatic updates for Yoast SEO are being enabled or disabled.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'auto_update_notification' ] );
		\add_action( 'update_option_auto_update_core_major', [ $this, 'auto_update_notification' ] );
		\add_action( 'update_option_auto_update_plugins', [ $this, 'auto_update_notification' ] );
	}

	/**
	 * Handles the Yoast SEO auto-update notification.
	 *
	 * @return void
	 */
	public function auto_update_notification() {
		$this->maybe_cleanup_notification();
		$this->maybe_create_notification();
	}

	/**
	 * Removes the notification from the notification center, if it exists.
	 *
	 * @return void
	 */
	public function maybe_cleanup_notification() {
		$notification = $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID );

		if ( $notification === null ) {
			return;
		}

		if ( $this->should_show_notification() ) {
			return;
		}

		$this->notification_center->remove_notification_by_id( self::NOTIFICATION_ID );
	}

	/**
	 * Creates the notification if it doesn't exist already.
	 *
	 * @return void
	 */
	public function maybe_create_notification() {
		if ( ! $this->should_show_notification() ) {
			return;
		}

		if ( ! $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID ) ) {
			$notification = $this->notification();
			$this->notification_helper->restore_notification( $notification );
			$this->notification_center->add_notification( $notification );
		}
	}

	/**
	 * Checks whether the Yoast SEO auto-update notification should be shown.
	 *
	 * @return bool Whether the notification should be shown.
	 */
	protected function should_show_notification() {
		$core_updates_enabled   = \get_option( 'auto_update_core_major' ) === "enabled";
		$plugins_to_auto_update = \get_option( 'auto_update_plugins' );

		if ( $plugins_to_auto_update ) {
			$yoast_updates_enabled = \in_array( "wordpress-seo/wp-seo.php", \get_option( 'auto_update_plugins' ), true );

			return $core_updates_enabled && ! $yoast_updates_enabled;
		}

		// If no plugins are set to be automatically updated, it means that Yoast SEO isn't either.
		return $core_updates_enabled;
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function notification() {
		$presenter = new Auto_Update_Notification_Presenter( $this->product_helper );

		return new Yoast_Notification(
			$presenter,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);
	}
}

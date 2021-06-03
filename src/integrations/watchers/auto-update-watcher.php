<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Auto_Update_Notification_Presenter;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Shows a notification for users who have WordPress auto updates enabled but not Yoast SEO auto updates.
 */
class Auto_Update_Watcher implements Integration_Interface {

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
	 * Auto_Update constructor.
	 *
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 * @param Notification_Helper       $notification_helper The notification helper.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		Notification_Helper $notification_helper
	) {
		$this->notification_center = $notification_center;
		$this->notification_helper = $notification_helper;
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
		\add_action( 'admin_init', [ $this, 'auto_update_notification_not_if_dismissed' ] );
		\add_action( 'update_site_option_auto_update_core_major', [ $this, 'auto_update_notification_even_if_dismissed' ] );
		\add_action( 'update_site_option_auto_update_plugins', [ $this, 'auto_update_notification_not_if_dismissed' ] );
	}

	/**
	 * Handles the Yoast SEO auto-update notification when the user toggles the auto-update setting for WordPress Core.
	 *
	 * If it should be shown, this will be done even if the notification has been dismissed in the past.
	 *
	 * @return void
	 */
	public function auto_update_notification_even_if_dismissed() {
		if ( ! $this->should_show_notification() ) {
			$this->save_dismissal_status();
			$this->maybe_remove_notification();

			return;
		}

		$this->maybe_create_notification();
	}

	/**
	 * Handles the Yoast SEO auto-update notification on all admin pages,
	 * as well as when the user toggles the Yoast SEO auto-update setting.
	 *
	 * If it should be shown, this will only be done if the notification has not been dismissed in the past.
	 *
	 * @return void
	 */
	public function auto_update_notification_not_if_dismissed() {
		if ( ! $this->should_show_notification() ) {
			$this->save_dismissal_status();
			$this->maybe_remove_notification();

			return;
		}

		$this->maybe_create_notification_if_not_dismissed();
	}

	/**
	 * Checks whether the Yoast SEO auto-update notification should be shown.
	 *
	 * @return bool Whether the notification should be shown.
	 */
	protected function should_show_notification() {
		$core_updates_enabled  = \get_site_option( 'auto_update_core_major' ) === 'enabled';
		$yoast_updates_enabled = $this->yoast_auto_updates_enabled();

		return $core_updates_enabled && ! $yoast_updates_enabled;
	}

	/**
	 * Saves the dismissal status of the notification in an option in wp_usermeta, if the notification gets dismissed.
	 *
	 * @return void
	 */
	protected function save_dismissal_status() {
		// This option exists if the notification has been dismissed at some point.
		$notification_dismissed = \get_user_option( 'wp_' . self::NOTIFICATION_ID );

		// We wish to have its value in a different option, so we can still access it even when the notification gets removed.
		if ( $notification_dismissed && ! \get_user_option( 'wp_' . self::NOTIFICATION_ID . '_dismissed' ) ) {
			\update_user_option( \get_current_user_id(), self::NOTIFICATION_ID . '_dismissed', true );
		}
	}

	/**
	 * Removes the notification from the notification center, if it exists.
	 *
	 * @return void
	 */
	protected function maybe_remove_notification() {
		$this->notification_center->remove_notification_by_id( self::NOTIFICATION_ID );
	}

	/**
	 * Creates the notification if it doesn't exist already.
	 *
	 * @return void
	 */
	protected function maybe_create_notification() {
		if ( ! $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID ) ) {
			$notification = $this->notification();
			$this->notification_helper->restore_notification( $notification );
			$this->notification_center->add_notification( $notification );
		}
	}

	/**
	 * Creates the notification when Yoast SEO auto-updates are enabled, if it hasn't been dismissed in the past.
	 *
	 * @return void
	 */
	protected function maybe_create_notification_if_not_dismissed() {
		$notification_dismissed = \get_user_option( 'wp_' . self::NOTIFICATION_ID . '_dismissed' ) === '1';
		$yoast_updates_enabled  = $this->yoast_auto_updates_enabled();

		if ( $notification_dismissed && ! $yoast_updates_enabled ) {
			return;
		}

		$this->maybe_create_notification();
	}

	/**
	 * Checks whether auto-updates are enabled for Yoast SEO.
	 *
	 * @return bool True if they are enabled, false if not.
	 */
	protected function yoast_auto_updates_enabled() {
		$plugins_to_auto_update = \get_site_option( 'auto_update_plugins' );

		// If no plugins are set to be automatically updated, it means that Yoast SEO isn't either.
		if ( ! $plugins_to_auto_update ) {
			return false;
		}

		// Check if the Yoast SEO plugin file is in the array of plugins for which auto-updates are enabled.
		return \in_array( 'wordpress-seo/wp-seo.php', $plugins_to_auto_update, true );
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function notification() {
		$presenter = new Auto_Update_Notification_Presenter();

		return new Yoast_Notification(
			$presenter->present(),
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);
	}
}

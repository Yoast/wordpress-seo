<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_Page_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Dismissable_Notification_Presenter;

/**
 * Redesign_Notification_Integration class
 */
class Redesign_Notification_Integration implements Integration_Interface {

	/**
	 * The notification identifier.
	 *
	 * @var string
	 */
	private $identifier = 'wpseo-notification-redesign-14.5';

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class, Yoast_Admin_Page_Conditional::class ];
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'dismiss_notification' ] );

		// Update was after 14.5 release; don't show a notification.
		if ( ! $this->is_installed_before_redesign() ) {
			return;
		}

		\add_action( 'admin_notices', [ $this, 'render_admin_notice' ], 20 );
	}

	/**
	 * Checks if the notification is dismissed.
	 *
	 * @return bool True if the notification is dismissed.
	 */
	private function is_notification_dismissed() {
		$user_id = \get_current_user_id();
		if ( 0 === $user_id ) {
			return true;
		}

		$notification_dismissed = \get_user_meta( $user_id, $this->identifier, true );

		return ! empty( $notification_dismissed );
	}

	/**
	 * Dismisses the notification.
	 *
	 * @return void
	 */
	public function dismiss_notification() {
		if ( ! \wp_verify_nonce(
			\filter_input( INPUT_GET, 'nonce', FILTER_SANITIZE_STRING ),
			'wpseo-dismiss-notification'
		) ) {
			return;
		}

		if ( \filter_input( INPUT_GET, 'identifier', FILTER_SANITIZE_STRING ) !== $this->identifier ) {
			return;
		}

		$user_id = \get_current_user_id();
		if ( 0 === $user_id ) {
			return;
		}

		// Store the meta setting, this prevents the message showing again.
		\update_user_meta( $user_id, $this->identifier, 'dismissed' );
	}

	/**
	 * Renders the notification.
	 *
	 * @return void
	 */
	public function render_admin_notice() {
		// Dismissed cannot be checked in the register_hooks, as the dismissal could be on the current request.
		if ( $this->is_notification_dismissed() ) {
			return;
		}

		$copy = \sprintf(
			__(
				'We decided to give %1$s a new look. Don’t worry, all your settings are secure and can still be found in the same place as before.',
				'wordpress-seo'
			),
			'Yoast SEO'
		);

		echo new Dismissable_Notification_Presenter( $copy, $this->identifier, \__( 'I understand, remove this message.', 'wordpress-seo' ) );
	}

	/**
	 * Checks if the plugin was activated before the redesign release.
	 *
	 * @return bool True if it was installed before the release date.
	 */
	private function is_installed_before_redesign() {
		// July 7th 2020, 12:00 CEST
		$redesign_release_date = 1594116000;
		$activation_time       = \WPSEO_Options::get( 'first_activated_on' );

		return ( $activation_time < $redesign_release_date );
	}
}

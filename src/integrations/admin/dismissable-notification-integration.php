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
 * Dismissable_Notification_Integration class
 */
abstract class Dismissable_Notification_Integration implements Integration_Interface {

	/**
	 * The identifier of the notification.
	 *
	 * @var string
	 */
	protected $identifier = '';

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

		if ( ! $this->can_show_notification() ) {
			return;
		}

		\add_action( 'admin_notices', [ $this, 'render_admin_notice' ], 20 );
	}

	/**
	 * Provides the identifier for this notification.
	 *
	 * @return string The identifier for this notification.
	 */
	abstract protected function get_identifier();

	/**
	 * Determines if the notification should be shown.
	 *
	 * @return bool True if the notification should be shown.
	 */
	abstract protected function can_show_notification();

	/**
	 * Dismisses the notification.
	 *
	 * @return void
	 */
	public function dismiss_notification() {
		if ( ! \wp_verify_nonce(
			\filter_input( INPUT_GET, 'nonce', FILTER_SANITIZE_STRING ),
			Dismissable_Notification_Presenter::NONCE_KEY
		) ) {
			return;
		}

		if ( \filter_input( INPUT_GET, 'identifier', FILTER_SANITIZE_STRING ) !== $this->get_identifier() ) {
			return;
		}

		$user_id = \get_current_user_id();
		if ( 0 === $user_id ) {
			return;
		}

		// Store the meta setting, this prevents the message showing again.
		\update_user_meta( $user_id, $this->get_identifier(), 'dismissed' );
	}

	/**
	 * Provides the message to be displayed in the notification.
	 *
	 * @return string The message to be displayed.
	 */
	abstract protected function get_message();

	/**
	 * Provides the label to be shown on the dismiss button.
	 *
	 * @return string The label to be shown on the dismiss button.
	 */
	abstract protected function get_dismiss_label();

	/**
	 * Provides the type of notification that will be shown.
	 *
	 * Should be one of 'info', 'warning' or 'error'.
	 *
	 * @return string The type of notification to show.
	 */
	abstract protected function get_notification_type();

	/**
	 * Renders the notification.
	 *
	 * @return void
	 */
	public function render_admin_notice() {
		// Dismissed cannot be checked in the register_hooks, as the dismissal could be on the current request.
		if ( ! $this->can_show_notification() ) {
			return;
		}

		echo new Dismissable_Notification_Presenter(
			$this->get_message(),
			$this->get_identifier(),
			$this->get_notification_type(),
			$this->get_dismiss_label()
		);
	}
}

<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Notification;
use Yoast_Notification_Center;

class Indexing_Notification_Integration implements Integration_Interface {

	const NOTIFICATION_ID = 'wpseo-reindex';

	/**
	 * The indexing integration.
	 *
	 * @var Indexing_Integration
	 */
	private $indexing_integration;

	/**
	 * The Yoast notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * Prominent_Words_Notifier constructor.
	 *
	 * @param Indexing_Integration      $indexing_integration The indexing integration.
	 * @param Yoast_Notification_Center $notification_center  The notification center.
	 */
	public function __construct(
		Indexing_Integration $indexing_integration,
		Yoast_Notification_Center $notification_center
	) {
		$this->indexing_integration = $indexing_integration;
		$this->notification_center  = $notification_center;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		if ( \filter_input( INPUT_GET, 'page' ) === 'wpseo_dashboard' ) {
			\add_action( 'admin_init', [ $this, 'cleanup_notification' ] );
		}
//
//		if ( ! \wp_next_scheduled( self::NOTIFICATION_ID ) ) {
//			\wp_schedule_event( time(), 'daily', self::NOTIFICATION_ID );
//		}

		\add_action( 'admin_init', [ $this, 'create_notification' ] );
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class
		];
	}

	/**
	 * Checks whether the notification should be shown and removes
	 * it from the notification center if this is the case.
	 */
	public function create_notification() {
		$notification = $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID );

		if ( $notification || ! $this->should_show_notification() ) {
			return;
		}

		$this->notification_center->add_notification( $this->notification() );
	}

	/**
	 * Checks whether the notification should not be shown anymore and removes
	 * it from the notification center if this is the case.
	 */
	protected function cleanup_notification() {
		$notification = $this->notification_center->get_notification_by_id( self::NOTIFICATION_ID );

		if ( $notification === null || $this->should_show_notification() ) {
			return;
		}

		$this->notification_center->remove_notification( $notification );
	}

	/**
	 * Checks whether the notification should be shown.
	 *
	 * @return bool If the notification should be shown.
	 */
	protected function should_show_notification() {
		$total_unindexed = $this->indexing_integration->get_total_unindexed();

		return $total_unindexed > 0;
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function notification() {
		return new Yoast_Notification(
			'This is a message!',
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);
	}
}

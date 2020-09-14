<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Notification_Presenter;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Class Indexing_Notification_Integration
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
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
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Prominent_Words_Notifier constructor.
	 *
	 * @param Indexing_Integration      $indexing_integration The indexing integration.
	 * @param Yoast_Notification_Center $notification_center  The notification center.
	 * @param Options_Helper            $options_helper       The options helper.
	 */
	public function __construct(
		Indexing_Integration $indexing_integration,
		Yoast_Notification_Center $notification_center,
		Options_Helper $options_helper
	) {
		$this->indexing_integration = $indexing_integration;
		$this->notification_center  = $notification_center;
		$this->options_helper       = $options_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		if ( \filter_input( INPUT_GET, 'page' ) === 'wpseo_dashboard' ) {
			\add_action( 'admin_init', [ $this, 'cleanup_notification' ] );
		}

		if ( ! \wp_next_scheduled( self::NOTIFICATION_ID ) ) {
			\wp_schedule_event( time(), 'daily', self::NOTIFICATION_ID );
		}

		\add_action( self::NOTIFICATION_ID, [ $this, 'create_notification' ] );
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class,
		];
	}

	/**
	 * Checks whether the notification should be shown and removes
	 * it from the notification center if this is the case.
	 */
	public function create_notification() {
		$this->notification_center->add_notification( $this->notification() );
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
	public function cleanup_notification() {
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
		$indexation_started        = $this->options_helper->get( 'indexation_started', false );
		$indexation_completed      = $this->options_helper->get( 'indexation_completed', false );
		$ignore_indexation_warning = $this->options_helper->get( 'ignore_indexation_warning', false );

		return (
			$indexation_started === false &&
			$indexation_completed === false &&
			$ignore_indexation_warning === false
		);
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function notification() {
		$notification_presenter = new Indexing_Notification_Presenter(
			$this->indexing_integration->get_total_unindexed()
		);

		return new Yoast_Notification(
			$notification_presenter,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => self::NOTIFICATION_ID,
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);
	}
}

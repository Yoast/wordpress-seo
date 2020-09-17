<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Notification_Presenter;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Failed_Notification_Presenter;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Class Indexing_Notification_Integration
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
class Indexing_Notification_Integration implements Integration_Interface {

	/**
	 * The notification ID.
	 */
	const NOTIFICATION_ID = 'wpseo-reindex';

	/**
	 * Represents the reason that the indexing process failed and should be tried again.
	 */
	const REASON_INDEXING_FAILED = 'indexing_failed';

	/**
	 * Represents the reason that the permalink settings are changed.
	 */
	const REASON_PERMALINK_SETTINGS = 'permalink_settings_changed';

	/**
	 * Represents the reason that the category base is changed.
	 */
	const REASON_CATEGORY_BASE_PREFIX = 'category_base_changed';

	/**
	 * Represents the reason that the home url option is changed.
	 */
	const REASON_HOME_URL_OPTION = 'home_url_option_changed';

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
		if ( $this->is_indexation_warning_hidden() ) {
			return false;
		}

		$indexation_reason         = $this->options_helper->get( 'indexables_indexation_reason', '' );
		$indexation_started        = $this->options_helper->get( 'indexation_started', false );
		$indexation_completed      = $this->options_helper->get( 'indexables_indexation_completed', false );
		$ignore_indexation_warning = $this->options_helper->get( 'ignore_indexation_warning', false );

		if ( $indexation_reason ) {
			return true;
		}

		return (
			$indexation_started === false &&
			$indexation_completed === false &&
			$ignore_indexation_warning === false
		);
	}

	/**
	 * Returns if the indexation warning is temporarily hidden.
	 *
	 * @return bool True if hidden.
	 */
	protected function is_indexation_warning_hidden() {
		if ( $this->options_helper->get( 'ignore_indexation_warning', false ) === true ) {
			return true;
		}

		// When the indexation is started, but not completed.
		if ( $this->options_helper->get( 'indexation_started', false ) > ( \time() - \MONTH_IN_SECONDS ) ) {
			return true;
		}

		$hide_until = (int) $this->options_helper->get( 'indexation_warning_hide_until' );

		return ( $hide_until !== 0 && $hide_until >= \time() );
	}

	/**
	 * Determines the message to show in the indexing notification.
	 *
	 * @param string $indexation_reason The reason identifier.
	 *
	 * @return string The message to show in the notification.
	 */
	protected function get_notification_message( $indexation_reason ) {
		switch ( $indexation_reason ) {
			case self::REASON_PERMALINK_SETTINGS:
				return \esc_html__( 'Because of a change in your permalink structure, some of your SEO data needs to be reprocessed.', 'wordpress-seo' );
			case self::REASON_CATEGORY_BASE_PREFIX:
				return \esc_html__( 'Because of a change in your category URL setting, some of your SEO data needs to be reprocessed.', 'wordpress-seo' );
			case self::REASON_HOME_URL_OPTION:
				return \esc_html__( 'Because of a change in your home URL setting, some of your SEO data needs to be reprocessed.', 'wordpress-seo' );
			default:
				return \esc_html__( 'You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored. ', 'wordpress-seo' );
		}
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function notification() {
		$indexation_reason = $this->options_helper->get( 'indexables_indexation_reason', '' );

		if ( $indexation_reason === self::REASON_INDEXING_FAILED ) {
			$presenter = new Indexing_Failed_Notification_Presenter();
		}
		else {
			$total_unindexed = $this->indexing_integration->get_total_unindexed();
			$presenter       = new Indexing_Notification_Presenter( $total_unindexed, $this->get_notification_message( $indexation_reason ) );
		}

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

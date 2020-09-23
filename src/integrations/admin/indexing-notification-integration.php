<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
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
	protected $indexing_integration;

	/**
	 * The Yoast notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	protected $product_helper;

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	protected $page_helper;

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	protected $date_helper;

	/**
	 * The short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Prominent_Words_Notifier constructor.
	 *
	 * @param Indexing_Integration      $indexing_integration The indexing integration.
	 * @param Yoast_Notification_Center $notification_center  The notification center.
	 * @param Options_Helper            $options_helper       The options helper.
	 * @param Product_Helper            $product_helper       The product helper.
	 * @param Current_Page_Helper       $page_helper          The current page helper.
	 * @param Date_Helper               $date_helper          The date helper.
	 * @param Short_Link_Helper         $short_link_helper    The short link helper.
	 */
	public function __construct(
		Indexing_Integration $indexing_integration,
		Yoast_Notification_Center $notification_center,
		Options_Helper $options_helper,
		Product_Helper $product_helper,
		Current_Page_Helper $page_helper,
		Date_Helper $date_helper,
		Short_Link_Helper $short_link_helper
	) {
		$this->indexing_integration = $indexing_integration;
		$this->notification_center  = $notification_center;
		$this->options_helper       = $options_helper;
		$this->product_helper       = $product_helper;
		$this->page_helper          = $page_helper;
		$this->date_helper          = $date_helper;
		$this->short_link_helper    = $short_link_helper;
	}

	/**
	 * Initializes the integration.
	 *
	 * Adds hooks and jobs to cleanup or add the notification when necessary.
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( $this->page_helper->get_current_yoast_seo_page() === 'wpseo_dashboard' ) {
			\add_action( 'admin_init', [ $this, 'cleanup_notification' ] );
		}

		if ( ! \wp_next_scheduled( self::NOTIFICATION_ID ) ) {
			\wp_schedule_event( $this->date_helper->current_time(), 'daily', self::NOTIFICATION_ID );
		}

		\add_action( self::NOTIFICATION_ID, [ $this, 'create_notification' ] );
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class,
		];
	}

	/**
	 * Checks whether the notification should be shown and adds
	 * it to the notification center if this is the case.
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
		/*
		 * Never show a notification when nothing should be indexed.
		 */
		if ( $this->indexing_integration->get_total_unindexed() === 0 ) {
			return false;
		}

		$indexing_reason = $this->options_helper->get( 'indexables_indexation_reason', '' );

		/*
		 * Show a notification when we have a reason to do so.
		 * For example when indexing has failed before and the user should try again.
		 */
		if ( $indexing_reason ) {
			return true;
		}

		/**
		 * The UNIX timestamp on which indexing has started.
		 * Defaults to `null` to indicate that indexing has not started yet.
		 */
		$time_indexation_started = $this->options_helper->get( 'indexation_started' );

		/*
		 * Do not show the notification when the indexation has started, but not completed.
		 * I.e. when the user stopped it manually.
		 */
		if ( $time_indexation_started && $time_indexation_started > ( $this->date_helper->current_time() - \MONTH_IN_SECONDS ) ) {
			return false;
		}

		/*
		 * Show the notification when it is not in the hide notification period.
		 * (E.g. when the user clicked on 'hide this notification for a week').
		 */
		$hide_until = (int) $this->options_helper->get( 'indexation_warning_hide_until' );

		return ( $hide_until !== 0 && $hide_until >= $this->date_helper->current_time() );
	}

	/**
	 * Determines the message to show in the indexing notification.
	 *
	 * @param string $reason The reason identifier.
	 *
	 * @return string The message to show in the notification.
	 */
	protected function get_notification_message( $reason ) {
		switch ( $reason ) {
			case self::REASON_PERMALINK_SETTINGS:
				$text = \esc_html__( 'Because of a change in your permalink structure, some of your SEO data needs to be reprocessed.', 'wordpress-seo' );
				break;
			case self::REASON_CATEGORY_BASE_PREFIX:
				$text = \esc_html__( 'Because of a change in your category URL setting, some of your SEO data needs to be reprocessed.', 'wordpress-seo' );
				break;
			case self::REASON_HOME_URL_OPTION:
				$text = \esc_html__( 'Because of a change in your home URL setting, some of your SEO data needs to be reprocessed.', 'wordpress-seo' );
				break;
			default:
				$text = \esc_html__( 'You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored. ', 'wordpress-seo' );
		}

		/**
		 * Filter: 'wpseo_indexables_indexation_alert' - Allow developers to filter the reason of the indexation
		 *
		 * @param string $text   The text to show as reason.
		 * @param string $reason The reason value.
		 */
		return (string) \apply_filters( 'wpseo_indexables_indexation_alert', $text, $reason );
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function notification() {
		$reason = $this->options_helper->get( 'indexables_indexation_reason', '' );

		$presenter = $this->get_presenter( $reason );

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

	/**
	 * Gets the presenter to use to show the notification.
	 *
	 * @param string $reason The reason for the notification.
	 *
	 * @return Indexing_Failed_Notification_Presenter|Indexing_Notification_Presenter
	 */
	protected function get_presenter( $reason ) {
		if ( $reason === self::REASON_INDEXING_FAILED ) {
			$presenter = new Indexing_Failed_Notification_Presenter( $this->product_helper->is_premium() );
		}
		else {
			$total_unindexed = $this->indexing_integration->get_total_unindexed();
			$presenter       = new Indexing_Notification_Presenter( $this->short_link_helper, $total_unindexed, $this->get_notification_message( $reason ) );
		}

		return $presenter;
	}
}

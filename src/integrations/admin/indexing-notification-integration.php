<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Notification_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Notification_Presenter;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Failed_Notification_Presenter;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Class Indexing_Notification_Integration.
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
	 * @var Indexing_Tool_Integration
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
	 * The notification helper.
	 *
	 * @var Notification_Helper
	 */
	protected $notification_helper;

	/**
	 * Prominent_Words_Notifier constructor.
	 *
	 * @param Indexing_Tool_Integration $indexing_integration The indexing integration.
	 * @param Yoast_Notification_Center $notification_center  The notification center.
	 * @param Options_Helper            $options_helper       The options helper.
	 * @param Product_Helper            $product_helper       The product helper.
	 * @param Current_Page_Helper       $page_helper          The current page helper.
	 * @param Date_Helper               $date_helper          The date helper.
	 * @param Short_Link_Helper         $short_link_helper    The short link helper.
	 * @param Notification_Helper       $notification_helper  The notification helper.
	 */
	public function __construct(
		Indexing_Tool_Integration $indexing_integration,
		Yoast_Notification_Center $notification_center,
		Options_Helper $options_helper,
		Product_Helper $product_helper,
		Current_Page_Helper $page_helper,
		Date_Helper $date_helper,
		Short_Link_Helper $short_link_helper,
		Notification_Helper $notification_helper
	) {
		$this->indexing_integration = $indexing_integration;
		$this->notification_center  = $notification_center;
		$this->options_helper       = $options_helper;
		$this->product_helper       = $product_helper;
		$this->page_helper          = $page_helper;
		$this->date_helper          = $date_helper;
		$this->short_link_helper    = $short_link_helper;
		$this->notification_helper  = $notification_helper;
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
			\add_action( 'admin_init', [ $this, 'maybe_cleanup_notification' ] );
		}

		if ( $this->options_helper->get( 'indexing_reason' ) ) {
			\add_action( 'admin_init', [ $this, 'maybe_create_notification' ] );
		}

		\add_action( self::NOTIFICATION_ID, [ $this, 'maybe_create_notification' ] );
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
	public function maybe_create_notification() {
		if ( ! $this->should_show_notification() ) {
			return;
		}

		$notification = $this->notification();
		$this->notification_helper->restore_notification( $notification );
		$this->options_helper->set( 'indexation_warning_hide_until', false );
		$this->notification_center->add_notification( $notification );
	}

	/**
	 * Checks whether the notification should not be shown anymore and removes
	 * it from the notification center if this is the case.
	 */
	public function maybe_cleanup_notification() {
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
		if ( $this->indexing_integration->get_unindexed_count() === 0 ) {
			return false;
		}

		/*
		 * Show the notification when it is not in the hide notification period.
		 * (E.g. when the user clicked on 'hide this notification for a week').
		 */
		$hide_until = $this->options_helper->get( 'indexation_warning_hide_until', false );

		if ( $hide_until === false ) {
			return true;
		}

		return ( $this->date_helper->current_time() > ( (int) $hide_until ) );
	}

	/**
	 * Returns an instance of the notification.
	 *
	 * @return Yoast_Notification The notification to show.
	 */
	protected function notification() {
		$reason = $this->options_helper->get( 'indexing_reason', '' );

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
			$presenter = new Indexing_Failed_Notification_Presenter( $this->product_helper );
		}
		else {
			$total_unindexed = $this->indexing_integration->get_unindexed_count();
			$presenter       = new Indexing_Notification_Presenter( $this->short_link_helper, $total_unindexed, $reason );
		}

		return $presenter;
	}
}

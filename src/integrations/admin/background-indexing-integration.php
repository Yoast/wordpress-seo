<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Indexing_Complete_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Conditionals\Get_Request_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Background_Indexing_Integration.
 *
 * @package Yoast\WP\SEO\Integrations\Admin
 */
class Background_Indexing_Integration implements Integration_Interface {

	/**
	 * The post indexing action.
	 *
	 * @var Indexable_Post_Indexation_Action
	 */
	protected $post_indexation;

	/**
	 * The term indexing action.
	 *
	 * @var Indexable_Term_Indexation_Action
	 */
	protected $term_indexation;

	/**
	 * The post type archive indexing action.
	 *
	 * @var Indexable_Post_Type_Archive_Indexation_Action
	 */
	protected $post_type_archive_indexation;

	/**
	 * Represents the general indexing.
	 *
	 * @var Indexable_General_Indexation_Action
	 */
	protected $general_indexation;

	/**
	 * Represents the indexing completed action.
	 *
	 * @var Indexable_Indexing_Complete_Action
	 */
	protected $complete_indexation_action;

	/**
	 * The post link indexing action.
	 *
	 * @var Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * The term link indexing action.
	 *
	 * @var Term_Link_Indexing_Action
	 */
	protected $term_link_indexing_action;

	/**
	 * Represents the indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * An object that checks if we are on the Yoast admin or on the dashboard page.
	 *
	 * @var Yoast_Admin_And_Dashboard_Conditional
	 */
	protected $yoast_admin_and_dashboard_conditional;

	/**
	 * An object that checks if we are handling a GET request.
	 *
	 * @var Get_Request_Conditional
	 */
	private $get_request_conditional;

	/**
	 * Returns the conditionals based on which this integration should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [
			Migrations_Conditional::class,
		];
	}

	/**
	 * Shutdown_Indexing_Integration constructor.
	 *
	 * @param Indexable_Post_Indexation_Action              $post_indexation                       The post indexing action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation                       The term indexing action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation          The post type archive indexing action.
	 * @param Indexable_General_Indexation_Action           $general_indexation                    The general indexing action.
	 * @param Indexable_Indexing_Complete_Action            $complete_indexation_action            The complete indexing action.
	 * @param Post_Link_Indexing_Action                     $post_link_indexing_action             The post indexing action.
	 * @param Term_Link_Indexing_Action                     $term_link_indexing_action             The term indexing action.
	 * @param Indexing_Helper                               $indexing_helper                       The indexing helper.
	 * @param Yoast_Admin_And_Dashboard_Conditional         $yoast_admin_and_dashboard_conditional An object that checks if we are on the Yoast admin or on the dashboard page.
	 * @param Get_Request_Conditional                       $get_request_conditional               An object that checks if we are handling a GET request.
	 */
	public function __construct(
		Indexable_Post_Indexation_Action $post_indexation,
		Indexable_Term_Indexation_Action $term_indexation,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation,
		Indexable_General_Indexation_Action $general_indexation,
		Indexable_Indexing_Complete_Action $complete_indexation_action,
		Post_Link_Indexing_Action $post_link_indexing_action,
		Term_Link_Indexing_Action $term_link_indexing_action,
		Indexing_Helper $indexing_helper,
		Yoast_Admin_And_Dashboard_Conditional $yoast_admin_and_dashboard_conditional,
		Get_Request_Conditional $get_request_conditional
	) {
		$this->post_indexation                       = $post_indexation;
		$this->term_indexation                       = $term_indexation;
		$this->post_type_archive_indexation          = $post_type_archive_indexation;
		$this->general_indexation                    = $general_indexation;
		$this->complete_indexation_action            = $complete_indexation_action;
		$this->post_link_indexing_action             = $post_link_indexing_action;
		$this->term_link_indexing_action             = $term_link_indexing_action;
		$this->indexing_helper                       = $indexing_helper;
		$this->yoast_admin_and_dashboard_conditional = $yoast_admin_and_dashboard_conditional;
		$this->get_request_conditional               = $get_request_conditional;
	}

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'register_shutdown_indexing' ] );
		\add_action( 'Yoast\WP\SEO\index', [ $this, 'index' ] );
		// phpcs:ignore WordPress.WP.CronInterval -- We use small intervals, so we can use small batches and reduce peak load.
		\add_filter( 'cron_schedules', [ $this, 'add_cron_schedule' ] );
		\add_action( 'init', [ $this, 'schedule_cron_indexing' ], 11 );
		\add_filter( 'wpseo_post_indexation_limit', [ $this, 'throttle_cron_indexing' ] );
	}

	/**
	 * Enqueues the required scripts.
	 *
	 * @return void
	 */
	public function register_shutdown_indexing() {
		if ( $this->should_index_on_shutdown( $this->get_shutdown_limit() ) ) {
			\register_shutdown_function( [ $this, 'index' ] );
		}
	}

	/**
	 * Run a single indexing pass of each indexing action. Intended for use as a shutdown function.
	 *
	 * @return void
	 */
	public function index() {
		if ( wp_doing_cron() && ! $this->should_index_on_cron() ) {
			$this->unschedule_cron_indexing();

			return;
		}

		$this->post_indexation->index();
		$this->term_indexation->index();
		$this->general_indexation->index();
		$this->post_type_archive_indexation->index();
		$this->post_link_indexing_action->index();
		$this->term_link_indexing_action->index();

		if ( $this->indexing_helper->is_index_up_to_date() ) {
			$this->complete_indexation_action->complete();
		}
	}

	/**
	 * Adds the 'Every five minutes' cron schedule to WP-Cron.
	 *
	 * @param array $schedules The existing schedules.
	 *
	 * @return array The schedules containing the fire_minutes schedule.
	 */
	public function add_cron_schedule( $schedules ) {
		if ( ! is_array( $schedules ) ) {
			return $schedules;
		}

		$schedules['five_minutes'] = [
			'interval' => ( 5 * MINUTE_IN_SECONDS ),
			'display'  => esc_html__( 'Every five minutes', 'wordpress-seo' ),
		];

		return $schedules;
	}

	/**
	 * Schedule background indexing every 5 minutes if the index isn't already up to date.
	 *
	 * @return void
	 */
	public function schedule_cron_indexing() {
		if ( ! wp_next_scheduled( 'Yoast\WP\SEO\index' ) && $this->should_index_on_cron() ) {
			wp_schedule_event( time(), 'five_minutes', 'Yoast\WP\SEO\index' );
		}
	}

	/**
	 * Limit cron indexing to 5 indexables per batch instead of 25.
	 *
	 * @param int $indexation_limit The current limit (filter input).
	 *
	 * @return int The new batch limit.
	 */
	public function throttle_cron_indexing( $indexation_limit ) {
		if ( wp_doing_cron() ) {
			return 5;
		}

		return $indexation_limit;
	}

	/**
	 * Determine whether cron indexation should be performed.
	 *
	 * @return bool Should cron indexation be performed.
	 */
	protected function should_index_on_cron() {
		$enabled = apply_filters( 'Yoast\WP\SEO\enable_cron_indexing', true ) === true;

		return $enabled && ! $this->indexing_helper->is_index_up_to_date();
	}

	/**
	 * Determine whether background indexation should be performed.
	 *
	 * @param int $shutdown_limit The shutdown limit used to determine whether indexation should be run.
	 *
	 * @return bool Should background indexation be performed.
	 */
	protected function should_index_on_shutdown( $shutdown_limit ) {
		if ( ! $this->yoast_admin_and_dashboard_conditional->is_met() || ! $this->get_request_conditional->is_met() ) {
			return false;
		}

		$total = $this->indexing_helper->get_limited_filtered_unindexed_count( $shutdown_limit );

		return ( $total > 0 && $total < $shutdown_limit );
	}

	/**
	 * Retrieves the shutdown limit. This limit is the amount of indexables that is generated in the background.
	 *
	 * @return int The shutdown limit.
	 */
	protected function get_shutdown_limit() {
		/**
		 * Filter 'wpseo_shutdown_indexation_limit' - Allow filtering the number of objects that can be indexed during shutdown.
		 *
		 * @api int The maximum number of objects indexed.
		 */
		return \apply_filters( 'wpseo_shutdown_indexation_limit', 25 );
	}

	/**
	 * Removes the cron indexing job from the scheduled event queue.
	 *
	 * @return void
	 */
	protected function unschedule_cron_indexing() {
		$scheduled = wp_next_scheduled( 'Yoast\WP\SEO\index' );
		if ( $scheduled ) {
			wp_unschedule_event( $scheduled, 'Yoast\WP\SEO\index' );
		}
	}
}

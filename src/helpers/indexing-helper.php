<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Actions\Indexing\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast_Notification_Center;

/**
 * A helper object for indexing.
 */
class Indexing_Helper {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * The date helper.
	 *
	 * @var Date_Helper
	 */
	protected $date_helper;

	/**
	 * The notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

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
	 * Represents the general indexing.
	 *
	 * @var Indexable_General_Indexation_Action
	 */
	protected $general_indexation;

	/**
	 * Indexing_Helper constructor.
	 *
	 * @param Options_Helper            $options_helper      The options helper.
	 * @param Date_Helper               $date_helper         The date helper.
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Date_Helper $date_helper,
		Yoast_Notification_Center $notification_center
	) {
		$this->options_helper      = $options_helper;
		$this->date_helper         = $date_helper;
		$this->notification_center = $notification_center;
	}

	/**
	 * Sets the actions.
	 *
	 * @required
	 *
	 * @param Indexable_Post_Indexation_Action              $post_indexation              The post indexing action.
	 * @param Indexable_Term_Indexation_Action              $term_indexation              The term indexing action.
	 * @param Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation The posttype indexing action.
	 * @param Indexable_General_Indexation_Action           $general_indexation           The general indexing (homepage etc) action.
	 * @param Post_Link_Indexing_Action                     $post_link_indexing_action    The post crosslink indexing action.
	 * @param Term_Link_Indexing_Action                     $term_link_indexing_action    The term crossling indexing action.
	 */
	public function set_indexing_actions(
		Indexable_Post_Indexation_Action $post_indexation,
		Indexable_Term_Indexation_Action $term_indexation,
		Indexable_Post_Type_Archive_Indexation_Action $post_type_archive_indexation,
		Indexable_General_Indexation_Action $general_indexation,
		Post_Link_Indexing_Action $post_link_indexing_action,
		Term_Link_Indexing_Action $term_link_indexing_action
	) {
		$this->post_indexation              = $post_indexation;
		$this->term_indexation              = $term_indexation;
		$this->post_type_archive_indexation = $post_type_archive_indexation;
		$this->general_indexation           = $general_indexation;
		$this->post_link_indexing_action    = $post_link_indexing_action;
		$this->term_link_indexing_action    = $term_link_indexing_action;
	}

	/**
	 * Sets several database options when the indexing process is started.
	 *
	 * @return void
	 */
	public function start() {
		$this->set_first_time( false );
		$this->set_started( $this->date_helper->current_time() );
	}

	/**
	 * Sets several database options when the indexing process is finished.
	 *
	 * @return void
	 */
	public function finish() {
		$this->set_reason( '' );
		$this->set_started( null );
	}

	/**
	 * Sets appropriate flags when the indexing process fails.
	 *
	 * @return void
	 */
	public function indexing_failed() {
		$this->set_reason( Indexing_Reasons::REASON_INDEXING_FAILED );
		$this->set_started( null );
	}

	/**
	 * Sets the indexing reason.
	 *
	 * @param string $reason The indexing reason.
	 *
	 * @return void
	 */
	public function set_reason( $reason ) {
		$this->options_helper->set( 'indexing_reason', $reason );

		/*
		 * Remove any pre-existing notification, so that a new notification
		 * (with a possible new reason) can be added.
		 */
		$this->notification_center->remove_notification_by_id(
			Indexing_Notification_Integration::NOTIFICATION_ID
		);
	}

	/**
	 * Determines whether an indexing reason has been set in the options.
	 *
	 * @return bool Whether an indexing reason has been set in the options.
	 */
	public function has_reason() {
		$reason = $this->get_reason();

		return ! empty( $reason );
	}

	/**
	 * Returns the indexing reason. The reason why the site-wide indexing process should be run.
	 *
	 * @return string The indexing reason, defaults to the empty string if no reason has been set.
	 */
	public function get_reason() {
		return $this->options_helper->get( 'indexing_reason', '' );
	}

	/**
	 * Sets the start time when the indexing process has started but not completed.
	 *
	 * @param int|bool $timestamp The start time when the indexing process has started but not completed, false otherwise.
	 *
	 * @return void
	 */
	public function set_started( $timestamp ) {
		$this->options_helper->set( 'indexing_started', $timestamp );
	}

	/**
	 * Gets the start time when the indexing process has started but not completed.
	 *
	 * @return int|bool $start_time The start time when the indexing process has started but not completed, false otherwise.
	 */
	public function get_started() {
		return $this->options_helper->get( 'indexing_started' );
	}

	/**
	 * Sets a boolean that indicates whether or not a site still has to be indexed for the first time.
	 *
	 * @param bool $is_first_time_indexing Whether or not a site still has to be indexed for the first time.
	 *
	 * @return void
	 */
	public function set_first_time( $is_first_time_indexing ) {
		$this->options_helper->set( 'indexing_first_time', $is_first_time_indexing );
	}

	/**
	 * Gets a boolean that indicates whether or not the site still has to be indexed for the first time.
	 *
	 * @return bool Whether the site still has to be indexed for the first time.
	 */
	public function is_initial_indexing() {
		return $this->options_helper->get( 'indexing_first_time', true );
	}

	/**
	 * Returns the total number of unindexed objects.
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_unindexed_count() {
		$unindexed_count  = $this->post_indexation->get_total_unindexed();
		$unindexed_count += $this->term_indexation->get_total_unindexed();
		$unindexed_count += $this->general_indexation->get_total_unindexed();
		$unindexed_count += $this->post_type_archive_indexation->get_total_unindexed();
		$unindexed_count += $this->post_link_indexing_action->get_total_unindexed();
		$unindexed_count += $this->term_link_indexing_action->get_total_unindexed();

		return $unindexed_count;
	}

	/**
	 * Returns the total number of unindexed objects and applies a filter for third party integrations.
	 *
	 * @return int The total number of unindexed objects.
	 */
	public function get_filtered_unindexed_count() {
		/**
		 * Filter: 'wpseo_indexing_get_unindexed_count' - Allow changing the amount of unindexed objects.
		 *
		 * @param int $unindexed_count The amount of unindexed objects.
		 */
		return \apply_filters( 'wpseo_indexing_get_unindexed_count', $this->get_unindexed_count() );
	}
}

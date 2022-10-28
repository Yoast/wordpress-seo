<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast_Notification;
use Yoast_Notification_Center;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Not_Admin_Ajax_Conditional;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Post type change watcher.
 */
class Indexable_Post_Type_Change_Watcher implements Integration_Interface {

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Holds the Post_Type_Helper instance.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * The notifications center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Not_Admin_Ajax_Conditional::class, Admin_Conditional::class, Migrations_Conditional::class ];
	}

	/**
	 * Indexable_Post_Type_Change_Watcher constructor.
	 *
	 * @param Options_Helper            $options             The options helper.
	 * @param Indexable_Repository      $repository          The Indexables repository.
	 * @param Indexing_Helper           $indexing_helper     The indexing helper.
	 * @param Post_Type_Helper          $post_type_helper    The post_typehelper.
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 */
	public function __construct(
		Options_Helper $options,
		Indexable_Repository $repository,
		Indexing_Helper $indexing_helper,
		Post_Type_Helper $post_type_helper,
		Yoast_Notification_Center $notification_center
	) {
		$this->options             = $options;
		$this->repository          = $repository;
		$this->indexing_helper     = $indexing_helper;
		$this->post_type_helper    = $post_type_helper;
		$this->notification_center = $notification_center;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'check_post_types_public_availability' ] );
	}

	/**
	 * Checks if one or more post types change visibility
	 *
	 * @return void
	 */
	public function check_post_types_public_availability() {

		// We have to make sure this is just a plain http request, no ajax/REST.
		if ( \wp_is_json_request() ) {
			return;
		}

		$public_post_types            = \array_keys( $this->post_type_helper->get_public_post_types() );
		$last_known_public_post_types = $this->options->get( 'last_known_public_post_types', [] );

		if ( empty( $last_known_public_post_types ) ) {
			$this->options->set( 'last_known_public_post_types', $public_post_types );
			$last_known_public_post_types = $public_post_types;
			return;
		}

		$newly_made_public_post_types     = \array_diff( $public_post_types, $last_known_public_post_types );
		$newly_made_non_public_post_types = \array_diff( $last_known_public_post_types, $public_post_types );

		if ( empty( $newly_made_public_post_types ) && ( empty( $newly_made_non_public_post_types ) ) ) {
			return;
		}

		// Update the list of last known public post types in the database.
		$this->options->set( 'last_known_public_post_types', $public_post_types );

		// There are new post types that have been made public.
		if ( ! empty( $newly_made_public_post_types ) ) {
			$this->add_new_public_post_types_to_post_types_made_public( $newly_made_public_post_types );

			\delete_transient( Indexable_Post_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );
			\delete_transient( Indexable_Post_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT );

			$this->indexing_helper->set_reason( Indexing_Reasons::REASON_POST_TYPE_MADE_PUBLIC );

			$this->maybe_add_notification();
		}

		if ( ! empty( $newly_made_non_public_post_types ) ) {
			$this->purge_non_public_post_types_from_post_types_made_public( $newly_made_non_public_post_types );

			if ( ! \wp_next_scheduled( \Yoast\WP\SEO\Integrations\Cleanup_Integration::START_HOOK ) ) {
				if ( ! \wp_next_scheduled( Cleanup_Integration::START_HOOK ) ) {
					\wp_schedule_single_event( ( time() + 5 ), \Yoast\WP\SEO\Integrations\Cleanup_Integration::START_HOOK );
					\wp_schedule_single_event( ( time() + 5 ), Cleanup_Integration::START_HOOK );
				}
			}
		}
	}

	/**
	 * Adds newly public post types in post_types_made_public.
	 *
	 * @param array $newly_made_public_post_types Array of post type names which have been made public.
	 *
	 * @return bool Returns true if the option is successfully saved in the database.
	 */
	private function add_new_public_post_types_to_post_types_made_public( $newly_made_public_post_types ) {
		// Fetch the post types that have been made public the last time.
		$previously_made_public_post_types = $this->options->get( 'post_types_made_public', [] );

		// Merge the previously made public post types with the newly made public ones.
		$total_made_public_post_types = \array_merge( $previously_made_public_post_types, $newly_made_public_post_types );

		// Update the corresponding option in the database.
		return $this->options->set( 'post_types_made_public', $total_made_public_post_types );
	}

	/**
	 * Removes post types made non public from post_types_made_public.
	 *
	 * @param array $newly_made_non_public_post_types Array of post type names which have been made non public.
	 *
	 * @return bool Returns true if the option is successfully saved in the database.
	 */
	private function purge_non_public_post_types_from_post_types_made_public( $newly_made_non_public_post_types ) {
		$previously_made_public_post_types  = $this->options->get( 'post_types_made_public', [] );
		$remove_from_post_types_made_public = \array_intersect( $newly_made_non_public_post_types, $previously_made_public_post_types );

		$updated_post_types_made_public = \array_filter(
			$previously_made_public_post_types,
			function( $post_type ) use ( $remove_from_post_types_made_public ) {
				return ! in_array( $post_type, $remove_from_post_types_made_public, true );
			}
		);

		return $this->options->set( 'post_types_made_public', $updated_post_types_made_public );
	}

	/**
	 * Decides if a notification should be added in the notification center.
	 *
	 * @return void
	 */
	private function maybe_add_notification() {
		$notification = $this->notification_center->get_notification_by_id( 'post-types-made-public' );
		if ( is_null( $notification ) ) {
			$this->add_notification();
		}
	}

	/**
	 * Adds a notification to be shown on the next page request since posts are updated in an ajax request.
	 *
	 * @return void
	 */
	private function add_notification() {
		$message = sprintf(
			/* translators: 1: Opening tag of the link to the Search appearance settings page, 2: Link closing tag. */
			\esc_html__( 'It looks like you\'ve added a new type of content to your website. We recommend that you review your %1$sSearch appearance settings%2$s.', 'wordpress-seo' ),
			'<a href="' . \esc_url( \admin_url( 'admin.php?page=wpseo_titles#top#post-types' ) ) . '">',
			'</a>'
		);

		$notification = new Yoast_Notification(
			$message,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'post-types-made-public',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);

		$this->notification_center->add_notification( $notification );
	}
}

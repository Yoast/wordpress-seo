<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast_Notification;
use Yoast_Notification_Center;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Not_Admin_Ajax_Conditional;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Taxonomy watcher.
 *
 * Responds to changes in taxonomies public availability.
 */
class Indexable_Taxonomy_Change_Watcher implements Integration_Interface {

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
	 * Holds the Taxonomy_Helper instance.
	 *
	 * @var Taxonomy_Helper
	 */
	private $taxonomy_helper;

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
	 * Indexable_Taxonomy_Change_Watcher constructor.
	 *
	 * @param Indexing_Helper           $indexing_helper     The indexing helper.
	 * @param Options_Helper            $options             The options helper.
	 * @param Taxonomy_Helper           $taxonomy_helper     The taxonomy helper.
	 * @param Indexable_Repository      $repository          The Indexables repository.
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 */
	public function __construct(
		Indexing_Helper $indexing_helper,
		Options_Helper $options,
		Taxonomy_Helper $taxonomy_helper,
		Indexable_Repository $repository,
		Yoast_Notification_Center $notification_center
	) {
		$this->indexing_helper     = $indexing_helper;
		$this->options             = $options;
		$this->taxonomy_helper     = $taxonomy_helper;
		$this->repository          = $repository;
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
		\add_action( 'admin_init', [ $this, 'check_taxonomy_public_availability' ] );
	}

	/**
	 * Checks if one or more taxonomies change visibility.
	 *
	 * @return void
	 */
	public function check_taxonomy_public_availability() {

		// We have to make sure this is just a plain http request, no ajax/REST.
		if ( \wp_is_json_request() ) {
			return;
		}

		$public_taxonomies            = \array_keys( $this->taxonomy_helper->get_public_taxonomies() );
		$last_known_public_taxonomies = $this->options->get( 'last_known_public_taxonomies', [] );

		if ( empty( $last_known_public_taxonomies ) ) {
			$this->options->set( 'last_known_public_taxonomies', $public_taxonomies );
			$last_known_public_taxonomies = $public_taxonomies;
			return;
		}

		$newly_made_public_taxonomies     = \array_diff( $public_taxonomies, $last_known_public_taxonomies );
		$newly_made_non_public_taxonomies = \array_diff( $last_known_public_taxonomies, $public_taxonomies );

		if ( empty( $newly_made_public_taxonomies ) && ( empty( $newly_made_non_public_taxonomies ) ) ) {
			return;
		}

		// Update the list of last known public taxonomies in the database.
		$this->options->set( 'last_known_public_taxonomies', $public_taxonomies );

		if ( ! empty( $newly_made_public_taxonomies ) ) {
			$this->add_new_public_taxonomies_to_taxonomies_made_public( $newly_made_public_taxonomies );

			\delete_transient( Indexable_Term_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );
			\delete_transient( Indexable_Term_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT );

			$this->indexing_helper->set_reason( Indexing_Reasons::REASON_TAXONOMY_MADE_PUBLIC );

			$this->maybe_add_notification();
		}

		if ( ! empty( $newly_made_non_public_taxonomies ) ) {
			$this->purge_non_public_taxonomies_from_taxonomies_made_public( $newly_made_non_public_taxonomies );

			if ( ! \wp_next_scheduled( \Yoast\WP\SEO\Integrations\Cleanup_Integration::START_HOOK ) ) {
				if ( ! \wp_next_scheduled( Cleanup_Integration::START_HOOK ) ) {
					\wp_schedule_single_event( ( time() + ( MINUTE_IN_SECONDS * 5 ) ), \Yoast\WP\SEO\Integrations\Cleanup_Integration::START_HOOK );
					\wp_schedule_single_event( ( time() + ( MINUTE_IN_SECONDS * 5 ) ), Cleanup_Integration::START_HOOK );
				}
			}
		}
	}

	/**
	 * Adds newly public taxonomies in taxonomies_made_public.
	 *
	 * @param array $newly_made_public_taxonomies Array of taxonomies names which have been made public.
	 *
	 * @return bool Returns true if the option is successfully saved in the database.
	 */
	private function add_new_public_taxonomies_to_taxonomies_made_public( $newly_made_public_taxonomies ) {
		// Fetch the taxonomies that have been made public the last time.
		$previously_made_public_taxonomies = $this->options->get( 'taxonomies_made_public', [] );

		// Merge the previously made public taxonomies with the newly made public ones.
		$total_made_public_taxonomies = \array_merge( $previously_made_public_taxonomies, $newly_made_public_taxonomies );

		// Update the corresponding option in the database.
		return $this->options->set( 'taxonomies_made_public', $total_made_public_taxonomies );
	}

	/**
	 * Removes taxonomies made non public from taxonomies_made_public.
	 *
	 * @param array $newly_made_non_public_taxonomies Array of tzxonomies names which have been made non public.
	 *
	 * @return bool Returns true if the option is successfully saved in the database.
	 */
	private function purge_non_public_taxonomies_from_taxonomies_made_public( $newly_made_non_public_taxonomies ) {
		$previously_made_public_taxonomies  = $this->options->get( 'taxonomies_made_public', [] );
		$remove_from_taxonomies_made_public = \array_intersect( $newly_made_non_public_taxonomies, $previously_made_public_taxonomies );

		$updated_taxonomies_made_public = \array_filter(
			$previously_made_public_taxonomies,
			function( $taxonomy ) use ( $remove_from_taxonomies_made_public ) {
				return ! in_array( $taxonomy, $remove_from_taxonomies_made_public, true );
			}
		);

		return $this->options->set( 'taxonomies_made_public', $updated_taxonomies_made_public );
	}

	/**
	 * Decides if a notification should be added in the notification center.
	 *
	 * @return void
	 */
	private function maybe_add_notification() {
		$notification = $this->notification_center->get_notification_by_id( 'taxonomies-made-public' );
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
			\esc_html__( 'It looks like you\'ve added a new taxonomy to your website. We recommend that you review your %1$sSearch appearance settings%2$s.', 'wordpress-seo' ),
			'<a href="' . \esc_url( \admin_url( 'admin.php?page=wpseo_titles#top#taxonomies' ) ) . '">',
			'</a>'
		);

		$notification = new Yoast_Notification(
			$message,
			[
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'taxonomies-made-public',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);

		$this->notification_center->add_notification( $notification );
	}
}

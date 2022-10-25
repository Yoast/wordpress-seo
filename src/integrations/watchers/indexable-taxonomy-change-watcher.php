<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Not_Admin_Ajax_Conditional;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

use Yoast_Notification;
use Yoast_Notification_Center;
/**
 * WordPress Post watcher.
 *
 * Fills the Indexable according to Post data.
 */
class Indexable_Taxonomy_Change_Watcher implements Integration_Interface {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

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
	 * @param Options_Helper            $options             The options helper.
	 * @param Indexable_Repository      $repository          The Indexables repository.
	 * @param Indexing_Helper           $indexing_helper     The indexing helper.
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 */
	public function __construct(
		Options_Helper $options,
		Indexable_Repository $repository,
		Indexing_Helper $indexing_helper,
		Yoast_Notification_Center $notification_center
	) {
		$this->options             = $options;
		$this->repository          = $repository;
		$this->indexing_helper     = $indexing_helper;
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
		\add_action( 'admin_init', [ $this, 'check_taxonomy_viewability' ] );
	}

	/**
	 * Checks if one or more taxonomies change visibility
	 *
	 * @return void
	 */
	public function check_taxonomy_viewability() {

		// We have to make sure this is just a plain http request, no ajax/REST.
		if ( \wp_is_json_request() ) {
			return;
		}

		if ( ! function_exists( '\is_taxonomy_viewable' ) ) {
			return;
		}

		$taxonomies                     = \get_taxonomies();
		$viewable_taxonomies            = \array_keys( \array_filter( $taxonomies, '\is_taxonomy_viewable' ) );
		$last_known_viewable_taxonomies = $this->options->get( 'last_known_viewable_taxonomies', [] );

		if ( empty( $last_known_viewable_taxonomies ) ) {
			$this->options->get( 'last_known_viewable_taxonomies', $viewable_taxonomies );
		}

		$newly_made_viewable_taxonomies     = \array_diff( $viewable_taxonomies, $last_known_viewable_taxonomies );
		$newly_made_non_viewable_taxonomies = \array_diff( $last_known_viewable_taxonomies, $viewable_taxonomies );

		if ( empty( $newly_made_viewable_taxonomies ) && ( empty( $newly_made_non_viewable_taxonomies ) ) ) {
			return;
		}

		// Update the list of last known viewable taxonomies in the database.
		$this->options->set( 'last_known_viewable_taxonomies', $viewable_taxonomies );

		if ( ! empty( $newly_made_viewable_taxonomies ) ) {
			$this->add_new_viewables_to_taxonomies_made_viewable( $newly_made_viewable_taxonomies );

			$this->indexing_helper->set_reason( Indexing_Reasons::REASON_TAXONOMY_MADE_VIEWABLE );

			$this->maybe_add_notification();
		}

		if ( ! empty( $newly_made_non_viewable_taxonomies ) ) {
			$this->purge_non_viewables_from_taxonomies_made_viewable( $newly_made_non_viewable_taxonomies );

			// Delete indexables with the corresponding sub type.
			foreach ( $newly_made_non_viewable_taxonomies as $non_viewable_taxonomy ) {
				$this->delete_indexables_by_term( $non_viewable_taxonomy );
			}
		}
	}

	/**
	 * Adds newly viewable taxonomies in taxonomies_made_viewable.
	 *
	 * @param array $newly_made_viewable_taxonomies Array of post type names which have been made viewable.
	 *
	 * @return bool Returns true if the option is successfully saved in the database.
	 */
	private function add_new_viewables_to_taxonomies_made_viewable( $newly_made_viewable_taxonomies ) {
		// Fetch the post types that have been made viewable the last time.
		$previously_made_viewable_taxonomies = $this->options->get( 'taxonomies_made_viewable', [] );

		// Merge the previously made viewable post types with the newly made viewable ones.
		$total_made_viewable_taxonomies = \array_merge( $previously_made_viewable_taxonomies, $newly_made_viewable_taxonomies );

		// Update the corresponding option in the database.
		return $this->options->set( 'taxonomies_made_viewable', $total_made_viewable_taxonomies );
	}

	/**
	 * Removes taxonomies made non viewable from taxonomies_made_viewable.
	 *
	 * @param array $newly_made_non_viewable_taxonomies Array of tzxonomies names which have been made non viewable.
	 *
	 * @return bool Returns true if the option is successfully saved in the database.
	 */
	private function purge_non_viewables_from_taxonomies_made_viewable( $newly_made_non_viewable_taxonomies ) {
		$previously_made_viewable_taxonomies  = $this->options->get( 'post_types_made_viewable', [] );
		$remove_from_taxonomies_made_viewable = \array_intersect( $newly_made_non_viewable_taxonomies, $previously_made_viewable_taxonomies );

		$updated_taxonomies_made_viewable = \array_filter(
			$previously_made_viewable_taxonomies,
			function( $taxonomy ) use ( $remove_from_taxonomies_made_viewable ) {
				return ! in_array( $taxonomy, $remove_from_taxonomies_made_viewable, true );
			}
		);

		return $this->options->set( 'taxonomies_made_viewable', $updated_taxonomies_made_viewable );
	}

	/**
	 * Deletes the indexable with sub-type equal to a given taxonomy.
	 *
	 * @param string $taxonomy Taxonomy name representing the sub-type of indexables to be deleted.
	 *
	 * @return bool|int Response of wpdb::query
	 */
	private function delete_indexables_by_term( $taxonomy ) {
		return $this->repository->query()
			->where( 'object_type', 'term' )
			->where( 'object_sub_type', $taxonomy )
			->delete_many();
	}

	/**
	 * Decides if a notification should be added in the notification center.
	 *
	 * @return void
	 */
	private function maybe_add_notification() {
		$notification = $this->notification_center->get_notification_by_id( 'taxonomies-made-viewable' );
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
				'id'           => 'taxonomies-made-viewable',
				'capabilities' => 'wpseo_manage_options',
				'priority'     => 0.8,
			]
		);

		$this->notification_center->add_notification( $notification );
	}
}

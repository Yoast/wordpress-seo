<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use wpdb;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Permalink_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Ancestor watcher to update the ancestor's children.
 *
 * Updates its children's permalink when the ancestor itself is updated.
 */
class Indexable_Ancestor_Watcher implements Integration_Interface {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Represents the indexable hierarchy builder.
	 *
	 * @var Indexable_Hierarchy_Builder
	 */
	protected $indexable_hierarchy_builder;

	/**
	 * Represents the indexable hierarchy repository.
	 *
	 * @var Indexable_Hierarchy_Repository
	 */
	protected $indexable_hierarchy_repository;

	/**
	 * Represents the WordPress database object.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * Represents the permalink helper.
	 *
	 * @var Permalink_Helper
	 */
	protected $permalink_helper;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Sets the needed dependencies.
	 *
	 * @param Indexable_Repository           $indexable_repository           The indexable repository.
	 * @param Indexable_Hierarchy_Builder    $indexable_hierarchy_builder    The indexable hierarchy builder.
	 * @param Indexable_Hierarchy_Repository $indexable_hierarchy_repository The indexable hierarchy repository.
	 * @param wpdb                           $wpdb                           The wpdb object.
	 * @param Permalink_Helper               $permalink_helper               The permalink helper.
	 * @param Post_Type_Helper               $post_type_helper               The post type helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Indexable_Hierarchy_Builder $indexable_hierarchy_builder,
		Indexable_Hierarchy_Repository $indexable_hierarchy_repository,
		wpdb $wpdb,
		Permalink_Helper $permalink_helper,
		Post_Type_Helper $post_type_helper
	) {
		$this->indexable_repository           = $indexable_repository;
		$this->indexable_hierarchy_builder    = $indexable_hierarchy_builder;
		$this->wpdb                           = $wpdb;
		$this->indexable_hierarchy_repository = $indexable_hierarchy_repository;
		$this->permalink_helper               = $permalink_helper;
		$this->post_type_helper               = $post_type_helper;
	}

	/**
	 * Registers the appropriate hooks.
	 */
	public function register_hooks() {
		\add_action( 'wpseo_save_indexable', [ $this, 'reset_children' ], \PHP_INT_MAX, 2 );
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * If an indexable's permalink has changed, updates its children in the hierarchy table and resets the children's permalink.
	 *
	 * @param Indexable $indexable        The indexable.
	 * @param Indexable $indexable_before The old indexable.
	 *
	 * @return bool True if the children were reset.
	 */
	public function reset_children( $indexable, $indexable_before ) {
		if ( ! \in_array( $indexable->object_type, [ 'post', 'term' ], true ) ) {
			return false;
		}

		// If the permalink was null it means it was reset instead of changed.
		if ( $indexable->permalink === $indexable_before->permalink || \is_null( $indexable_before->permalink ) ) {
			return false;
		}

		$child_indexable_ids = $this->indexable_hierarchy_repository->find_children( $indexable );
		$child_indexables    = $this->indexable_repository->find_by_ids( $child_indexable_ids );

		\array_walk( $child_indexables, [ $this, 'update_hierarchy_and_permalink' ] );

		if ( $indexable->object_type === 'term' ) {
			$child_indexables_for_term = $this->get_children_for_term( $indexable->object_id, $child_indexables );

			\array_walk( $child_indexables_for_term, [ $this, 'update_hierarchy_and_permalink' ] );
		}

		return true;
	}

	/**
	 * Finds all child indexables for the given term.
	 *
	 * @param int         $term_id          Term to fetch the indexable for.
	 * @param Indexable[] $child_indexables The already known child indexables.
	 *
	 * @return array The list of additional child indexables for a given term.
	 */
	public function get_children_for_term( $term_id, array $child_indexables ) {
		// Finds object_ids (posts) for the term.
		$post_object_ids = $this->get_object_ids_for_term( $term_id, $child_indexables );

		// Removes the objects that are already present in the children.
		$existing_post_indexables = \array_filter(
			$child_indexables,
			static function( $indexable ) {
				return $indexable->object_type === 'post';
			}
		);

		$existing_post_object_ids = \wp_list_pluck( $existing_post_indexables, 'object_id' );
		$post_object_ids          = \array_diff( $post_object_ids, $existing_post_object_ids );

		// Finds the indexables for the fetched post_object_ids.
		$post_indexables = $this->indexable_repository->find_by_multiple_ids_and_type( $post_object_ids, 'post', false );

		// Finds the indexables for the posts that are attached to the term.
		$post_indexable_ids       = \wp_list_pluck( $post_indexables, 'id' );
		$additional_indexable_ids = $this->indexable_hierarchy_repository->find_children_by_ancestor_ids( $post_indexable_ids );

		// Makes sure we only have indexable id's that we haven't fetched before.
		$additional_indexable_ids = \array_diff( $additional_indexable_ids, $post_indexable_ids );

		// Finds the additional indexables.
		$additional_indexables = $this->indexable_repository->find_by_ids( $additional_indexable_ids );

		// Merges all fetched indexables.
		return \array_merge( $post_indexables, $additional_indexables );
	}

	/**
	 * Builds the hierarchy for a post.
	 *
	 * @deprecated 16.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int $object_id The post id.
	 * @param int $post_type The post type.
	 */
	public function build_post_hierarchy( $object_id, $post_type ) {
		\_deprecated_function( __METHOD__, '16.4', 'Primary_Category_Quick_Edit_Watcher::build_post_hierarchy' );
	}

	/**
	 * Updates the indexable hierarchy and indexable permalink.
	 *
	 * @param Indexable $indexable The indexable to update the hierarchy and permalink for.
	 */
	protected function update_hierarchy_and_permalink( $indexable ) {
		$this->indexable_hierarchy_builder->build( $indexable );

		$indexable->permalink = $this->permalink_helper->get_permalink_for_indexable( $indexable );
		$indexable->save();
	}

	/**
	 * Retrieves the object id's for a term based on the term-post relationship.
	 *
	 * @param int         $term_id          The term to get the object id's for.
	 * @param Indexable[] $child_indexables The child indexables.
	 *
	 * @return array List with object ids for the term.
	 */
	protected function get_object_ids_for_term( $term_id, $child_indexables ) {
		$filter_terms = static function( $child ) {
			return $child->object_type === 'term';
		};

		$child_terms      = \array_filter( $child_indexables, $filter_terms );
		$child_object_ids = \wp_list_pluck( $child_terms, 'object_id' );

		// Get the term-taxonomy id's for the term and its children.
		$term_taxonomy_ids = $this->wpdb->get_col(
			$this->wpdb->prepare(
				'SELECT term_taxonomy_id
				FROM ' . $this->wpdb->term_taxonomy . '
				WHERE term_id IN( ' . \implode( ', ', \array_fill( 0, ( \count( $child_object_ids ) + 1 ), '%s' ) ) . ' )',
				$term_id,
				...$child_object_ids
			)
		);

		// In the case of faulty data having been saved the above query can return 0 results.
		if ( empty( $term_taxonomy_ids ) ) {
			return [];
		}

		// Get the (post) object id's that are attached to the term.
		return $this->wpdb->get_col(
			$this->wpdb->prepare(
				'SELECT DISTINCT object_id
				FROM ' . $this->wpdb->term_relationships . '
				WHERE term_taxonomy_id IN( ' . \implode( ', ', \array_fill( 0, \count( $term_taxonomy_ids ), '%s' ) ) . ' )',
				...$term_taxonomy_ids
			)
		);
	}
}

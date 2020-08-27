<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use wpdb;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
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
	 * Represents the indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Represents the WordPress database object.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * Sets the needed dependencies.
	 *
	 * @param Indexable_Repository           $indexable_repository           The indexable repository.
	 * @param Indexable_Hierarchy_Builder    $indexable_hierarchy_builder    The indexable hierarchy builder.
	 * @param Indexable_Hierarchy_Repository $indexable_hierarchy_repository The indexable hierarchy repository.
	 * @param Indexable_Helper               $indexable_helper               The indexable helper.
	 * @param wpdb                           $wpdb                           The wpdb object.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Indexable_Hierarchy_Builder $indexable_hierarchy_builder,
		Indexable_Hierarchy_Repository $indexable_hierarchy_repository,
		Indexable_Helper $indexable_helper,
		wpdb $wpdb
	) {
		$this->indexable_repository           = $indexable_repository;
		$this->indexable_hierarchy_builder    = $indexable_hierarchy_builder;
		$this->indexable_helper               = $indexable_helper;
		$this->wpdb                           = $wpdb;
		$this->indexable_hierarchy_repository = $indexable_hierarchy_repository;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'wpseo_save_indexable', [ $this, 'reset_children' ], \PHP_INT_MAX, 2 );
	}

	/**
	 * @inheritDoc
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

		if ( $indexable->permalink === $indexable_before->permalink ) {
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
		$object_ids = $this->get_object_ids_for_term( $term_id, $child_indexables );

		// Removes the objects that are already present in the children.
		foreach ( $child_indexables as $child_indexable ) {
			if ( $child_indexable->object_type !== 'post' ) {
				continue;
			}

			$search = \array_search( $child_indexable->object_id, $object_ids, true );
			if ( $search === false ) {
				continue;
			}

			unset( $object_ids[ $search ] );
		}

		// Finds the indexables for the fetched object_ids.
		$indexables_by_term = $this->indexable_repository->find_by_multiple_ids_and_type( $object_ids, 'post' , false );

		// Finds the indexables for the posts that attached to the term.
		$additional_indexable_ids = $this->indexable_hierarchy_repository->find_children_by_ancestor_ids( $object_ids );

		// Makes sure we only have indexable id's that we haven't fetched before.
		foreach ( $indexables_by_term as $indexable_by_term ) {
			$search = \array_search( $indexable_by_term->id, $additional_indexable_ids, true );
			if ( $search === false ) {
				continue;
			}

			unset( $additional_indexable_ids[ $search ] );
		}

		// Finds the additional indexables.
		$additional_indexables = $this->indexable_repository->find_by_ids( $additional_indexable_ids );

		// Merges all fetched indexables.
		return \array_merge( $indexables_by_term, $additional_indexables );
	}

	/**
	 * Updates the indexable hierarchy and indexable permalink.
	 *
	 * @param Indexable $indexable The indexable to update the hierarchy and permalink for.
	 */
	protected function update_hierarchy_and_permalink( $indexable ) {
		$this->indexable_hierarchy_builder->build( $indexable );

		$indexable->permalink = $this->indexable_helper->get_permalink_for_indexable( $indexable );
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
		$filter_terms = function( $child ) {
			return $child->object_type === 'term';
		};

		$child_terms = \array_filter( $child_indexables, $filter_terms );

		// Get the object id's for the child indexables.
		$get_object_id_for_child = function( $child ) {
			return $child->object_id;
		};

		$child_object_ids = \array_map( $get_object_id_for_child, $child_terms );

		// Get the term-taxonomy id's for the term and its children.
		$term_taxonomy_ids = $this->wpdb->get_col(
			$this->wpdb->prepare( '
				SELECT term_taxonomy_id
				FROM ' . $this->wpdb->term_taxonomy . '
				WHERE term_id IN( ' . \implode( ', ', \array_fill( 0, ( \count( $child_object_ids ) + 1 ), '%s' ) ) . ' )
			', $term_id, ...$child_object_ids )
		);

		// Get the (post) object id's that are attached to the term.
		return $this->wpdb->get_col(
			$this->wpdb->prepare( '
				SELECT DISTINCT object_id
				FROM ' . $this->wpdb->term_relationships . '
				WHERE term_taxonomy_id IN( ' . \implode( ', ', \array_fill( 0, \count( $term_taxonomy_ids ), '%s' ) ) . ' )
			', $term_taxonomy_ids )
		);
	}
}

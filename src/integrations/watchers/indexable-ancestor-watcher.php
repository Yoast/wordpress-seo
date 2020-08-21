<?php
/**
 * Ancestor watcher to update the ancestor's children.
 *
 * @package Yoast\YoastSEO\Watchers
 */

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
 * Watches an ancestor to save the meta information when updated.
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
	 * @param Indexable_Hierarchy_Builder    $indexable_hierarchy_builder    The hierarchy builder.
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

		\array_walk( $child_indexables, [ $this, 'refresh_permalink' ] );

		if ( $indexable->object_type === 'term' ) {
			$child_indexables_for_term = $this->get_children_for_term( $indexable->object_id, $child_indexables );

			\array_walk( $child_indexables_for_term, [ $this, 'refresh_permalink' ] );
		}

		return true;
	}

	/**
	 * Finds all child indexables for the given term.
	 *
	 * @param int         $term_id          Term to fetch the indexable for.
	 * @param Indexable[] $child_indexables The already known child indexables.
	 *
	 * @return array The list of additional indexables for a given term.
	 */
	public function get_children_for_term( $term_id, array $child_indexables ) {
		// Finds object_ids (posts) for the term.
		$object_ids = $this->get_object_ids_for_term( $term_id );

		// Removes the objects that are already present in the children.
		$object_ids = $this->filter_already_fetched_indexables( $child_indexables, $object_ids );

		// Finds the indexables for the fetched object_ids.
		$indexables_by_term = $this->indexable_repository->find_by_multiple_ids_and_type( $object_ids, 'post' , false );

		// Finds the indexables for the posts that attached to the term.
		$additional_indexable_ids = $this->indexable_hierarchy_repository->find_children_by_ancestor_ids( $object_ids );

		// Makes sure we only have indexable ids that we haven't fetched before.
		$additional_indexable_ids = $this->filter_already_fetched_indexables( $indexables_by_term, $additional_indexable_ids );

		// Finds the additional indexables.
		$additional_indexables = $this->indexable_repository->find_by_ids( $additional_indexable_ids );

		// Lets merge all fetched indexables.
		return array_merge( $indexables_by_term, $additional_indexables );
	}

	/**
	 * Refreshes the permalink for the given indexable.
	 *
	 * @param Indexable $indexable The indexable to refresh the permalink for.
	 */
	protected function refresh_permalink( $indexable ) {
		$this->indexable_hierarchy_builder->build( $indexable );

		$indexable->permalink = $this->indexable_helper->get_permalink_for_indexable( $indexable );
		$indexable->save();
	}

	/**
	 * Retrieves the object ids for a term based on the term-post relation ship.
	 *
	 * @param int $term_id The term to get the object ids for.
	 *
	 * @return array List with object ids for the term.
	 */
	protected function get_object_ids_for_term( $term_id ) {
		$term_taxonomy_ids = $this->wpdb->get_col(
			$this->wpdb->prepare( "
				SELECT term_taxonomy_id 
				FROM " . $this->wpdb->term_taxonomy . "
				WHERE term_id = %s OR parent = %s  
			", $term_id, $term_id  )
		);

		// Retrieve all object ids that is attached to the term.
		return $this->wpdb->get_col(
			$this->wpdb->prepare( "
				SELECT DISTINCT object_id 
				FROM " . $this->wpdb->term_relationships . " 
				WHERE term_taxonomy_id IN(  " . \implode( ', ', \array_fill( 0, \count( $term_taxonomy_ids ), '%s' ) ) . " ) 
			
			", $term_taxonomy_ids )
		);
	}

	/**
	 * Filters the object ids which indexables are already present in the list of indexables.
	 *
	 * @param Indexable[] $indexables List with indexables
	 * @param array       $object_ids List with object ids.
	 *
	 * @return array The filtered list with object_ids.
	 */
	protected function filter_already_fetched_indexables( array $indexables, array $object_ids ) {
		foreach ( $indexables as $indexable ) {
			if ( $indexable->object_type !== 'post' ) {
				continue;
			}

			$search = array_search( $indexable->object_id, $object_ids, true );
			if ( ! $search ) {
				continue;
			}

			unset( $object_ids[ $search ] );
		}

		return $object_ids;
	}
}

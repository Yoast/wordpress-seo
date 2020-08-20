<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\WP\SEO\Repositories
 */

namespace Yoast\WP\SEO\Repositories;

use Yoast\WP\Lib\Model;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Hierarchy_Repository
 */
class Indexable_Hierarchy_Repository {

	/**
	 * Represents the indexable hierarchy builder.
	 *
	 * @var Indexable_Hierarchy_Builder
	 */
	protected $builder;

	/**
	 * Sets the hierarchy builder.
	 *
	 * @required
	 *
	 * @param Indexable_Hierarchy_Builder $builder The indexable hierarchy builder.
	 */
	public function set_builder( Indexable_Hierarchy_Builder $builder ) {
		$this->builder = $builder;
	}

	/**
	 * Removes all ancestors for an indexable.
	 *
	 * @param int $indexable_id The indexable id.
	 *
	 * @return bool Whether or not the indexables were successfully deleted.
	 */
	public function clear_ancestors( $indexable_id ) {
		return $this->query()->where( 'indexable_id', $indexable_id )->delete_many();
	}

	/**
	 * Adds an ancestor to an indexable.
	 *
	 * @param int $indexable_id The indexable id.
	 * @param int $ancestor_id  The ancestor id.
	 * @param int $depth        The depth.
	 *
	 * @return bool Whether or not the ancestor was added successfully.
	 */
	public function add_ancestor( $indexable_id, $ancestor_id, $depth ) {
		$hierarchy = $this->query()->create(
			[
				'indexable_id' => $indexable_id,
				'ancestor_id'  => $ancestor_id,
				'depth'        => $depth,
				'blog_id'      => \get_current_blog_id(),
			]
		);
		return $hierarchy->save();
	}

	/**
	 * Retrieves the ancestors. Create them when empty.
	 *
	 * @param Indexable $indexable The indexable to get the ancestors for.
	 *
	 * @return int[] The indexable IDs of the ancestors in order of grandparent to child.
	 */
	public function find_ancestors( Indexable $indexable ) {
		$ancestors = $this->query()
			->select( 'ancestor_id' )
			->where( 'indexable_id', $indexable->id )
			->order_by_desc( 'depth' )
			->find_array();

		if ( ! empty( $ancestors ) ) {
			$callback = function ( $ancestor ) {
				return $ancestor['ancestor_id'];
			};
			return \array_map( $callback, $ancestors );
		}

		$indexable = $this->builder->build( $indexable );
		$callback  = function ( $indexable ) {
			return $indexable->id;
		};
		return \array_map( $callback, $indexable->ancestors );
	}

	/**
	 * Finds the children for a given indexable.
	 *
	 * @param Indexable $indexable The indexable to find the children for.
	 *
	 * @return array Array with indexable ids for the children.
	 */
	public function find_children( Indexable $indexable ) {
		$children = $this->query()
			->select( 'indexable_id' )
			->where( 'ancestor_id', $indexable->id )
			->find_array();

		if ( empty( $children ) ) {
			return [];
		}

		$callback = function( $child ) {
			return $child['indexable_id'];
		};
		return \array_map( $callback, $children );
	}

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORM
	 */
	public function query() {
		return Model::of_type( 'Indexable_Hierarchy' );
	}
}

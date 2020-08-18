<?php
/**
 * Ancestor watcher to update the ancestor's children.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
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
	 * Represents the indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * Sets the needed dependencies.
	 *
	 * @param Indexable_Repository        $indexable_repository        The indexable repository.
	 * @param Indexable_Hierarchy_Builder $indexable_hierarchy_builder The hierarchy builder.
	 * @param Indexable_Helper            $indexable_helper            The indexable helper.
	 */
	public function __construct(
		Indexable_Repository $indexable_repository,
		Indexable_Hierarchy_Builder $indexable_hierarchy_builder,
		Indexable_Helper $indexable_helper
	) {
		$this->indexable_repository        = $indexable_repository;
		$this->indexable_hierarchy_builder = $indexable_hierarchy_builder;
		$this->indexable_helper            = $indexable_helper;
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

		$children = $this->indexable_repository->get_children( $indexable );
		foreach ( $children as $child ) {
			$this->indexable_hierarchy_builder->build( $child );

			$child->permalink = $this->indexable_helper->get_permalink_for_indexable( $child );
			$child->save();
		}

		return true;
	}
}

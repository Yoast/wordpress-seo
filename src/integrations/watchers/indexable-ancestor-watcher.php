<?php
/**
 * Author watcher to save the meta data to an Indexable.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

class Indexable_Ancestor_Watcher implements Integration_Interface {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Sets the needed dependencies.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'wpseo_save_indexable', [ $this, 'clear_ancestors' ], \PHP_INT_MAX, 2 );
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Removes the ancestors when the permalink for the given indexable has been changed.
	 *
	 * @param Indexable $indexable        The indexable.
	 * @param Indexable $indexable_before The old indexable.
	 *
	 * @return bool When clearing has been done.
	 */
	public function clear_ancestors( $indexable, $indexable_before ) {
		if ( ! in_array( $indexable->object_type, [ 'post', 'term' ], true ) ) {
			return false;
		}

		if ( $indexable->permalink === $indexable_before->permalink ) {
			return false;
		}

		$children = $this->indexable_repository->get_children( $indexable );
		foreach ( $children as $child ) {
			$child->permalink      = null;
			$child->permalink_hash = null;
			$child->save();
		}

		return true;
	}
}

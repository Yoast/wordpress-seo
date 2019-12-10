<?php
/**
 * WordPress Post watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Integrations\Watchers;

use Yoast\WP\Free\Conditionals\Migrations_Conditional;
use Yoast\WP\Free\Builders\Indexable_Builder;
use Yoast\WP\Free\Integrations\Integration_Interface;
use Yoast\WP\Free\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\Free\Repositories\Indexable_Repository;

/**
 * Fills the Indexable according to Post data.
 */
class Indexable_Post_Watcher implements Integration_Interface {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * @var Indexable_Hierarchy_Repository
	 */
	private $hierarchy_repository;

	/**
	 * Indexable_Post_Watcher constructor.
	 *
	 * @param Indexable_Repository           $repository           The repository to use.
	 * @param Indexable_Builder              $builder              The post builder to use.
	 * @param Indexable_Hierarchy_Repository $hierarchy_repository The hierarchy repository to use.
	 */
	public function __construct(
		Indexable_Repository $repository,
		Indexable_Builder $builder,
		Indexable_Hierarchy_Repository $hierarchy_repository
	) {
		$this->repository           = $repository;
		$this->builder              = $builder;
		$this->hierarchy_repository = $hierarchy_repository;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		\add_action( 'wp_insert_post', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'delete_post', [ $this, 'delete_indexable' ] );

		\add_action( 'edit_attachment',[ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'add_attachment', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'delete_attachment', [ $this, 'delete_indexable' ] );
	}

	/**
	 * Deletes the meta when a post is deleted.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return void
	 */
	public function delete_indexable( $post_id ) {
		$indexable = $this->repository->find_by_id_and_type( $post_id, 'post', false );

		if ( ! $indexable ) {
			return;
		}

		$this->hierarchy_repository->clear_ancestors( $indexable->id );
		$indexable->delete();
	}

	/**
	 * Saves post meta.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return void
	 */
	public function build_indexable( $post_id ) {
		// Bail if this is a multisite installation and the site has been switched.
		if ( is_multisite() && ms_is_switched() ) {
			return;
		}

		if ( ! $this->is_post_indexable( $post_id ) ) {
			return;
		}

		$indexable = $this->repository->find_by_id_and_type( $post_id, 'post', false );
		$indexable = $this->builder->build_for_id_and_type( $post_id, 'post', $indexable );

		$indexable->save();
	}

	/**
	 * Determines if the post can be indexed.
	 *
	 * @param int $post_id Post ID to check.
	 *
	 * @return bool True if the post can be indexed.
	 */
	protected function is_post_indexable( $post_id ) {
		if ( \wp_is_post_revision( $post_id ) ) {
			return false;
		}

		if ( \wp_is_post_autosave( $post_id ) ) {
			return false;
		}

		return true;
	}
}

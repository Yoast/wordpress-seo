<?php
/**
 * WordPress Post watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Generators\Related_Indexables_Generator;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Fills the Indexable according to Post data.
 */
class Indexable_Post_Watcher implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * The indexable hierarchy repository.
	 *
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
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'wp_insert_post', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'delete_post', [ $this, 'delete_indexable' ] );
		\add_action( 'wpseo_save_indexable', [ $this, 'updated_indexable' ], \PHP_INT_MAX, 2 );

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

		if ( $indexable->is_public ) {
			$this->update_relations( get_post( $post_id ) );
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
	 * Updates the relations when the post indexable is build.
	 *
	 * @param Indexable $updated_indexable The updated indexable.
	 * @param Indexable $old_indexable     The old indexable.
	 */
	public function updated_indexable( $updated_indexable, $old_indexable ) {
		if ( $updated_indexable->object_type !== 'post' ) {
			return;
		}

		// When the indexable is public or has a change in its public state.
		if ( $updated_indexable->is_public || $updated_indexable->is_public !== $old_indexable->is_public ) {
			$this->update_relations( get_post( $updated_indexable->object_id ) );
		}
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

	/**
	 * Updates the relations on post save or post status change.
	 *
	 * @param \WP_Post $post The post that has been updated.
	 */
	protected function update_relations( $post ) {
		/**
		 * The related indexables.
		 *
		 * @var Indexable[] $related_indexables.
		 */
		$related_indexables   = [];
		$related_indexables[] = $this->repository->find_by_id_and_type( $post->post_author, 'user', false );
		$related_indexables[] = $this->repository->find_for_post_type_archive( $post->post_type, false );
		$related_indexables[] = $this->repository->find_for_home_page( false );

		$taxonomies = get_post_taxonomies( $post->ID );
		$taxonomies = array_filter( $taxonomies, 'is_taxonomy_viewable' );
		foreach ( $taxonomies as $taxonomy ) {
			$terms = get_the_terms( $post->ID, $taxonomy );

			if ( empty( $terms ) ) {
				continue;
			}

			foreach ( $terms as $term ) {
				$related_indexables[] = $this->repository->find_by_id_and_type( $term->term_id, 'term', false );
			}
		}

		$related_indexables = \array_filter( $related_indexables );

		$updated_at = \gmdate( 'Y-m-d H:i:s' );
		foreach ( $related_indexables as $indexable ) {
			if ( ! $indexable->is_public ) {
				continue;
			}

			$indexable->updated_at = $updated_at;
			$indexable->save();
		}
	}
}

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
		\add_action( 'transition_post_status', [ $this, 'status_transition' ], \PHP_INT_MAX, 3 );

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

		if ( $indexable->is_public ) {
			$this->update_relations( get_post( $post_id ) );
		}

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

	/**
	 * Checks if the relations should be updated on status transition.
	 *
	 * @param string   $new_status The new status.
	 * @param string   $old_status The old status.
	 * @param \WP_Post $post       The post object.
	 */
	public function status_transition( $new_status, $old_status, $post ) {
		/**
		 * Filter: 'wpseo_public_post_statuses' - List of public post statuses.
		 *
		 * @apo array $post_statuses Post status list, defaults to array( 'publish' ).
		 */
		$public_statuses = \apply_filters( 'wpseo_public_post_statuses', [ 'publish' ] );

		if ( in_array( $new_status, $public_statuses, true ) || in_array( $old_status, $public_statuses, true ) ) {
			$this->update_relations( $post );
		}
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
			foreach( $terms as $term ) {
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

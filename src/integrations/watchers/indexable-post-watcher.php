<?php
/**
 * WordPress Post watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Exception;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
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
	 * The author archive helper.
	 *
	 * @var Author_Archive_Helper
	 */
	private $author_archive;

	/**
	 * Indexable_Post_Watcher constructor.
	 *
	 * @param Indexable_Repository           $repository           The repository to use.
	 * @param Indexable_Builder              $builder              The post builder to use.
	 * @param Indexable_Hierarchy_Repository $hierarchy_repository The hierarchy repository to use.
	 * @param Author_Archive_Helper          $author_archive       The author archive helper.
	 */
	public function __construct(
		Indexable_Repository $repository,
		Indexable_Builder $builder,
		Indexable_Hierarchy_Repository $hierarchy_repository,
		Author_Archive_Helper $author_archive
	) {
		$this->repository           = $repository;
		$this->builder              = $builder;
		$this->hierarchy_repository = $hierarchy_repository;
		$this->author_archive       = $author_archive;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		\add_action( 'wp_insert_post', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'delete_post', [ $this, 'delete_indexable' ] );
		\add_action( 'wpseo_save_indexable', [ $this, 'updated_indexable' ], \PHP_INT_MAX, 2 );

		\add_action( 'edit_attachment', [ $this, 'build_indexable' ], \PHP_INT_MAX );
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

		// Only interested in post indexables.
		if ( ! $indexable || $indexable->object_type !== 'post' ) {
			return;
		}

		if ( $indexable->is_public ) {
			$this->update_relations( \get_post( $post_id ) );
		}

		$this->update_has_public_posts( $indexable );

		$this->hierarchy_repository->clear_ancestors( $indexable->id );
		$indexable->delete();
	}

	/**
	 * Updates the relations when the post indexable is built.
	 *
	 * @param Indexable $updated_indexable The updated indexable.
	 * @param Indexable $old_indexable     The old indexable.
	 */
	public function updated_indexable( $updated_indexable, $old_indexable ) {
		// Only interested in post indexables.
		if ( $updated_indexable->object_type !== 'post' ) {
			return;
		}

		// When the indexable is public or has a change in its public state.
		if ( $updated_indexable->is_public || $updated_indexable->is_public !== $old_indexable->is_public ) {
			$this->update_relations( \get_post( $updated_indexable->object_id ) );
		}

		$this->update_has_public_posts( $updated_indexable );
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
	 * Saves post meta.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return void
	 */
	public function build_indexable( $post_id ) {
		// Bail if this is a multisite installation and the site has been switched.
		if ( $this->is_multisite_and_switched() ) {
			return;
		}

		if ( ! $this->is_post_indexable( $post_id ) ) {
			return;
		}

		try {
			$indexable = $this->repository->find_by_id_and_type( $post_id, 'post', false );
			$indexable = $this->builder->build_for_id_and_type( $post_id, 'post', $indexable );
			$indexable->save();
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}

	/**
	 * Updates the has_public_posts when the post indexable is built.
	 *
	 * Note: We only want to update `has_public_posts`. We do not do this in the builder for performance reasons.
	 *
	 * @param Indexable $indexable The indexable to check.
	 */
	protected function update_has_public_posts( $indexable ) {
		/*
		 * For attachments the `has_public_posts` represents whether:
		 * - The attachment has a post parent.
		 * - The attachment inherits the post status.
		 * - The post parent is public.
		 */
		if ( $indexable->object_sub_type === 'attachment' ) {
			$attachment = \get_post( $indexable->object_id );
			if ( ! is_object( $attachment ) ) {
				return;
			}

			$has_public_posts = $this->attachment_has_public_posts( (int) $attachment->post_parent, $indexable );

			// This check prevents a infinite loop due to saving the attachment again.
			if ( $indexable->has_public_posts !== $has_public_posts ) {
				$indexable->has_public_posts = $has_public_posts;
				$indexable->save();
			}

			return;
		}

		try {
			$author_indexable                   = $this->repository->find_by_id_and_type( $indexable->author_id, 'user' );
			$author_indexable->has_public_posts = $this->author_archive->author_has_public_posts( $author_indexable->object_id );
			$author_indexable->save();
		} catch ( Exception $exception ) { // @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
			// Do nothing.
		}
	}

	/**
	 * Checks if given attachment has any public posts.
	 *
	 * @param int       $parent_id The parent post id.
	 * @param Indexable $indexable The indexable for the attachment.
	 *
	 * @return bool True when the parent indexable has is_public set to true.
	 */
	protected function attachment_has_public_posts( $parent_id, Indexable $indexable ) {
		if ( $parent_id === 0 ) {
			return false;
		}

		if ( $indexable->post_status !== 'inherit' ) {
			return false;
		}

		try {
			$post_parent_indexable = $this->repository->find_by_id_and_type( $parent_id, 'post' );
		} catch ( Exception $exception ) {
			return false;
		}

		return $post_parent_indexable->is_public;
	}

	/**
	 * Updates the relations on post save or post status change.
	 *
	 * @param \WP_Post $post The post that has been updated.
	 */
	protected function update_relations( $post ) {
		$related_indexables = $this->get_related_indexables( $post );

		$updated_at = \gmdate( 'Y-m-d H:i:s' );
		foreach ( $related_indexables as $indexable ) {
			if ( ! $indexable->is_public ) {
				continue;
			}

			$indexable->updated_at = $updated_at;
			$indexable->save();
		}
	}

	/**
	 * Retrieves the related indexables for given post.
	 *
	 * @param \WP_Post $post The post to get the indexables for.
	 *
	 * @return Indexable[] The indexables.
	 */
	protected function get_related_indexables( $post ) {
		/**
		 * The related indexables.
		 *
		 * @var Indexable[] $related_indexables.
		 */
		$related_indexables   = [];
		$related_indexables[] = $this->repository->find_by_id_and_type( $post->post_author, 'user', false );
		$related_indexables[] = $this->repository->find_for_post_type_archive( $post->post_type, false );
		$related_indexables[] = $this->repository->find_for_home_page( false );

		$taxonomies = \get_post_taxonomies( $post->ID );
		$taxonomies = \array_filter( $taxonomies, 'is_taxonomy_viewable' );
		foreach ( $taxonomies as $taxonomy ) {
			$terms = \get_the_terms( $post->ID, $taxonomy );

			if ( empty( $terms ) || is_wp_error( $terms ) ) {
				continue;
			}

			foreach ( $terms as $term ) {
				$related_indexables[] = $this->repository->find_by_id_and_type( $term->term_id, 'term', false );
			}
		}

		return \array_filter( $related_indexables );
	}

	/**
	 * Tests if the site is multisite and switched.
	 *
	 * @return bool True when the site is multisite and switched
	 */
	protected function is_multisite_and_switched() {
		return \is_multisite() && \ms_is_switched();
	}
}

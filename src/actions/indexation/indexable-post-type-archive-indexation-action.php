<?php
/**
 * Reindexation action for post type archive indexables.
 *
 * @package Yoast\WP\SEO\Actions\Indexation
 */

namespace Yoast\WP\SEO\Actions\Indexation;

use WP_Post_Type;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Indexation_Post_Type_Archive_Action class.
 */
class Indexable_Post_Type_Archive_Indexation_Action implements Indexation_Action_Interface {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	private $builder;

	/**
	 * Indexation_Post_Type_Archive_Action constructor.
	 *
	 * @param Indexable_Repository $repository The indexable repository.
	 * @param Indexable_Builder    $builder    The indexable builder.
	 * @param Post_Type_Helper     $post_type  The post type helper.
	 */
	public function __construct(
		Indexable_Repository $repository,
		Indexable_Builder $builder,
		Post_Type_Helper $post_type
	) {
		$this->repository = $repository;
		$this->builder    = $builder;
		$this->post_type  = $post_type;
	}

	/**
	 * The total number of unindexed post type archives.
	 *
	 * @return int The total number of unindexed post type archives.
	 */
	public function get_total_unindexed() {
		return count( $this->get_unindexed_post_type_archives( false ) );
	}

	/**
	 * Creates indexables for post type archives.
	 *
	 * @return Indexable[] The created indexables.
	 */
	public function index() {
		/**
		 * Filter 'wpseo_post_indexing_limit' - Allow filtering the amount of posts indexed during each indexing pass.
		 *
		 * @api int The maximum number of posts indexed.
		 */
		$limit = \apply_filters( 'wpseo_post_type_archive_indexation_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		$unindexed_post_type_archives = $this->get_unindexed_post_type_archives( $limit );

		$indexables = [];
		foreach ( $unindexed_post_type_archives as $post_type_archive ) {
			$indexables[] = $this->builder->build_for_post_type_archive( $post_type_archive );
		}

		return $indexables;
	}

	/**
	 * Retrieves the list of post types for which no indexable for its archive page has been made yet.
	 *
	 * @param int|false $limit Limit the number of retrieved indexables to this number.
	 *
	 * @return array The list of post types for which no indexable for its archive page has been made yet.
	 */
	private function get_unindexed_post_type_archives( $limit = false ) {
		$post_types_with_archive_pages = $this->get_post_types_with_archive_pages();
		$indexed_post_types            = $this->get_indexed_post_type_archives();

		$unindexed_post_types = \array_diff( $post_types_with_archive_pages, $indexed_post_types );

		if ( $limit ) {
			return \array_slice( $unindexed_post_types, 0, $limit );
		}

		return $unindexed_post_types;
	}

	/**
	 * Returns the names of all the post types that have archive pages.
	 *
	 * @return array The list of names of all post types that have archive pages.
	 */
	private function get_post_types_with_archive_pages() {
		// We only want to index archive pages of public post types that have them.
		$public_post_types       = $this->post_type->get_public_post_types( 'object' );
		$post_types_with_archive = \array_filter( $public_post_types, [ $this, 'is_post_type_with_archive' ] );

		// We only need the post type names, not the objects.
		$post_types = [];
		foreach ( $post_types_with_archive as $post_type_with_archive ) {
			$post_types[] = $post_type_with_archive->name;
		}

		return $post_types;
	}

	/**
	 * Retrieves the list of post type names for which an archive indexable exists.
	 *
	 * @return array The list of names of post types with unindexed archive pages.
	 */
	private function get_indexed_post_type_archives() {
		$post_type_archive_indexables = $this->repository->find_all_with_type( 'post-type-archive' );

		// We only need the post type names, not the objects.
		$indexed_post_types = [];
		foreach ( $post_type_archive_indexables as $indexable ) {
			$indexed_post_types[] = $indexable->object_sub_type;
		}

		return $indexed_post_types;
	}

	/**
	 * Checks whether the given post type has an archive page or not.
	 *
	 * @param WP_Post_Type $post_type The post type to check.
	 *
	 * @return bool If the given post type has an archive page.
	 */
	private function is_post_type_with_archive( $post_type ) {
		return $this->post_type->has_archive( $post_type );
	}
}

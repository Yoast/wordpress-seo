<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Infrastructure\Actions;

use wpdb;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Interface;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * The Verify_Post_Type_Archives_Indexables_Action class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Verify_Post_Type_Archives_Indexables_Action implements Verify_Indexables_Action_Interface {

	/**
	 * The indexable repository instance.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The wp query.
	 *
	 * @var wpdb $wpdb
	 */
	private $wpdb;

	/**
	 * The post type helper instance.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * The indexable builder instance.
	 *
	 * @var Indexable_Builder
	 */
	private $indexable_builder;

	/**
	 * The constructor.
	 *
	 * @param Post_Type_Helper     $post_type_helper     The post type helper.
	 * @param Indexable_Builder    $indexable_builder    The indexable builder.
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct(
		Post_Type_Helper $post_type_helper,
		Indexable_Builder $indexable_builder,
		Indexable_Repository $indexable_repository
	) {
		$this->post_type_helper     = $post_type_helper;
		$this->indexable_builder    = $indexable_builder;
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Rebuilds the indexables for post type archives.
	 *
	 * @param Last_Batch_Count $last_batch_count The last batch count domain object.
	 * @param Batch_Size       $batch_size       The batch size domain object.
	 *
	 * @return bool
	 */
	public function re_build_indexables( Last_Batch_Count $last_batch_count, Batch_Size $batch_size ): bool {

		$archives = $this->post_type_helper->get_indexable_post_archives();

		$archives = \array_slice( $archives, $last_batch_count->get_last_batch(), ( $last_batch_count->get_last_batch() + $batch_size->get_batch_size() ) );

		$indexables = [];
		foreach ( $archives as $post_type_archive ) {
			$archive_indexable = $this->indexable_repository->find_for_post_type_archive( $post_type_archive->name, false );
			$indexables[]      = $this->indexable_builder->build_for_post_type_archive( $post_type_archive->name, $archive_indexable );
		}

		return $batch_size->should_keep_going( \count( $indexables ) );
	}

	/**
	 * Sets the wpdb instance.
	 *
	 * @param wpdb $wpdb The wpdb instance.
	 *
	 * @return void
	 * @required
	 */
	public function set_wpdb( wpdb $wpdb ) {
		$this->wpdb = $wpdb;
	}
}

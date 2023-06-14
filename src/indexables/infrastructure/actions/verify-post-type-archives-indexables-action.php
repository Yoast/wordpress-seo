<?php

namespace Yoast\WP\SEO\Indexables\Infrastructure\Actions;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Interface;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

class Verify_Post_Type_Archives_Indexables_Action implements Verify_Indexables_Action_Interface {
	/**
	 * @var \Yoast\WP\SEO\Repositories\Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * @var \wpdb $wpdb The wp query.
	 */
	private $wpdb;

	/**
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;
	/**
	 * @var Indexable_Builder
	 */
	protected $indexable_builder;

	public function __construct( Post_Type_Helper $post_type_helper, Indexable_Builder $indexable_builder,Indexable_Repository $indexable_repository) {

		$this->post_type_helper  = $post_type_helper;
		$this->indexable_builder = $indexable_builder;
		$this->indexable_repository = $indexable_repository;
	}

	public function re_build_indexables( Last_Batch_Count $last_batch_count, Batch_Size $batch_size ): bool {

		$archives = $this->post_type_helper->get_indexable_post_archives();

		$archives = \array_slice( $archives, $last_batch_count->get_last_batch(), $last_batch_count->get_last_batch() + $batch_size->get_batch_size() );

		$indexables = [];
		foreach ( $archives as $post_type_archive ) {
			$archive_indexable = $this->indexable_repository->find_for_post_type_archive($post_type_archive, false);
			$indexables[] = $this->indexable_builder->build_for_post_type_archive( $post_type_archive,$archive_indexable );
		}

		return $batch_size->should_keep_going( \count( $indexables ) );
	}

	/**
	 * @param \wpdb $wpdb
	 *
	 * @return void
	 * @required
	 */
	public function set_wpdb( \wpdb $wpdb ) {
		$this->wpdb = $wpdb;
	}
}

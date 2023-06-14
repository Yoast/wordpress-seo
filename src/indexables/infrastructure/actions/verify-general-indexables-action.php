<?php

namespace Yoast\WP\SEO\Indexables\Infrastructure\Actions;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Interface;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

class Verify_General_Indexables_Action implements Verify_Indexables_Action_Interface {


	/**
	 * @var \Yoast\WP\SEO\Repositories\Indexable_Repository
	 */
	protected $repository;
	/**
	 * @var \Yoast\WP\SEO\Builders\Indexable_Builder
	 */
	protected $indexable_builder;

	public function __construct( Indexable_Repository $repository, Indexable_Builder $indexable_builder ) {
		$this->repository        = $repository;
		$this->indexable_builder = $indexable_builder;
	}

	/**
	 * @var \wpdb $wpdb The wp query.
	 */
	private $wpdb;

	public function re_build_indexables( Last_Batch_Count $last_batch_count, Batch_Size $batch_size ): bool {

		$system_page = $this->repository->find_for_system_page( '404',false );
		$this->indexable_builder->build_for_system_page( '404', $system_page );

		$search_result = $this->repository->find_for_system_page( 'search-result',false );
		$this->indexable_builder->build_for_system_page( 'search-result', $search_result );

		$date_archive = $this->repository->find_for_date_archive(false);
		$this->indexable_builder->build_for_date_archive( $date_archive );

		$home_page = $this->repository->find_for_home_page(false);
		$this->indexable_builder->build_for_home_page( $home_page );

		return false;
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

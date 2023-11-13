<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Indexables\Infrastructure\Actions;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Interface;
use Yoast\WP\SEO\Indexables\Domain\Batch_Size;
use Yoast\WP\SEO\Indexables\Domain\Last_Batch_Count;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * The Verify_General_Indexables_Action class.
 */
class Verify_General_Indexables_Action implements Verify_Indexables_Action_Interface {

	/**
	 * The indexable repository instance.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The indexable builder instance.
	 *
	 * @var Indexable_Builder
	 */
	protected $indexable_builder;

	/**
	 * The constructor.
	 *
	 * @param Indexable_Repository $repository        The indexable repository.
	 * @param Indexable_Builder    $indexable_builder The indexable builder.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Builder $indexable_builder ) {
		$this->repository        = $repository;
		$this->indexable_builder = $indexable_builder;
	}

	/**
	 * The wp query.
	 *
	 * @var \wpdb $wpdb
	 */
	private $wpdb;

	/**
	 * Rebuilds the indexables for the general pages.
	 *
	 * @param Last_Batch_Count $last_batch_count The last batch count domain object.
	 * @param Batch_Size       $batch_size       The batch size domain object.
	 *
	 * @return bool
	 */
	public function re_build_indexables( Last_Batch_Count $last_batch_count, Batch_Size $batch_size ): bool {

		$system_page = $this->repository->find_for_system_page( '404', false );
		$this->indexable_builder->build_for_system_page( '404', $system_page );

		$search_result = $this->repository->find_for_system_page( 'search-result', false );
		$this->indexable_builder->build_for_system_page( 'search-result', $search_result );

		$date_archive = $this->repository->find_for_date_archive( false );
		$this->indexable_builder->build_for_date_archive( $date_archive );

		$home_page = $this->repository->find_for_home_page( false );
		$this->indexable_builder->build_for_home_page( $home_page );

		return false;
	}

	/**
	 * Sets the wpdb instance.
	 *
	 * @param \wpdb $wpdb The instance.
	 *
	 * @return void
	 * @required
	 */
	public function set_wpdb( \wpdb $wpdb ) {
		$this->wpdb = $wpdb;
	}
}

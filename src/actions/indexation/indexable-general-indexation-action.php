<?php
/**
 * Reindexation action for indexables.
 *
 * @package Yoast\WP\SEO\Actions\Indexation
 */

namespace Yoast\WP\SEO\Actions\Indexation;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Indexable_Misc_Indexation_Action class.
 */
class Indexable_General_Indexation_Action implements Indexation_Action_Interface {

	/**
	 * Represents the indexables repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Represents the indexables builder.
	 *
	 * @var Indexable_Builder
	 */
	protected $indexable_builder;

	/**
	 * Indexable_General_Indexation_Action constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexables repository.
	 * @param Indexable_Builder    $indexable_builder    The indexables builder.
	 */
	public function __construct( Indexable_Repository $indexable_repository, Indexable_Builder $indexable_builder ) {
		$this->indexable_repository = $indexable_repository;
		$this->indexable_builder    = $indexable_builder;
	}

	/**
	 * @inheritDoc
	 */
	public function get_total_unindexed() {
		$indexables_to_create = $this->query();

		return count( $indexables_to_create );
	}

	/**
	 * @inheritDoc
	 */
	public function index() {
		$indexables           = [];
		$indexables_to_create = $this->query();

		if ( isset( $indexables_to_create['404'] ) ) {
			$indexables[] = $this->indexable_builder->build_for_system_page( '404' );
		}

		if ( isset( $indexables_to_create['search'] ) ) {
			$indexables[] = $this->indexable_builder->build_for_system_page( 'search-result' );
		}

		if ( isset( $indexables_to_create['date_archive'] ) ) {
			$indexables[] = $this->indexable_builder->build_for_date_archive();
		}
		if ( isset( $indexables_to_create['home_page'] ) ) {
			$indexables[] = $this->indexable_builder->build_for_home_page();
		}

		return $indexables;
	}

	/**
	 * @inheritDoc
	 */
	public function get_limit() {
		// This matches the maximum amount of indexables created by this action.
		return 4;
	}

	/**
	 * Check which indexables already exists and return the values of the ones to create.
	 *
	 * @return array The indexable types to create.
	 */
	private function query() {
		$indexables_to_create = [];
		if ( ! $this->indexable_repository->find_for_system_page( '404', false ) ) {
			$indexables_to_create['404'] = true;
		}

		if ( ! $this->indexable_repository->find_for_system_page( 'search-result', false ) ) {
			$indexables_to_create['search'] = true;
		}

		if ( ! $this->indexable_repository->find_for_date_archive( false ) ) {
			$indexables_to_create['date_archive'] = true;
		}

		$need_home_page_indexable = ( (int) \get_option( 'page_on_front' ) === 0 && \get_option( 'show_on_front' ) === 'posts' );

		if ( $need_home_page_indexable && ! $this->indexable_repository->find_for_home_page( false ) ) {
			$indexables_to_create['home_page'] = true;
		}

		return $indexables_to_create;
	}
}

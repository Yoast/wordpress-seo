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

		if ( \in_array( '404', $indexables_to_create, true ) ) {
			$indexables[] = $this->indexable_builder->build_for_system_page( '404' );
		}

		if ( \in_array( 'search', $indexables_to_create, true ) ) {
			$indexables[] = $this->indexable_builder->build_for_system_page( 'search' );
		}

		if ( \in_array( 'date_archive', $indexables_to_create, true ) ) {
			$indexables[] = $this->indexable_builder->build_for_date_archive();
		}

		if ( \in_array( 'home_page', $indexables_to_create, true ) ) {
			$indexables[] = $this->indexable_builder->build_for_home_page();
		}

		return $indexables;
	}

	/**
	 * Check which indexables already exists and return the values of the ones to create.
	 *
	 * @return array The indexable types to create.
	 */
	private function query() {
		$indexables_to_create = [];
		// Create a misc indexation action for system pages ( 404 and search ), date archive and home page ( if not a post ) indexables and add it to the route and integration.
		if ( ! $this->indexable_repository->find_for_system_page( '404', false ) ) {
			$indexables_to_create[] = '404';
		}

		if ( ! $this->indexable_repository->find_for_system_page( 'search', false ) ) {
			$indexables_to_create[] = 'search';
		}

		if ( ! $this->indexable_repository->find_for_date_archive( false ) ) {
			$indexables_to_create[] = 'date_archive';
		}

		$need_home_page_indexable = ( (int) \get_option( 'page_on_front' ) === 0 && \get_option( 'show_on_front' ) === 'posts' );

		if ( $need_home_page_indexable && ! $this->indexable_repository->find_for_home_page( false ) ) {
			$indexables_to_create[] = 'home_page';
		}

		return $indexables_to_create;
	}
}

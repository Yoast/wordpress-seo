<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Nlweb\Schema_Aggregator\Infrastructure;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Class that collects indexables to be aggregated for the site schema.
 */
class To_Aggregate_Indexable_Collector {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * To_Aggregate_Indexable_Collector constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Gets the indexables to be aggregated.
	 *
	 * @param int $page      The page number (1-based).
	 * @param int $page_size The number of items per page.
	 *
	 * @return array<Indexable> The aggregated schema.
	 */
	public function get( $page, $page_size ): array {

		return $this->indexable_repository->find_all_public_paginated(
			$page,
			$page_size,
		);
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository as Base_Indexable_Repository;

/**
 * Native implementation of the Indexable Repository Interface.
 */
class Indexable_Repository implements Indexable_Repository_Interface {

	/**
	 * The indexables repository.
	 *
	 * @var Base_Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Constructor.
	 *
	 * @param Base_Indexable_Repository $indexable_repository The indexables repository.
	 */
	public function __construct( Base_Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Retrieves existing public indexables in a paginated manner.
	 *
	 * @codeCoverageIgnore -- This is a wrapper for indexable_Repository::find_all_public_paginated, which has dedicated integration tests.
	 * @param int    $page      The page number.
	 * @param int    $page_size The number of items per page.
	 * @param string $post_type The post type to filter by.
	 *
	 * @return array<Indexable> The array of public indexables.
	 */
	public function get( int $page, int $page_size, string $post_type ): array {
		return $this->indexable_repository->find_all_public_paginated(
			$page,
			$page_size,
			$post_type,
		);
	}
}

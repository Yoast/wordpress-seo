<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository;

use Yoast\WP\SEO\Models\Indexable;
/**
 * Interface for the Indexable repository.
 */
interface Indexable_Repository_Interface {

	/**
	 * Gets the indexables to be aggregated.
	 *
	 * @param int    $page      The page number (1-based).
	 * @param int    $page_size The number of items per page.
	 * @param string $post_type The post type to filter by.
	 *
	 * @return array<Indexable> The indexables.
	 */
	public function get( int $page, int $page_size, string $post_type ): array;
}

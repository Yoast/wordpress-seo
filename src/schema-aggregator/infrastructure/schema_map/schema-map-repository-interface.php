<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map;

use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection;

/**
 * Interface for the Schema map repository.
 */
interface Schema_Map_Repository_Interface {

	/**
	 * Gets the indexable count per post type.
	 *
	 * @param array<string> $post_types The post types to get the indexable count for.
	 *
	 * @return Indexable_Count_Collection The indexable count per post type.
	 */
	public function get_indexable_count_per_post_type( array $post_types ): Indexable_Count_Collection;

	/**
	 * Gets the indexable count for a single post type.
	 *
	 * @param string $post_type The post type to get the indexable count for.
	 *
	 * @return Indexable_Count The indexable count for the post type.
	 */
	public function get_indexable_count_for_post_type( string $post_type ): Indexable_Count;

	/**
	 * Get lastmod timestamp for a post type and page range
	 *
	 * Returns the latest post_modified_gmt timestamp for posts in the given range.
	 * Used for schemamap index to enable selective updates.
	 *
	 * @param string $post_type Post type slug.
	 * @param int    $page      Page number (1-indexed).
	 * @param int    $per_page  Items per page.
	 * @return string ISO 8601 timestamp (e.g., "2025-10-21T14:23:17Z").
	 */
	public function get_lastmod_for_post_type( string $post_type, int $page, int $per_page ): string;
}

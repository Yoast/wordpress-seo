<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map;

use Exception;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection;

/**
 * Class Schema_Map_WordPress_Repository
 *
 * Maps indexable repository queries for schema map needs.
 */
class Schema_Map_WordPress_Repository implements Schema_Map_Repository_Interface {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Schema_Map_Indexable_Repository constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Gets the indexable count per post type.
	 *
	 * @param array<string> $post_types The post types to get the indexable count for.
	 *
	 * @return Indexable_Count_Collection The indexable count per post type.
	 */
	public function get_indexable_count_per_post_type( array $post_types ): Indexable_Count_Collection {
		$post_type_counts = new Indexable_Count_Collection();
		foreach ( $post_types as $post_type ) {
			$count = (int) \wp_count_posts( $post_type )->publish;
			$post_type_counts->add_indexable_count( new Indexable_Count( $post_type, $count ) );
		}

		return $post_type_counts;
	}

	/**
	 * Gets the indexable count for a single post type.
	 *
	 * @param string $post_type The post type to get the indexable count for.
	 *
	 * @return Indexable_Count The indexable count for the post type.
	 */
	public function get_indexable_count_for_post_type( string $post_type ): Indexable_Count {

		$count = (int) \wp_count_posts( $post_type )->publish;
		if ( empty( $count ) ) {
			return new Indexable_Count( $post_type, 0 );
		}

		return new Indexable_Count( $post_type, $count );
	}

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
	public function get_lastmod_for_post_type( string $post_type, int $page, int $per_page ): string {
		global $wpdb;
		$fallback = \gmdate( 'Y-m-d\TH:i:s\Z' );

		try {
			$offset = ( ( $page - 1 ) * $per_page );
			// phpcs:disable WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: No relevant caches.
			// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery -- Reason: Most performant way.
			$lastmod = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT MAX(post_modified_gmt)
                     FROM (
                         SELECT post_modified_gmt
                         FROM {$wpdb->posts}
                         WHERE post_type = %s
                           AND post_status = 'publish'
                         ORDER BY ID
                         LIMIT %d OFFSET %d
                     ) AS posts_range",
					$post_type,
					$per_page,
					$offset,
				),
			);
			// phpcs:enable
			// Convert to ISO 8601 format or use current time if no posts.
			if ( $lastmod && ! empty( $lastmod ) ) {
				return \gmdate( 'Y-m-d\TH:i:s\Z', \strtotime( $lastmod ) );
			}
			return $fallback;
		} catch ( Exception $e ) {
			return $fallback;
		}
	}
}

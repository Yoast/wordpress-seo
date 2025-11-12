<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map;

use Exception;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection;

/**
 * Class Schema_Map_Indexable_Repository
 *
 * Maps indexable repository queries for schema map needs.
 */
class Schema_Map_Indexable_Repository {

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
		$post_type_counts    = new Indexable_Count_Collection();
		$indexable_raw_value = $this->indexable_repository->query()
			->select_expr( 'object_sub_type,count(object_sub_type) as count' )
			->where_in( 'object_sub_type', $post_types )
			->group_by( [ 'object_type', 'object_sub_type' ] )
			->find_array();

		if ( empty( $indexable_raw_value ) ) {
			return $post_type_counts;
		}

		foreach ( $indexable_raw_value as $indexable ) {
			$post_type_counts->add_indexable_count( new Indexable_Count( $indexable['object_sub_type'], (int) $indexable['count'] ) );
		}

		return $post_type_counts;
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
		$fallback = \gmdate( 'Y-m-d\TH:i:s\Z' );

		try {
			$offset  = ( ( $page - 1 ) * $per_page );
			$lastmod = $this->indexable_repository->query()
				->select_expr( 'MAX(object_last_modified)' )
				->where( 'object_sub_type', $post_type )
				->where_raw( '( is_public IS NULL OR is_public = 1 )' )
				->order_by_asc( 'id' )->limit( $per_page )->offset( $offset )
				->find_one();

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

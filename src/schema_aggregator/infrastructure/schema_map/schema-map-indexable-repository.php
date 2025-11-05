<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map;

use Yoast\WP\SEO\Repositories\Indexable_Repository;

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
	 * @return array<string|int> The indexable count per post type.
	 */
	public function get_indexable_count_per_post_type( array $post_types ): array {
		$post_type_counts    = [];
		$indexable_raw_value = $this->indexable_repository->query()
			->select_expr( 'object_sub_type,count(object_sub_type) as count' )
			->where_in( 'object_sub_type', $post_types )
			->group_by( [ 'object_type', 'object_sub_type' ] )
			->find_array();

		if ( empty( $indexable_raw_value ) ) {
			return $post_type_counts;
		}

		foreach ( $indexable_raw_value as $indexable ) {
			$post_type_counts[ $indexable['object_sub_type'] ] = $indexable['count'];
		}

		return $post_type_counts;
	}
}

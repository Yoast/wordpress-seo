<?php

namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure;

use WP_Query;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * WordPress-based implementation of the Indexable Repository Interface.
 */
class WordPress_Indexable_Repository implements Indexable_Repository_Interface {

	/**
	 * The indexable builder instance.
	 *
	 * @var Indexable_Builder
	 */
	private $indexable_builder;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Builder $indexable_builder The indexable builder.
	 */
	public function __construct( Indexable_Builder $indexable_builder ) {
		$this->indexable_builder = $indexable_builder;
	}

	/**
	 * Builds on-the-fly public indexables in a paginated manner.
	 *
	 * @param int    $page      The page number.
	 * @param int    $page_size The number of items per page.
	 * @param string $post_type The post type to filter by.
	 *
	 * @return array<Indexable> The array of public indexables.
	 */
	public function get( int $page, int $page_size, string $post_type ): array {
		$query = new WP_Query(
			[
				'post_type'      => $post_type,
				'post_status'    => 'publish',
				'posts_per_page' => $page_size,
				'paged'          => $page,
				'fields'         => 'ids',
				'no_found_rows'  => false,
			]
		);

		if ( ! $query instanceof WP_Query ) {
			return [];
		}

		$post_ids          = isset( $query->posts ) && \is_array( $query->posts ) ? $query->posts : [];
		$public_indexables = [];
		foreach ( $post_ids as $post_id ) {
			$indexable = $this->indexable_builder->build_for_id_and_type( $post_id, $post_type );
			if ( $indexable !== null && $indexable->is_public ) {
				$public_indexables[] = $indexable;
			}
		}
		return $public_indexables;
	}
}

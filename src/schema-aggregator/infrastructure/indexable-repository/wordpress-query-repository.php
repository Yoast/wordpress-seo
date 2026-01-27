<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Indexable_Repository;

use WP_Query;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository as Pure_Indexable_Repository;

/**
 * WordPress-based implementation of the Indexable Repository Interface.
 */
class WordPress_Query_Repository implements Indexable_Repository_Interface {

	/**
	 * The indexable builder instance.
	 *
	 * @var Indexable_Builder
	 */
	private $indexable_builder;

	/**
	 * The indexables repository.
	 *
	 * @var Pure_Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Builder         $indexable_builder    The indexable builder.
	 * @param Pure_Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Builder $indexable_builder, Pure_Indexable_Repository $indexable_repository ) {
		$this->indexable_builder    = $indexable_builder;
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Builds on-the-fly public indexables in a paginated manner.
	 *
	 * @codeCoverageIgnore -- This is covered by dedicated integration tests.
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
			$indexable = $this->indexable_repository->find_by_id_and_type( $post_id, $post_type );
			if ( $indexable !== null && ( $indexable->is_public === true || $indexable->is_public === null ) ) {
				$public_indexables[] = $indexable;
			}
		}
		return $public_indexables;
	}
}

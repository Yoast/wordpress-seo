<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Meta;

use Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Builder;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Indexable_Repository;

/**
 * Provides metadata for API responses.
 */
class Response_Meta_Provider {

	/**
	 * The schema map indexable repository.
	 *
	 * @var Schema_Map_Indexable_Repository
	 */
	private $schema_map_repository;

	/**
	 * The schema map builder.
	 *
	 * @var Schema_Map_Builder
	 */
	private $schema_map_builder;

	/**
	 * Response_Meta_Provider constructor.
	 *
	 * @param Schema_Map_Indexable_Repository $schema_map_repository The schema map indexable repository.
	 * @param Schema_Map_Builder              $schema_map_builder    The schema map builder.
	 */
	public function __construct( Schema_Map_Indexable_Repository $schema_map_repository, Schema_Map_Builder $schema_map_builder ) {
		$this->schema_map_repository = $schema_map_repository;
		$this->schema_map_builder    = $schema_map_builder;
	}

	/**
	 * Build metadata structure for API response
	 *
	 * @param string $post_type The post type being queried.
	 * @param int    $page      The page number (1-based).
	 * @param int    $page_size The number of items per page.
	 *
	 * @return array<string,array<string>> Metadata structure.
	 */
	public function get_metadata( string $post_type, int $page, int $page_size ): array {
		$metadata = [
			'generator'    => [
				'name'    => 'Yoast NLWeb Integration',
				'version' => \WPSEO_VERSION,
				'vendor'  => 'Yoast',
				'url'     => 'https://yoast.com',
			],
			'dependencies' => [
				'wordpress' => \function_exists( 'get_bloginfo' ) ? \get_bloginfo( 'version' ) : 'unknown',
				'yoast_seo' => \WPSEO_VERSION,
			],
			'generated_at' => \gmdate( 'Y-m-d\TH:i:s\Z' ),
		];

		if ( \defined( 'WPSEO_WOO_VERSION' ) ) {
			$metadata['dependencies']['yoast_seo_woocommerce'] = \WPSEO_WOO_VERSION;
		}

		return $this->maybe_add_pagination_metadata( $metadata, $post_type, $page, $page_size );
	}

	/**
	 * Add pagination metadata to the response if applicable.
	 *
	 * @param array<string,array<string>> $metadata  The metadata array to add pagination info to.
	 * @param string                      $post_type The post type being queried.
	 * @param int                         $page      The current page number (1-based).
	 * @param int                         $page_size The number of items per page.
	 *
	 * @return array<string,array<string>> The updated metadata array.
	 */
	private function maybe_add_pagination_metadata(
		array $metadata,
		string $post_type,
		int $page,
		int $page_size
	): array {

		$indexable_count = $this->schema_map_repository->get_indexable_count_for_post_type( $post_type );
		$total_items     = $indexable_count->get_count();

		if ( $total_items === 0 ) {
			return $metadata;
		}

		$total_pages = (int) \ceil( $total_items / $page_size );

		if ( $page < $total_pages ) {
			$next_page_url    = $this->schema_map_builder->get_rest_route( $post_type, ( $page + 1 ) );
			$metadata['next'] = $next_page_url;

		}
		return $metadata;
	}
}

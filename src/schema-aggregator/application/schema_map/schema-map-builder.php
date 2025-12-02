<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map;

use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Repository_Interface;

/**
 * Builds the schema map.
 */
class Schema_Map_Builder {

	/**
	 * The schema map repository.
	 *
	 * @var Schema_Map_Repository_Interface
	 */
	private $schema_map_repository;

	/**
	 * Sets the schema map repository.
	 *
	 * @param Schema_Map_Repository_Interface $schema_map_repository The schema map repository.
	 *
	 * @return self
	 */
	public function with_repository( Schema_Map_Repository_Interface $schema_map_repository ): self {
		$this->schema_map_repository = $schema_map_repository;
		return $this;
	}

	/**
	 * Builds the schema map based on indexable counts and threshold.
	 *
	 * @param Indexable_Count_Collection $indexable_counts The indexable counts per post type.
	 * @param int                        $threshold        The threshold for items per page.
	 *
	 * @return array<int,array<string>> The schema map.
	 */
	public function build( Indexable_Count_Collection $indexable_counts, int $threshold ): array {

		$schema_map = [];
		foreach ( $indexable_counts->get_indexable_counts() as $indexable_count ) {
			$post_type = $indexable_count->get_post_type();
			$count     = $indexable_count->get_count();

			$total_pages = (int) \ceil( $count / $threshold );

			for ( $page = 1; $page <= $total_pages; $page++ ) {
				if ( $page === 1 && $total_pages === 1 ) {
					$url = $this->get_rest_route( $post_type );
				}
				elseif ( $page === 1 ) {
					$url = $this->get_rest_route( $post_type );
				}
				else {
					$url = $this->get_rest_route( $post_type, $page );
				}

				$lastmod = $this->schema_map_repository->get_lastmod_for_post_type( $post_type, $page, $threshold );

				$page_count = ( $page === $total_pages ) ? ( $count - ( ( $page - 1 ) * $threshold ) ) : $threshold;

				$schema_map[] = [
					'post_type' => $post_type,
					'url'       => $url,
					'lastmod'   => $lastmod,
					'count'     => $page_count,
				];
			}
		}

		return $schema_map;
	}

	/**
	 * Gets the REST route for the given post type and page.
	 *
	 * @param string $post_type The post type.
	 * @param int    $page      The page number (default is 1).
	 *
	 * @return string The REST route URL.
	 */
	public function get_rest_route( $post_type, $page = 1 ): string {
		if ( $page === 1 ) {
			return \rest_url( Main::API_V1_NAMESPACE . '/schema-aggregator/get-schema/' . $post_type );
		}
		else {
			return \rest_url( Main::API_V1_NAMESPACE . '/schema-aggregator/get-schema/' . $post_type . '/' . $page );
		}
	}
}

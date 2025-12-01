<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map;

use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Indexable_Count_Collection;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Map\Schema_Map_Indexable_Repository;

/**
 * Builds the schema map.
 */
class Schema_Map_Builder {

	/**
	 * The indexable repository.
	 *
	 * @var Schema_Map_Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The configuration.
	 *
	 * @var Config
	 */
	private $config;

	/**
	 * Schema_Map_Builder constructor.
	 *
	 * @param Schema_Map_Indexable_Repository $indexable_repository The indexable repository.
	 * @param Config                          $config               The configuration.
	 */
	public function __construct( Schema_Map_Indexable_Repository $indexable_repository, Config $config ) {
		$this->indexable_repository = $indexable_repository;
		$this->config               = $config;
	}

	/**
	 * Builds the schema map based on indexable counts and threshold.
	 *
	 * @param Indexable_Count_Collection $indexable_counts The indexable counts per post type.
	 *
	 * @return array<int,array<string>> The schema map.
	 */
	public function build( Indexable_Count_Collection $indexable_counts ): array {
		$schema_map = [];
		foreach ( $indexable_counts->get_indexable_counts() as $indexable_count ) {

			$post_type = $indexable_count->get_post_type();
			$count     = $indexable_count->get_count();

			$threshold = $this->config->get_per_page( $post_type );

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

				$lastmod = $this->indexable_repository->get_lastmod_for_post_type( $post_type, $page, $threshold );

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

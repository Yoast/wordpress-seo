<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map;

/**
 * Builds the schema map.
 */
class Schema_Map_Builder {

	/**
	 * Builds the schema map based on indexable counts and threshold.
	 *
	 * @param array<string,int> $indexable_counts The indexable counts per post type.
	 * @param int               $threshold        The threshold for items per page.
	 *
	 * @return array<int,array<string,mixed>> The schema map.
	 */
	public function get_schema_map( array $indexable_counts, int $threshold ): array {
		$schema_map = [];
		foreach ( $indexable_counts as $post_type => $count ) {
			$total_pages = (int) \ceil( $count / $threshold );

			for ( $page = 1; $page <= $total_pages; $page++ ) {
				if ( $page === 1 && $total_pages === 1 ) {
					$url = \rest_url( 'schema-aggregator/get-schema/' . $post_type );
				}
				elseif ( $page === 1 ) {
					$url = \rest_url( 'schema-aggregator/get-schema/' . $post_type );
				}
				else {
					$url = \rest_url( 'schema-aggregator/get-schema/' . $post_type . '/' . $page );
				}

				// Get lastmod for this specific page range.
				// $lastmod = $this->get_lastmod_for_post_type($post_type, $page, $threshold);

				$page_count = ( $page === $total_pages ) ? ( $count - ( ( $page - 1 ) * $threshold ) ) : $threshold;

				$schema_map[] = [
					'post_type' => $post_type,
					'url'       => $url,
					'lastmod'   => '',
					'count'     => $page_count,
				];
			}
		}

		return $schema_map;
	}
}

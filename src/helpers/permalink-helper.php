<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Models\Indexable;

/**
 * A helper object for permalinks.
 */
class Permalink_Helper {

	/**
	 * Retrieves the permalink for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string|null The permalink.
	 */
	public function get_permalink_for_indexable( $indexable ) {
		switch ( true ) {
			case $indexable->object_type === 'post':
				if ( $indexable->object_sub_type === 'attachment' ) {
					return \wp_get_attachment_url( $indexable->object_id );
				}
				return \get_permalink( $indexable->object_id );
			case $indexable->object_type === 'home-page':
				return \home_url( '/' );
			case $indexable->object_type === 'term':
				$term = \get_term( $indexable->object_id );

				if ( $term === null || \is_wp_error( $term ) ) {
					return null;
				}

				return \get_term_link( $term, $term->taxonomy );
			case $indexable->object_type === 'system-page' && $indexable->object_sub_type === 'search-page':
				return \get_search_link();
			case $indexable->object_type === 'post-type-archive':
				return \get_post_type_archive_link( $indexable->object_sub_type );
			case $indexable->object_type === 'user':
				return \get_author_posts_url( $indexable->object_id );
		}

		return null;
	}

	/**
	 * Gets the permalink sample array for the 15.3 upgrade routine.
	 *
	 * @return array|mixed The keys as permalink types for indexables (object_type-object_sub_type) with a timestamp as value, otherwise an empty array.
	 */
	public function take_permalink_sample_array() {
		global $wpdb;
		$indexable_permalinks = [];

		$results = $wpdb->get_results(
			"SELECT DISTINCT object_type, object_sub_type 
		FROM `{$wpdb->prefix}yoast_indexable` 
		WHERE object_sub_type IS NOT NULL"
			, OBJECT );

		if( !empty($results) )
		{
			foreach ( $results as $result )
			{
				$indexable_permalinks[ $result->object_type . '-' . $result->object_sub_type ] = \time();
			}
		}

		return $indexable_permalinks;
	}
}

<?php
/**
 * Post Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\Free\Builders;

/**
 * Formats the term meta to indexable format.
 */
class Indexable_Author_Builder {

	/**
	 * Formats the data.
	 *
	 * @param int                             $user_id   The user to retrieve the indexable for.
	 * @param \Yoast\WP\Free\Models\Indexable $indexable The indexable to format.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The extended indexable.
	 */
	public function build( $user_id, $indexable ) {
		$meta_data = $this->get_meta_data( $user_id );

		$indexable->permalink              = \get_author_posts_url( $user_id );
		$indexable->title                  = $meta_data['wpseo_title'];
		$indexable->description            = $meta_data['wpseo_metadesc'];
		$indexable->is_cornerstone         = false;
		$indexable->is_robots_noindex      = ( $meta_data['wpseo_noindex_author'] === 'on' );
		$indexable->is_robots_nofollow     = null;
		$indexable->is_robots_noarchive    = null;
		$indexable->is_robots_noimageindex = null;
		$indexable->is_robots_nosnippet    = null;

		return $indexable;
	}

	/**
	 * Retrieves the meta data for this indexable.
	 *
	 * @param int $user_id The user to retrieve the meta data for.
	 *
	 * @return array List of meta entries.
	 */
	protected function get_meta_data( $user_id ) {
		$keys = [
			'wpseo_title',
			'wpseo_metadesc',
			'wpseo_noindex_author',
		];

		$output = [];
		foreach ( $keys as $key ) {
			$output[ $key ] = $this->get_author_meta( $user_id, $key );
		}

		return $output;
	}

	/**
	 * Retrieves the author meta.
	 *
	 * @param int    $user_id The user to retrieve the indexable for.
	 * @param string $key     The meta entry to retrieve.
	 *
	 * @return string The value of the meta field.
	 */
	protected function get_author_meta( $user_id, $key ) {
		$value = \get_the_author_meta( $key, $user_id );
		if ( \is_string( $value ) && $value === '' ) {
			return null;
		}

		return $value;
	}
}

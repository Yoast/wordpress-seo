<?php

namespace Yoast\WP\SEO\Helpers;

use WP_Error;
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
				return $this->get_permalink_for_post( $indexable->object_sub_type, $indexable->object_id );
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
	 * Retrieves the permalink for a post with the given post type and ID.
	 *
	 * @param string $post_type The post type.
	 * @param int    $post_id   The post ID.
	 *
	 * @return WP_Error|string|false The permalink.
	 */
	public function get_permalink_for_post( $post_type, $post_id ) {
		if ( $post_type !== 'attachment' ) {
			return \get_permalink( $post_id );
		}

		return \wp_get_attachment_url( $post_id );
	}
}

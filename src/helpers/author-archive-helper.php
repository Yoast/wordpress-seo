<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * A helper object for author archives.
 */
class Author_Archive_Helper {

	/**
	 * Gets the array of post types that are shown on an author's archive.
	 *
	 * @return array The post types that are shown on an author's archive.
	 */
	public function get_author_archive_post_types() {
		$default_post_types = [ 'post' ];
		/**
		 * Filters the array of post types that are shown on an author's archive.
		 *
		 * @param array $args The post types that are shown on an author archive.
		 */
		$post_types = \apply_filters( 'wpseo_author_archive_post_types', $default_post_types );

		if ( ! is_array( $post_types ) ) {
			return $default_post_types;
		}

		return $post_types;
	}

	/**
	 * Returns whether the author has at least one public post.
	 *
	 * @param int $author_id The author ID.
	 *
	 * @return bool|null Whether the author has at least one public post.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 17.9
	 */
	public function author_has_public_posts( $author_id ) {
		\_deprecated_function( __METHOD__, '17.9', esc_html( Indexable_Repository::class ) . '::query_where_noindex' );
		// First check if the author has at least one public post.
		$has_public_post = $this->author_has_a_public_post( $author_id );
		if ( $has_public_post ) {
			return true;
		}

		// Then check if the author has at least one post where the status is the same as the global setting.
		$has_public_post_depending_on_the_global_setting = $this->author_has_a_post_with_is_public_null( $author_id );
		if ( $has_public_post_depending_on_the_global_setting ) {
			return null;
		}

		return false;
	}

	/**
	 * Returns whether the author has at least one public post.
	 *
	 * @codeCoverageIgnore It looks for the first ID through the ORM and converts it to a boolean.
	 *
	 * @param int $author_id The author ID.
	 *
	 * @return bool Whether the author has at least one public post.
	 *
	 * @deprecated         17.9
	 */
	protected function author_has_a_public_post( $author_id ) {
		$cache_key        = 'author_has_a_public_post_' . $author_id;
		$indexable_exists = \wp_cache_get( $cache_key );

		if ( $indexable_exists === false ) {
			$indexable_exists = Model::of_type( 'Indexable' )
				->select( 'id' )
				->where( 'object_type', 'post' )
				->where_in( 'object_sub_type', $this->get_author_archive_post_types() )
				->where( 'author_id', $author_id )
				->where( 'is_public', 1 )
				->find_one();

			if ( $indexable_exists === false ) {
				// Cache no results to prevent full table scanning on authors with no public posts.
				\wp_cache_set( $cache_key, 0, '', \wp_rand( ( 2 * \HOUR_IN_SECONDS ), ( 4 * \HOUR_IN_SECONDS ) ) );
			}
		}

		return (bool) $indexable_exists;
	}

	/**
	 * Returns whether the author has at least one post with the is public null.
	 *
	 * @codeCoverageIgnore It looks for the first ID through the ORM and converts it to a boolean.
	 *
	 * @param int $author_id The author ID.
	 *
	 * @return bool Whether the author has at least one post with the is public null.
	 *
	 * @deprecated         17.9
	 */
	protected function author_has_a_post_with_is_public_null( $author_id ) {
		$cache_key        = 'author_has_a_post_with_is_public_null_' . $author_id;
		$indexable_exists = \wp_cache_get( $cache_key );

		if ( $indexable_exists === false ) {
			$indexable_exists = Model::of_type( 'Indexable' )
				->select( 'id' )
				->where( 'object_type', 'post' )
				->where_in( 'object_sub_type', $this->get_author_archive_post_types() )
				->where( 'author_id', $author_id )
				->where_null( 'is_public' )
				->find_one();

			if ( $indexable_exists === false ) {
				// Cache no results to prevent full table scanning on authors with no is public null posts.
				\wp_cache_set( $cache_key, 0, '', \wp_rand( ( 2 * \HOUR_IN_SECONDS ), ( 4 * \HOUR_IN_SECONDS ) ) );
			}
		}

		return (bool) $indexable_exists;
	}
}

<?php
/**
 * A helper object for author archives.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\Lib\Model;

/**
 * Class Author_Archive_Helper
 */
class Author_Archive_Helper {

	/**
	 * Gets the array of post types that are shown on an author's archive.
	 *
	 * @return array The post types that are shown on an author's archive.
	 */
	public function get_author_archive_post_types() {
		/**
		 * Filters the array of post types that are shown on an author's archive.
		 *
		 * @param array $args The post types that are shown on an author archive.
		 */
		return \apply_filters( 'wpseo_author_archive_post_types', [ 'post' ] );
	}

	/**
	 * Returns whether the author has at least one public post.
	 *
	 * @param int $author_id The author ID.
	 *
	 * @return bool Whether the author has at least one public post.
	 */
	public function author_has_public_posts( $author_id ) {
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
	 * @param int $author_id The author ID.
	 *
	 * @codeCoverageIgnore It only performs a count query through the ORM and converts it to a boolean.
	 *
	 * @return bool Whether the author has at least one public post.
	 */
	protected function author_has_a_public_post( $author_id ) {
		$indexable_exists = Model::of_type( 'Indexable' )
			->where( 'object_type', 'post' )
			->where_in( 'object_sub_type', $this->get_author_archive_post_types() )
			->where( 'author_id', $author_id )
			->where( 'is_public', 1 )
			->limit( 1 )
			->count();

		return $indexable_exists > 0;
	}

	/**
	 * Returns whether the author has at least one post with the is public null.
	 *
	 * @param int $author_id The author ID.
	 *
	 * @codeCoverageIgnore It only performs a count query through the ORM and converts it to a boolean.
	 *
	 * @return bool Whether the author has at least one post with the is public null.
	 */
	protected function author_has_a_post_with_is_public_null( $author_id ) {
		$indexable_exists = Model::of_type( 'Indexable' )
			->where( 'object_type', 'post' )
			->where_in( 'object_sub_type', $this->get_author_archive_post_types() )
			->where( 'author_id', $author_id )
			->where_null( 'is_public' )
			->limit( 1 )
			->count();

		return $indexable_exists > 0;
	}
}

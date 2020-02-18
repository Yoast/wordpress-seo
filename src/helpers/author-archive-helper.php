<?php
/**
 * A helper object for author archives.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\ORM\Yoast_Model;

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
	 * Returns whether the author has public posts.
	 *
	 * @param int $author_id The author ID.
	 *
	 * @return bool Whether the author has a public post.
	 */
	public function author_has_public_posts( $author_id ) {
		$indexable = Yoast_Model::of_type( 'Indexable' )
			->where( 'object_type', 'post' )
			->where_in( 'object_sub_type', $this->get_author_archive_post_types() )
			->where( 'author_id', $author_id )
			->where( 'is_public', 1 )
			->find_one();

		return $indexable !== false;
	}
}

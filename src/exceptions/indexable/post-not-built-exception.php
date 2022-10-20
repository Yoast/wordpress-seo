<?php

namespace Yoast\WP\SEO\Exceptions\Indexable;

/**
 * Exception that is thrown whenever a post could not be built
 * in the context of the indexables.
 */
class Post_Not_Built_Exception extends Not_Built_Exception {

	/**
	 * Throws an exception if the post is not viewable.
	 *
	 * @param int $post_id ID of the term.
	 *
	 * @throws Post_Not_Built_Exception When the post is not found.
	 */
	public static function because_not_viewable( $post_id ) {
		/* translators: %s: expands to the term id */
		return new Post_Not_Built_Exception( sprintf( __( 'The post %s could not be built because it\'s not viewable.', 'wordpress-seo' ), $post_id ) );
	}
}

<?php
/**
 * Exception to use when an indexable is not found.
 *
 * @package Yoast\YoastSEO\Exceptions
 */

namespace Yoast\YoastSEO\Exceptions;

/**
 * The exception when no indexable could be found.
 */
class No_Indexable_Found extends \OutOfRangeException {

	/**
	 * Returns an exception when an indexable for a post is not found.
	 *
	 * @param integer $post_id Post id for the non existing indexable.
	 *
	 * @return No_Indexable_Found The exception.
	 */
	public static function from_post_id( $post_id ) {
		return new self( 'No indexable found for the supplied arguments' );
	}

	/**
	 * Returns an exception when an indexable for a post is not found.
	 *
	 * @param int    $term_id     The term the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 *
	 * @return No_Indexable_Found The exception.
	 */
	public static function from_term_id( $term_id, $taxonomy ) {
		return new self( 'No indexable found for supplied arguments' );
	}

	/**
	 * Returns an exception when an indexable for a post is not found.
	 *
	 * @param integer                $post_id  The post id.
	 * @param string|\stdClass|\WP_Taxonomy $taxonomy The taxonomy for the given Post ID.
	 *
	 * @return No_Indexable_Found The exception.
	 */
	public static function from_primary_term( $post_id, $taxonomy ) {
		return new self( 'No indexable found for supplied arguments' );
	}

	/**
	 * Returns an exception when an indexable for a post is not found.
	 *
	 * @param int $user_id The user to retrieve the indexable for.
	 *
	 * @return No_Indexable_Found The exception.
	 */
	public static function from_author_id( $user_id ) {
		return new self( 'No indexable found for supplied arguments' );
	}

	/**
	 * Returns an exception when an indexable meta for an indexable is not found.
	 *
	 * @param string $meta_key     The meta key.
	 * @param int    $indexable_id The id of the indexable.
	 *
	 * @return No_Indexable_Found The exception.
	 */
	public static function from_meta_key( $meta_key, $indexable_id ) {
		return new self( 'No indexable found for supplied arguments' );

	}

}

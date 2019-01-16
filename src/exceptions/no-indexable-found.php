<?php
/**
 * Exception to use when an indexable is not found.
 *
 * @package Yoast\YoastSEO\Exceptions
 */

namespace Yoast\WP\Free\Exceptions;

use Yoast\WP\Free\Loggers\Logger;

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
		$message = \sprintf(
			/* translators: %1$s expands to the post id */
			\__( 'There is no indexable found for post id %1$s.', 'wordpress-seo' ),
			$post_id
		);

		return self::create_and_log_exception( $message );
	}

	/**
	 * Returns an exception when an indexable for a taxonomy is not found.
	 *
	 * @param int    $term_id     The term the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 *
	 * @return No_Indexable_Found The exception.
	 */
	public static function from_term_id( $term_id, $taxonomy ) {
		$message = \sprintf(
			/* translators: 1: expands to the term id. 2: expand to the taxonomy  */
			\__( 'There is no indexable found for term id %1$s and taxonomy %2$s.', 'wordpress-seo' ),
			$term_id,
			$taxonomy
		);

		return self::create_and_log_exception( $message );
	}

	/**
	 * Returns an exception when the primary key for an post-taxonomy combination is not found.
	 *
	 * @param integer $post_id  The post id.
	 * @param string  $taxonomy The taxonomy for the given Post ID.
	 *
	 * @return No_Indexable_Found The exception.
	 */
	public static function from_primary_term( $post_id, $taxonomy ) {
		$message = \sprintf(
			/* translators: 1: expands to the term id. 2: expand to the taxonomy  */
			\__( 'There is no primary term found for post id %1$s and taxonomy %2$s.', 'wordpress-seo' ),
			$post_id,
			$taxonomy
		);

		return self::create_and_log_exception( $message );
	}

	/**
	 * Returns an exception when an indexable for an author is not found.
	 *
	 * @param int $user_id The user to retrieve the indexable for.
	 *
	 * @return No_Indexable_Found The exception.
	 */
	public static function from_author_id( $user_id ) {
		$message = \sprintf(
			/* translators: 1: expands to the author id */
			\__( 'There is no indexable found for author id %1$s.', 'wordpress-seo' ),
			$user_id
		);

		return self::create_and_log_exception( $message );
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
		$message = \sprintf(
			/* translators: 1: expands to the indexable id. 2: expand to the meta key */
			\__( 'There is no meta found for indexable id %1$s and meta key %2$s.', 'wordpress-seo' ),
			$indexable_id,
			$meta_key
		);

		return self::create_and_log_exception( $message );
	}

	/**
	 * Creates an exception and logs the error message.
	 *
	 * @param string $message The error message.
	 *
	 * @return No_Indexable_Found Instance of the exception.
	 */
	protected static function create_and_log_exception( $message ) {
		Logger::get_logger()->notice( $message );

		return new self( $message );
	}
}

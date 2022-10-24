<?php

namespace Yoast\WP\SEO\Exceptions\Indexable;

/**
 * Exception that is thrown whenever a term could not be built
 * in the context of the indexables.
 */
class Term_Not_Built_Exception extends Not_Built_Exception {

	/**
	 * Throws an exception if the term is not viewable.
	 *
	 * @param int $term_id ID of the term.
	 *
	 * @throws Term_Not_Built_Exception When the term is not built.
	 */
	public static function because_not_viewable( $term_id ) {
		/* translators: %s: expands to the term id */
		return new Term_Not_Built_Exception( sprintf( __( 'The term %s could not be built because it\'s not viewable.', 'wordpress-seo' ), $term_id ) );
	}

	/**
	 * Throws an exception if the term is excluded.
	 *
	 * @param int $term_id ID of the term.
	 *
	 * @throws Term_Not_Built_Exception When the term is not built.
	 */
	public static function because_excluded( $term_id ) {
		/* translators: %s: expands to the term id */
		return new Term_Not_Built_Exception( sprintf( __( 'The term %s could not be built because it\'s excluded by a filter.', 'wordpress-seo' ), $term_id ) );
	}
}

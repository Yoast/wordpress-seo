<?php

namespace Yoast\WP\SEO\Exceptions\Option;

/**
 * Term not found exception class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Exception should not count.
 */
class Term_Not_Found_Exception extends Abstract_Option_Exception {

	/**
	 * Creates exception for a term that was not found.
	 *
	 * @param mixed  $term     The term name, (int) term id or (object) term.
	 * @param string $taxonomy The taxonomy.
	 *
	 * @return static Instance of the exception.
	 */
	public static function for_term( $term, $taxonomy ) {
		$term_name = $term;
		if ( \is_object( $term ) ) {
			$term_name = isset( $term->name ) ? $term->name : \__( 'object', 'wordpress-seo' );
		}

		return new static(
			\sprintf(
			/* translators: %1$s expands to the term ID, slug or name. %2$s expands to the taxonomy name. */
				\__( 'Term (%1$s) for taxonomy (%2$s) was not found.', 'wordpress-seo' ),
				$term_name,
				$taxonomy
			)
		);
	}
}

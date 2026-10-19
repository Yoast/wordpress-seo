<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WP_Error;

/**
 * Checks whether the current user may edit the term behind an indexable.
 *
 * The abilities are gated site-wide by a capability check, but that capability
 * must not grant access to terms the user could not otherwise edit. This
 * checker applies the exact per-term WordPress check, current_user_can( 'edit_term', $id ).
 */
class Term_Access_Checker {

	/**
	 * Ensures the current user may edit the given term.
	 *
	 * @param int $term_id The term ID.
	 *
	 * @return true|WP_Error True when the term is editable, or a 403 error.
	 */
	public function ensure_can_edit( int $term_id ) {
		if ( \current_user_can( 'edit_term', $term_id ) ) {
			return true;
		}

		// Mirrors WP core's rest_cannot_edit wording.
		return new WP_Error(
			'yoast_seo_cannot_edit_term',
			\__( 'Sorry, you are not allowed to edit this term.', 'wordpress-seo' ),
			[ 'status' => 403 ],
		);
	}
}

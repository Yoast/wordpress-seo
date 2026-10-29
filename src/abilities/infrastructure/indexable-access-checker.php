<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WP_Error;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Checks whether the current user may edit the post or term behind an indexable.
 *
 * The abilities are gated site-wide by a capability check, but that capability
 * must not grant access to objects the user could not otherwise edit. This
 * checker applies the exact per-object WordPress check, current_user_can( 'edit_post', $id )
 * or current_user_can( 'edit_term', $id ).
 */
class Indexable_Access_Checker {

	/**
	 * Ensures the current user may edit the object behind the given indexable.
	 *
	 * @param Indexable $indexable The post or term indexable.
	 *
	 * @return true|WP_Error True when the object is editable, or a 403 error.
	 */
	public function ensure_can_edit( Indexable $indexable ) {
		$is_term    = ( $indexable->object_type === 'term' );
		$capability = ( $is_term ) ? 'edit_term' : 'edit_post';

		if ( \current_user_can( $capability, (int) $indexable->object_id ) ) {
			return true;
		}

		// Mirrors WP core's rest_cannot_edit wording, with a whole sentence per type so it can be translated.
		if ( $is_term ) {
			return new WP_Error(
				'yoast_seo_cannot_edit_term',
				\__( 'Sorry, you are not allowed to edit this term.', 'wordpress-seo' ),
				[ 'status' => 403 ],
			);
		}

		return new WP_Error(
			'yoast_seo_cannot_edit_post',
			\__( 'Sorry, you are not allowed to edit this post.', 'wordpress-seo' ),
			[ 'status' => 403 ],
		);
	}
}

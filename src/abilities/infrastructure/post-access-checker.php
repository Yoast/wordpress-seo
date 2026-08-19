<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure;

use WP_Error;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Checks whether the current user may edit the posts behind indexables.
 *
 * The abilities are gated site-wide by a capability check, but that capability
 * must not grant access to posts the user could not otherwise edit. This
 * checker applies the exact per-post WordPress check, current_user_can( 'edit_post', $id ),
 * mirroring the bulk editor's access rules.
 */
class Post_Access_Checker {

	/**
	 * Ensures the current user may edit the given post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return true|WP_Error True when the post is editable, or a 403 error.
	 */
	public function ensure_can_edit( int $post_id ) {
		if ( \current_user_can( 'edit_post', $post_id ) ) {
			return true;
		}

		return $this->forbidden_error();
	}

	/**
	 * Builds the 403 error for posts the current user may not edit.
	 *
	 * Mirrors WP core's rest_cannot_edit wording.
	 *
	 * @return WP_Error The forbidden error.
	 */
	public function forbidden_error(): WP_Error {
		return new WP_Error(
			'yoast_seo_cannot_edit_post',
			\__( 'Sorry, you are not allowed to edit this post.', 'wordpress-seo' ),
			[ 'status' => 403 ],
		);
	}

	/**
	 * Filters a list of post indexables down to the ones the current user may edit.
	 *
	 * @param Indexable[] $indexables The post indexables.
	 *
	 * @return Indexable[] The editable indexables, reindexed.
	 */
	public function filter_editable( array $indexables ): array {
		$editable = \array_filter(
			$indexables,
			static function ( $indexable ) {
				return \current_user_can( 'edit_post', (int) $indexable->object_id );
			},
		);

		return \array_values( $editable );
	}
}

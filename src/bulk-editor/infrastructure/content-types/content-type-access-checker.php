<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types;

use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Type_Access_Checker_Interface;

/**
 * Checks the current user's editing rights for a content type through the WordPress APIs.
 *
 * For post types that map meta capabilities, the editing primitives (edit_posts, edit_published_posts,
 * edit_others_posts) are used. For post types that do not, WordPress maps editing straight to the singular
 * edit_post capability and never registers those primitives, so that single capability is used instead.
 */
class Content_Type_Access_Checker implements Content_Type_Access_Checker_Interface {

	/**
	 * Whether the current user can edit at least one post of the content type.
	 *
	 * @param string $content_type The content type (post type name).
	 *
	 * @return bool Whether the current user can edit at least one post of the content type.
	 */
	public function can_edit_any( string $content_type ): bool {
		$post_type_object = \get_post_type_object( $content_type );
		if ( $post_type_object === null ) {
			return false;
		}

		if ( ! $post_type_object->map_meta_cap ) {
			return \current_user_can( $post_type_object->cap->edit_post );
		}

		return \current_user_can( $post_type_object->cap->edit_posts )
			|| \current_user_can( $post_type_object->cap->edit_published_posts )
			|| \current_user_can( $post_type_object->cap->edit_others_posts );
	}

	/**
	 * Whether the current user can edit other users' posts of the content type.
	 *
	 * @param string $content_type The content type (post type name).
	 *
	 * @return bool Whether the current user can edit other users' posts of the content type.
	 */
	public function can_edit_others( string $content_type ): bool {
		$post_type_object = \get_post_type_object( $content_type );
		if ( $post_type_object === null ) {
			return false;
		}

		if ( ! $post_type_object->map_meta_cap ) {
			return \current_user_can( $post_type_object->cap->edit_post );
		}

		return \current_user_can( $post_type_object->cap->edit_others_posts );
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Bulk_Editor\Infrastructure\Content_Types;

use Yoast\WP\SEO\Bulk_Editor\Application\Content_Types\Content_Type_Access_Checker_Interface;

/**
 * Checks the current user's editing rights for a content type through the WordPress APIs.
 *
 * The primitive capabilities (edit_posts, edit_published_posts, edit_others_posts) are used for
 * every post type, mirroring what WordPress itself checks before showing a post type's edit
 * screen. The singular edit_post capability is never checked here: it is a meta capability that
 * requires a post ID, and passing it without one triggers "Undefined array key 0" warnings on
 * every request in plugins - such as bbPress and BuddyBoss - that map their own meta capabilities
 * for post types registered with `map_meta_cap` set to false.
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
			return \current_user_can( $post_type_object->cap->edit_posts );
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

		return \current_user_can( $post_type_object->cap->edit_others_posts );
	}
}

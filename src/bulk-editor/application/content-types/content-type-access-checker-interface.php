<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Bulk_Editor\Application\Content_Types;

/**
 * Describes the current user's editing rights for a content type.
 */
interface Content_Type_Access_Checker_Interface {

	/**
	 * Whether the current user can edit at least one post of the content type.
	 *
	 * This is a content-type-level check used to decide whether the type is offered at all;
	 * the per-post edit permission is enforced separately when the posts are collected.
	 *
	 * @param string $content_type The content type (post type name).
	 *
	 * @return bool Whether the current user can edit at least one post of the content type.
	 */
	public function can_edit_any( string $content_type ): bool;

	/**
	 * Whether the current user can edit other users' posts of the content type.
	 *
	 * Used to scope the query to the user's own posts when they cannot edit other authors' posts,
	 * which keeps pagination cheap before the exact per-post check runs on the page.
	 *
	 * @param string $content_type The content type (post type name).
	 *
	 * @return bool Whether the current user can edit other users' posts of the content type.
	 */
	public function can_edit_others( string $content_type ): bool;
}

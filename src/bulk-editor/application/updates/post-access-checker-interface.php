<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Updates;

/**
 * Describes what the bulk updater needs to know about a post before updating it.
 */
interface Post_Access_Checker_Interface {

	/**
	 * Whether the post exists.
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Whether the post exists.
	 */
	public function exists( int $post_id ): bool;

	/**
	 * Whether the post is of a type the bulk editor supports.
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Whether the post is of a supported type.
	 */
	public function is_supported_type( int $post_id ): bool;

	/**
	 * Whether the current user is allowed to edit the post.
	 *
	 * @param int $post_id The ID of the post.
	 *
	 * @return bool Whether the current user is allowed to edit the post.
	 */
	public function can_edit( int $post_id ): bool;
}

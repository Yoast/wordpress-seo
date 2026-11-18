<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Domain\Updates;

/**
 * This class holds the error codes an update can fail with.
 */
class Update_Error {

	/**
	 * The current user is not allowed to edit the post.
	 */
	public const FORBIDDEN = 'forbidden';

	/**
	 * The post does not exist.
	 */
	public const NOT_FOUND = 'not_found';

	/**
	 * The post type is not supported by the bulk editor.
	 */
	public const INVALID_POST_TYPE = 'invalid_post_type';

	/**
	 * Saving the update failed.
	 */
	public const SAVE_FAILED = 'save_failed';
}

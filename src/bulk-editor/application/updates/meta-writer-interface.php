<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Updates;

/**
 * Describes how the bulk updater persists a title and description for a post.
 *
 * Do not type-hint this interface in constructors: it has multiple implementations,
 * so the DI container cannot alias it. Type-hint a channel-specific child interface instead.
 */
interface Meta_Writer_Interface {

	/**
	 * Writes the title for a post.
	 *
	 * @param int    $post_id The ID of the post.
	 * @param string $title   The title to write.
	 *
	 * @return void
	 */
	public function write_title( int $post_id, string $title ): void;

	/**
	 * Writes the description for a post.
	 *
	 * @param int    $post_id     The ID of the post.
	 * @param string $description The description to write.
	 *
	 * @return void
	 */
	public function write_description( int $post_id, string $description ): void;
}

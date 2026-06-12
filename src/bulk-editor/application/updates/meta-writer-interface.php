<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Bulk_Editor\Application\Updates;

use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Type;

/**
 * Describes how the bulk updater persists a title, description and focus keyphrase for a post.
 */
interface Meta_Writer_Interface {

	/**
	 * Writes the title for a post.
	 *
	 * @param Update_Type $type    The appearance the title belongs to.
	 * @param int         $post_id The ID of the post.
	 * @param string      $title   The title to write.
	 *
	 * @return void
	 */
	public function write_title( Update_Type $type, int $post_id, string $title ): void;

	/**
	 * Writes the description for a post.
	 *
	 * @param Update_Type $type        The appearance the description belongs to.
	 * @param int         $post_id     The ID of the post.
	 * @param string      $description The description to write.
	 *
	 * @return void
	 */
	public function write_description( Update_Type $type, int $post_id, string $description ): void;

	/**
	 * Writes the focus keyphrase for a post. The focus keyphrase is channel-agnostic,
	 * so it does not depend on the update type.
	 *
	 * @param int    $post_id         The ID of the post.
	 * @param string $focus_keyphrase The focus keyphrase to write.
	 *
	 * @return void
	 */
	public function write_focus_keyphrase( int $post_id, string $focus_keyphrase ): void;
}

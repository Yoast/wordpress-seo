<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Llms_Txt\Domain\Content;

use Yoast\WP\SEO\Llms_Txt\Domain\Content_Types\Content_Type_Entry;

/**
 * Describes the post collection interface.
 */
interface Post_Collection_Interface {

	/**
	 * Gets the posts that are relevant for the LLMs.txt.
	 *
	 * @param string $post_type The post type.
	 * @param int    $limit     The maximum number of posts to return.
	 *
	 * @return array<int, array<Content_Type_Entry>> The posts that are relevant for the LLMs.txt.
	 */
	public function get_posts( string $post_type, int $limit ): array;
}

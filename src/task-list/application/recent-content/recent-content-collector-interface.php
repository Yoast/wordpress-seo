<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Application\Recent_Content;

use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;
use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;

/**
 * Interface for collectors that retrieve recent content items for the task list.
 */
interface Recent_Content_Collector_Interface {

	/**
	 * Gets recent content items with SEO scores for the given post type.
	 *
	 * @param string   $post_type  The post type to query.
	 * @param string   $date_limit The date limit (content modified after this date).
	 * @param int|null $limit      Optional. Maximum number of items to retrieve.
	 *
	 * @return Content_Item_Score_Data[] Array of content item score data value objects.
	 */
	public function get_recent_content_with_seo_scores( string $post_type, string $date_limit, ?int $limit = null ): array;

	/**
	 * Gets recent content items with readability scores for the given post type.
	 *
	 * @param string   $post_type  The post type to query.
	 * @param string   $date_limit The date limit (content modified after this date).
	 * @param int|null $limit      Optional. Maximum number of items to retrieve.
	 *
	 * @return Content_Item_Score_Data[] Array of content item score data value objects.
	 */
	public function get_recent_content_with_readability_scores( string $post_type, string $date_limit, ?int $limit = null ): array;

	/**
	 * Gets recent content items for the meta descriptions task for the given post type.
	 *
	 * @param string   $post_type  The post type to query.
	 * @param string   $date_limit The date limit (content modified after this date).
	 * @param int|null $limit      Optional. Maximum number of items to retrieve.
	 *
	 * @return Meta_Description_Content_Item_Data[] Array of content item data value objects.
	 */
	public function get_recent_content_for_meta_descriptions( string $post_type, string $date_limit, ?int $limit = null ): array;
}

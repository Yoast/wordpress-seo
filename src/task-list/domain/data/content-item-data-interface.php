<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Data;

/**
 * Interface for content item data objects used in child tasks.
 */
interface Content_Item_Data_Interface {

	/**
	 * Returns the content item ID.
	 *
	 * @return int
	 */
	public function get_content_id(): int;

	/**
	 * Returns the content item title.
	 *
	 * @return string
	 */
	public function get_title(): string;
}

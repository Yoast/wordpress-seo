<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Data;

/**
 * Value object representing content item data for the improve default meta descriptions task.
 */
class Meta_Description_Content_Item_Data implements Content_Item_Data_Interface {

	/**
	 * The content item ID.
	 *
	 * @var int
	 */
	private $content_id;

	/**
	 * The content item title.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * Whether the content item has a custom meta description.
	 *
	 * @var bool
	 */
	private $has_description;

	/**
	 * Constructs the content item data.
	 *
	 * @param int    $content_id      The content item ID.
	 * @param string $title           The content item title.
	 * @param bool   $has_description Whether the content item has a custom meta description.
	 */
	public function __construct( int $content_id, string $title, bool $has_description ) {
		$this->content_id      = $content_id;
		$this->title           = $title;
		$this->has_description = $has_description;
	}

	/**
	 * Returns the content item ID.
	 *
	 * @return int
	 */
	public function get_content_id(): int {
		return $this->content_id;
	}

	/**
	 * Returns the content item title.
	 *
	 * @return string
	 */
	public function get_title(): string {
		return $this->title;
	}

	/**
	 * Returns whether the content item has a custom meta description.
	 *
	 * @return bool
	 */
	public function has_description(): bool {
		return $this->has_description;
	}
}

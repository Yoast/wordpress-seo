<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Data;

/**
 * Value object representing content item data for the improve default meta descriptions task.
 */
class Meta_Description_Content_Item_Data {

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
	 * Constructs the content item data.
	 *
	 * @param int    $content_id The content item ID.
	 * @param string $title      The content item title.
	 */
	public function __construct( int $content_id, string $title ) {
		$this->content_id = $content_id;
		$this->title      = $title;
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
}

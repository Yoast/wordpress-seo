<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Data;

/**
 * Value object representing content item data for OpenGraph image tasks.
 */
class Content_Item_OG_Image_Data {

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
	 * The OpenGraph image URL.
	 *
	 * @var string|null
	 */
	private $open_graph_image;

	/**
	 * The content type (post type).
	 *
	 * @var string
	 */
	private $content_type;

	/**
	 * Constructs the content item data.
	 *
	 * @param int         $content_id       The content item ID.
	 * @param string      $title            The content item title.
	 * @param string|null $open_graph_image The OpenGraph image URL.
	 * @param string      $content_type     The content type.
	 */
	public function __construct( int $content_id, string $title, ?string $open_graph_image, string $content_type ) {
		$this->content_id       = $content_id;
		$this->title            = $title;
		$this->open_graph_image = $open_graph_image;
		$this->content_type     = $content_type;
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
	 * Returns the OpenGraph image URL.
	 *
	 * @return string|null
	 */
	public function get_open_graph_image(): ?string {
		return $this->open_graph_image;
	}

	/**
	 * Returns the content type.
	 *
	 * @return string
	 */
	public function get_content_type(): string {
		return $this->content_type;
	}

	/**
	 * Returns whether the content item has an OpenGraph image set.
	 *
	 * @return bool
	 */
	public function has_og_image(): bool {
		return $this->open_graph_image !== null && $this->open_graph_image !== '';
	}
}

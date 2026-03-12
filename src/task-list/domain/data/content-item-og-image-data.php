<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Data;

/**
 * Value object representing content item data for OpenGraph image tasks.
 */
class Content_Item_OG_Image_Data {

	/**
	 * Image sources that count as having a valid OG image.
	 *
	 * @var string[]
	 */
	private const VALID_IMAGE_SOURCES = [
		'set-by-user',
		'featured-image',
	];

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
	 * The OpenGraph image source.
	 *
	 * @var string|null
	 */
	private $open_graph_image_source;

	/**
	 * The content type (post type).
	 *
	 * @var string
	 */
	private $content_type;

	/**
	 * Constructs the content item data.
	 *
	 * @param int         $content_id              The content item ID.
	 * @param string      $title                   The content item title.
	 * @param string|null $open_graph_image_source The OpenGraph image source.
	 * @param string      $content_type            The content type.
	 */
	public function __construct( int $content_id, string $title, ?string $open_graph_image_source, string $content_type ) {
		$this->content_id              = $content_id;
		$this->title                   = $title;
		$this->open_graph_image_source = $open_graph_image_source;
		$this->content_type            = $content_type;
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
	 * Returns the OpenGraph image source.
	 *
	 * @return string|null
	 */
	public function get_open_graph_image_source(): ?string {
		return $this->open_graph_image_source;
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
	 * Returns whether the content item has a valid OpenGraph image set.
	 *
	 * Only explicitly set images and featured images count as valid.
	 *
	 * @return bool
	 */
	public function has_og_image(): bool {
		return \in_array( $this->open_graph_image_source, self::VALID_IMAGE_SOURCES, true );
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Data;

/**
 * Value object representing content item data for SEO improvement tasks.
 */
class Content_Item_Data {

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
	 * The SEO score of the content item.
	 *
	 * @var int
	 */
	private $seo_score;

	/**
	 * The content type (post type).
	 *
	 * @var string
	 */
	private $content_type;

	/**
	 * Constructs the content item data.
	 *
	 * @param int    $content_id   The content item ID.
	 * @param string $title        The content item title.
	 * @param int    $seo_score    The SEO score.
	 * @param string $content_type The content type.
	 */
	public function __construct( int $content_id, string $title, int $seo_score, string $content_type = '' ) {
		$this->content_id   = $content_id;
		$this->title        = $title;
		$this->seo_score    = $seo_score;
		$this->content_type = $content_type;
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
	 * Returns the SEO score.
	 *
	 * @return int
	 */
	public function get_seo_score(): int {
		return $this->seo_score;
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
	 * Returns whether the content item has a good SEO score (above 70).
	 *
	 * @return bool
	 */
	public function has_good_seo_score(): bool {
		return $this->seo_score > 70;
	}
}

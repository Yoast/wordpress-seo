<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Data;

use Yoast\WP\SEO\Dashboard\Domain\Score_Groups\Score_Groups_Interface;

/**
 * Value object representing content item data for score-based improvement tasks.
 */
class Content_Item_Score_Data {

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
	 * The score group of the content item.
	 *
	 * @var Score_Groups_Interface
	 */
	private $score_group;

	/**
	 * The content type (post type).
	 *
	 * @var string
	 */
	private $content_type;

	/**
	 * Constructs the content item data.
	 *
	 * @param int                    $content_id   The content item ID.
	 * @param string                 $title        The content item title.
	 * @param Score_Groups_Interface $score_group  The score group.
	 * @param string                 $content_type The content type.
	 */
	public function __construct( int $content_id, string $title, Score_Groups_Interface $score_group, string $content_type ) {
		$this->content_id   = $content_id;
		$this->title        = $title;
		$this->score_group  = $score_group;
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
	 * Returns the score.
	 *
	 * @return string
	 */
	public function get_score(): string {
		return $this->score_group->get_name();
	}

	/**
	 * Returns the score group.
	 *
	 * @return Score_Groups_Interface
	 */
	public function get_score_group(): Score_Groups_Interface {
		return $this->score_group;
	}

	/**
	 * Returns the content type.
	 *
	 * @return string
	 */
	public function get_content_type(): string {
		return $this->content_type;
	}
}

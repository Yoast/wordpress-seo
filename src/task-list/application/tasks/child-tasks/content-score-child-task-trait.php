<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;

/**
 * Trait for content-item-score-based child task functionality.
 * Provides shared implementations for child tasks that use Content_Item_Score_Data.
 */
trait Content_Score_Child_Task_Trait {

	/**
	 * The content item score data.
	 *
	 * @var Content_Item_Score_Data
	 */
	protected $content_item_score_data;

	/**
	 * Constructs the task.
	 *
	 * @param Parent_Task_Interface   $parent_task             The parent task.
	 * @param Content_Item_Score_Data $content_item_score_data The content item score data.
	 */
	public function __construct(
		Parent_Task_Interface $parent_task,
		Content_Item_Score_Data $content_item_score_data
	) {
		$this->parent_task             = $parent_task;
		$this->content_item_score_data = $content_item_score_data;
	}

	/**
	 * Returns the task ID.
	 *
	 * @return string
	 */
	public function get_id(): string {
		return $this->parent_task->get_id() . '-' . $this->content_item_score_data->get_content_id();
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		if ( $this->is_completed === null ) {
			$this->is_completed = $this->content_item_score_data->get_score() === 'good';
		}

		return $this->is_completed;
	}

	/**
	 * Returns the task's priority.
	 *
	 * @return string
	 */
	public function get_priority(): string {
		// Bad scores get high priority, other scores get medium priority.
		if ( $this->content_item_score_data->get_score() === 'bad' ) {
			return 'high';
		}

		return 'medium';
	}

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string {
		return \get_edit_post_link( $this->content_item_score_data->get_content_id(), '&' );
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return Copy_Set
	 */
	public function get_copy_set(): Copy_Set {
		return new Copy_Set(
			$this->content_item_score_data->get_title(),
			$this->parent_task->get_copy_set()->get_about()
		);
	}
}

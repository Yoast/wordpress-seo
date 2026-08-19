<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Score_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;

/**
 * Trait for content-item-score-based child task functionality.
 * Provides shared implementations for child tasks that use Content_Item_Score_Data.
 */
trait Content_Score_Child_Task_Trait {

	use Child_Task_Trait {
		Child_Task_Trait::__construct as private base_construct;
	}

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
		$this->base_construct( $parent_task, $content_item_score_data );
		$this->content_item_score_data = $content_item_score_data;
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		$this->is_completed ??= $this->content_item_score_data->get_score() === 'good';

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
}

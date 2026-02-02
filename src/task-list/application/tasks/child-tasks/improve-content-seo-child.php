<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_SEO_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Abstract_Child_Task;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;

/**
 * Represents the child task for improving content SEO.
 */
class Improve_Content_SEO_Child extends Abstract_Child_Task {

	/**
	 * Holds the duration.
	 *
	 * @var int
	 */
	protected $duration = 10;

	/**
	 * The content item SEO data.
	 *
	 * @var Content_Item_SEO_Data
	 */
	private $content_item_seo_data;

	/**
	 * Constructs the task.
	 *
	 * @param Parent_Task_Interface $parent_task           The parent task.
	 * @param Content_Item_SEO_Data $content_item_seo_data The content item SEO data.
	 */
	public function __construct(
		Parent_Task_Interface $parent_task,
		Content_Item_SEO_Data $content_item_seo_data
	) {
		$this->parent_task           = $parent_task;
		$this->content_item_seo_data = $content_item_seo_data;
	}

	/**
	 * Returns the task ID.
	 *
	 * @return string
	 */
	public function get_id(): string {
		// @TODO: probably improve this with inheritance.
		return $this->parent_task->get_id() . '-' . $this->content_item_seo_data->get_content_id();
	}

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		return $this->content_item_seo_data->get_seo_score() === 'good';
	}

	/**
	 * Returns the task's priority.
	 *
	 * @return string
	 */
	public function get_priority(): string {
		// Bad SEO scores get high priority, ok scores get medium priority.
		if ( $this->content_item_seo_data->get_seo_score() === 'bad' ) {
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
		return \get_edit_post_link( $this->content_item_seo_data->get_content_id(), '&' );
	}

	/**
	 * Returns the task's call to action entry.
	 *
	 * @return Call_To_Action_Entry|null
	 */
	public function get_call_to_action(): ?Call_To_Action_Entry {
		return new Call_To_Action_Entry(
			\__( 'Improve SEO', 'wordpress-seo' ),
			'link',
			$this->get_link()
		);
	}

	/**
	 * Returns the task's copy set.
	 *
	 * @return Copy_Set
	 */
	public function get_copy_set(): Copy_Set {
		return new Copy_Set(
			$this->content_item_seo_data->get_title(),
			$this->parent_task->get_copy_set()->get_about()
		);
	}
}

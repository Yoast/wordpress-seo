<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Abstract class for a post type task with subtasks.
 * Combines the functionality of both Abstract_Post_Type_Task and Abstract_Task_With_Subtasks.
 */
abstract class Abstract_Child_Task extends Abstract_Task implements Child_Task_Interface {

	/**
	 * The parent task associated with the task.
	 *
	 * @var Parent_Task_Interface
	 */
	protected $parent_task;

	/**
	 * Returns the parent task associated with the task.
	 *
	 * @return Parent_Task_Interface
	 */
	public function get_parent_task(): Parent_Task_Interface {
		return $this->parent_task;
	}

	/**
	 * Sets the parent task associated with the task.
	 *
	 * @param Parent_Task_Interface $parent_task The parent task.
	 *
	 * @return void
	 */
	public function set_parent_task( Parent_Task_Interface $parent_task ): void {
		$this->parent_task = $parent_task;
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool|int> Returns in an array format.
	 */
	public function to_array(): array {
		$data = parent::to_array();

		$data['parentTaskId'] = $this->parent_task->get_id();

		return $data;
	}
}

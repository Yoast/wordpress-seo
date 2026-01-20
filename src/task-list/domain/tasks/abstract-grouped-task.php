<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Abstract class for a post type task with subtasks.
 * Combines the functionality of both Abstract_Post_Type_Task and Abstract_Task_With_Subtasks.
 */
abstract class Abstract_Grouped_Task extends Abstract_Task implements Grouped_Task_Interface {

	/**
	 * The grouped tasks associated with the task.
	 *
	 * @var Task_Group_Interface
	 */
	protected $task_group;

	/**
	 * Returns the grouped tasks associated with the task.
	 *
	 * @return Task_Group_Interface
	 */
	public function get_task_group(): Task_Group_Interface {
		return $this->task_group;
	}

	/**
	 * Sets the grouped tasks associated with the task.
	 *
	 * @param Task_Group_Interface $group The group.
	 *
	 * @return void
	 */
	public function set_task_group( Task_Group_Interface $task_group ): void {
		$this->task_group = $task_group;
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool|int> Returns in an array format.
	 */
	public function to_array(): array {
		$data = parent::to_array();

		$data['taskGroupId'] = $this->task_group->get_id();

		return $data;
	}
}

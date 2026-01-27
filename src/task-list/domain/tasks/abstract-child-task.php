<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Abstract class for a child task.
 * Use this when you need a task that belongs to a parent task.
 */
abstract class Abstract_Child_Task extends Abstract_Task implements Child_Task_Interface {

	/**
	 * The parent task associated with the task.
	 *
	 * @var Parent_Task_Interface
	 */
	protected $parent_task;

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool|int|array|null> Returns in an array format.
	 */
	public function to_array(): array {
		$data = parent::to_array();

		$data['parentTaskId'] = $this->parent_task->get_id();

		return $data;
	}
}

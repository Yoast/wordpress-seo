<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Abstract class for a parent task (a task with child tasks).
 * Use this when you need a parent task that is NOT a post type task.
 */
abstract class Abstract_Parent_Task extends Abstract_Task implements Parent_Task_Interface {

	use Parent_Task_Trait;

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		$data = parent::to_array();

		return $this->add_parent_task_data( $data );
	}
}

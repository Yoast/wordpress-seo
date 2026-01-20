<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Represents a grouped task.
 */
interface Grouped_Task_Interface extends Task_Interface {

	/**
	 * Returns the task group this task belongs to.
	 *
	 * @return Task_Group_Interface
	 */
	public function get_task_group(): Task_Group_Interface;

	/**
	 * Sets the task group this task belongs to.
	 *
	 * @param Task_Group_Interface $task_group The task group.
	 *
	 * @return void
	 */
	public function set_task_group( Task_Group_Interface $task_group ): void;
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Represents a task with subtasks.
 */
interface Task_Group_Interface extends Task_Interface {

	/**
	 * Returns the grouped tasks associated with the task.
	 *
	 * @return Grouped_Task_Interface[]
	 */
	public function get_grouped_tasks(): array;

	/**
	 * Sets the grouped tasks associated with the task.
	 *
	 * @param Grouped_Task_Interface[] $grouped_tasks The grouped tasks.
	 *
	 * @return void
	 */
	public function set_grouped_tasks( array $grouped_tasks ): void;

	/**
	 * Populates the grouped tasks dynamically.
	 *
	 * @return void
	 */
	public function populate_grouped_tasks(): void;
}

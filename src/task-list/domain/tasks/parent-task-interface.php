<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Represents a parent task.
 */
interface Parent_Task_Interface extends Task_Interface {

	/**
	 * Returns the child tasks associated with the task.
	 *
	 * @return Child_Task_Interface[]
	 */
	public function get_child_tasks(): array;

	/**
	 * Generates the child tasks dynamically.
	 *
	 * @return Child_Task_Interface[] The generated child tasks.
	 */
	public function generate_child_tasks(): array;

	/**
	 * Populates the child tasks.
	 *
	 * @return Child_Task_Interface[] The populated child tasks.
	 */
	public function populate_child_tasks(): array;
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Abstract class for a post type task with subtasks.
 * Combines the functionality of both Abstract_Post_Type_Task and Abstract_Task_With_Subtasks.
 */
abstract class Abstract_Post_Type_Task_Group extends Abstract_Post_Type_Task implements Post_Type_Task_Interface, Task_Group_Interface {

	/**
	 * The grouped tasks associated with the task.
	 *
	 * @var Grouped_Task_Interface[]
	 */
	protected $grouped_tasks = [];

	/**
	 * Returns the grouped tasks associated with the task.
	 *
	 * @return Grouped_Task_Interface[]
	 */
	public function get_grouped_tasks(): array {
		return $this->grouped_tasks;
	}

	/**
	 * Sets the grouped tasks associated with the task.
	 *
	 * @param Grouped_Task_Interface[] $grouped_tasks The grouped tasks.
	 *
	 * @return void
	 */
	public function set_grouped_tasks( array $grouped_tasks ): void {
		$this->grouped_tasks = $grouped_tasks;
	}

	/**
	 * Populates the grouped tasks.
	 * Should be implemented by child classes to dynamically generate grouped tasks.
	 *
	 * @return void
	 */
	abstract public function populate_grouped_tasks(): void;
}

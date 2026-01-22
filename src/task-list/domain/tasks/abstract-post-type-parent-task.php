<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Abstract class for a post type task with subtasks.
 * Combines the functionality of both Abstract_Post_Type_Task and Abstract_Task_With_Subtasks.
 */
abstract class Abstract_Post_Type_Parent_Task extends Abstract_Post_Type_Task implements Post_Type_Task_Interface, Parent_Task_Interface {

	/**
	 * The child tasks associated with the task.
	 *
	 * @var Child_Task_Interface[]
	 */
	protected $child_tasks = [];

	/**
	 * Returns the child tasks associated with the task.
	 *
	 * @return Child_Task_Interface[]
	 */
	public function get_child_tasks(): array {
		return $this->child_tasks;
	}

	/**
	 * Sets the child tasks associated with the task.
	 *
	 * @param Child_Task_Interface[] $child_tasks The child tasks.
	 *
	 * @return void
	 */
	public function set_child_tasks( array $child_tasks ): void {
		$this->child_tasks = $child_tasks;
	}

	/**
	 * Returns whether this task is completed.
	 * The parent task is completed when all child tasks are completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		$child_tasks = $this->get_child_tasks();

		if ( empty( $child_tasks ) ) {
			return true;
		}

		foreach ( $child_tasks as $task ) {
			if ( ! $task->get_is_completed() ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Populates the child tasks.
	 *
	 * @return Child_Task_Interface[].
	 */
	public function generate_child_tasks(): array {
		$child_tasks = $this->populate_child_tasks();

		$this->set_child_tasks( $child_tasks );

		return $child_tasks;
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		$data = parent::to_array();

		$data['parentTask'] = true;

		return $data;
	}
}

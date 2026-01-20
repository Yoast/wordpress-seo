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
	 * Returns whether this task is completed.
	 * The group task is completed when all grouped tasks are completed.
	 *
	 * @return bool Whether this task is completed.
	 */
	public function get_is_completed(): bool {
		$grouped_tasks = $this->get_grouped_tasks();

		if ( empty( $grouped_tasks ) ) {
			return true;
		}

		foreach ( $grouped_tasks as $task ) {
			if ( ! $task->get_is_completed() ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Populates the grouped tasks.
	 *
	 * @return Grouped_Task_Interface[].
	 */
	public function generate_grouped_tasks(): array {
		$grouped_tasks = $this->populate_grouped_tasks();

		$this->set_grouped_tasks( $grouped_tasks );

		return $grouped_tasks;
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		$data = parent::to_array();

		$data['taskGroup'] = true;

		return $data;
	}
}

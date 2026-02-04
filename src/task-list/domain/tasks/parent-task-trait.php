<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Trait for parent task functionality.
 * Provides the implementation for Parent_Task_Interface methods.
 */
trait Parent_Task_Trait {

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
	 * @param Child_Task_Interface[] $child_tasks The child tasks to set.
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
		$child_tasks = $this->child_tasks;

		foreach ( $child_tasks as $task ) {
			if ( ! $task->get_is_completed() ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Generates and sets the child tasks.
	 *
	 * @return Child_Task_Interface[] The generated child tasks.
	 */
	public function generate_child_tasks(): array {
		$this->child_tasks = $this->populate_child_tasks();

		return $this->child_tasks;
	}

	/**
	 * Returns an array representation of the task data.
	 * When used in a class extending Abstract_Task, this will call the parent's to_array()
	 * and add the parent task flag.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		$data = [];

		$parent_class = \get_parent_class( $this );
		if ( $parent_class !== false && \method_exists( $parent_class, 'to_array' ) ) {
			$data = parent::to_array();
		}

		// @TODO: Consider whether this 'parentTask' flag is still necessary, as the frontend doesn't use it.
		$data['parentTask'] = true;

		return $data;
	}
}

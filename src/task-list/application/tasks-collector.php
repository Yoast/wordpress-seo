<?php

namespace Yoast\WP\SEO\Task_List\Application;

use Yoast\WP\SEO\Task_List\Domain\Tasks\Completeable_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Task_Interface;

/**
 * Manages the collection of tasks.
 */
class Tasks_Collector {

	/**
	 * Holds all the tasks.
	 *
	 * @var Task_Interface[]
	 */
	private $tasks;

	/**
	 * Constructs the collector.
	 *
	 * @param Task_Interface ...$tasks All the tasks.
	 */
	public function __construct( Task_Interface ...$tasks ) {
		$tasks_with_id = [];
		foreach ( $tasks as $task ) {
			$tasks_with_id[ $task->get_id() ] = $task;
		}

		$this->tasks = $tasks_with_id;
	}

	/**
	 * Gets a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return Task_Interface The given task.
	 */
	public function get_task( string $task_id ): ?Task_Interface {
		$all_tasks = $this->get_tasks();
		return ( $all_tasks[ $task_id ] ?? null );
	}

	/**
	 * Gets a completeable task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return Task_Interface The given task.
	 */
	public function get_completeable_task( string $task_id ): ?Completeable_Task_Interface {
		$all_tasks = $this->get_tasks();
		$task      = ( $all_tasks[ $task_id ] ?? null );

		if ( ! $task instanceof Completeable_Task_Interface ) {
			return null;
		}

		return $task;
	}

	/**
	 * Gets the tasks.
	 *
	 * @return array<string, array<string, Task_Interface>> The tasks.
	 */
	public function get_tasks(): array {
		/**
		 * Filter: 'wpseo_task_list_tasks' - Allows adding more tasks to the task list.
		 *
		 * @param array<string, array<string, Task_Interface>> $tasks The tasks for the task list.
		 */
		return \apply_filters( 'wpseo_task_list_tasks', $this->tasks );
	}
}

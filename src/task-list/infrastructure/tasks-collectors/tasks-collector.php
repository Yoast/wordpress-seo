<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Invalid_Tasks_Exception;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Completeable_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Post_Type_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Task_Interface;
use Yoast\WP\SEO\Task_List\Infrastructure\Link_Adapter;

/**
 * Manages the collection of tasks.
 */
class Tasks_Collector implements Tasks_Collector_Interface {

	/**
	 * Holds all the tasks.
	 *
	 * @var Task_Interface[]
	 */
	private $tasks;

	/**
	 * Holds the link adapter.
	 *
	 * @var Link_Adapter
	 */
	private $link_adapter;

	/**
	 * Constructs the collector.
	 *
	 * @param Task_Interface ...$tasks All the tasks.
	 */
	public function __construct( Task_Interface ...$tasks ) {
		$tasks_with_id = [];
		foreach ( $tasks as $task ) {
			if ( $task instanceof Post_Type_Task_Interface ) {
				continue;
			}
			$tasks_with_id[ $task->get_id() ] = $task;
		}

		$this->tasks = $tasks_with_id;
	}

	/**
	 * Sets the link adapter.
	 *
	 * @required
	 *
	 * @codeCoverageIgnore - Is handled by DI-container.
	 *
	 * @param Link_Adapter $link_adapter The link adapter.
	 *
	 * @return void
	 */
	public function set_link_adapter( Link_Adapter $link_adapter ) {
		$this->link_adapter = $link_adapter;
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
	 *
	 * @throws Invalid_Tasks_Exception If an invalid task is added.
	 */
	public function get_tasks(): array {
		/**
		 * Filter: 'wpseo_task_list_tasks' - Allows adding more tasks to the task list.
		 *
		 * @param array<string, array<string, Task_Interface>> $tasks The tasks for the task list.
		 */
		$tasks = \apply_filters( 'wpseo_task_list_tasks', $this->tasks );

		// Check that every item is an instance of Post_Type_Task_Interface.
		foreach ( $tasks as $task ) {
			if ( ! $task instanceof Task_Interface ) {
				throw new Invalid_Tasks_Exception();
			}
		}

		return $tasks;
	}

	/**
	 * Gets the tasks data.
	 *
	 * @return array<string, array<string, string|bool>> The tasks data.
	 */
	public function get_tasks_data(): array {
		$tasks      = $this->get_tasks();
		$tasks_data = [];

		foreach ( $tasks as $task ) {
			// We need to enhance the links first.
			$task->set_enhanced_call_to_action(
				new Call_To_Action_Entry(
					$task->get_call_to_action()->get_label(),
					$task->get_call_to_action()->get_type(),
					$this->link_adapter->enhance_link(
						$task->get_call_to_action()->get_href()
					)
				)
			);

			$tasks_data[ $task->get_id() ] = $task->to_array();
		}

		return $tasks_data;
	}
}

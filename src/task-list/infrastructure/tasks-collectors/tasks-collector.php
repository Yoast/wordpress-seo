<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Invalid_Tasks_Exception;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Completeable_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Post_Type_Task_Interface;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Task_Interface;
use Yoast\WP\SEO\Tracking\Infrastructure\Tracking_Link_Adapter;

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
	 * Holds the tracking link adapter.
	 *
	 * @var Tracking_Link_Adapter
	 */
	private $tracking_link_adapter;

	/**
	 * Constructs the collector.
	 *
	 * @param Task_Interface ...$tasks All the tasks.
	 */
	public function __construct( Task_Interface ...$tasks ) {
		$tasks_with_id = [];
		foreach ( $tasks as $task ) {
			// Since child tasks are excluded by the DI, we don't need to filter them out here, so let's just filter out the post type tasks.

			// @TODO: Maybe also filter out, just in case?
			if ( $task instanceof Post_Type_Task_Interface ) {
				continue;
			}
			$tasks_with_id[ $task->get_id() ] = $task;
		}

		$this->tasks = $tasks_with_id;
	}

	/**
	 * Sets the tracking link adapter.
	 *
	 * @required
	 *
	 * @codeCoverageIgnore - Is handled by DI-container.
	 *
	 * @param Tracking_Link_Adapter $tracking_link_adapter The tracking link adapter.
	 *
	 * @return void
	 */
	public function set_tracking_link_adapter( Tracking_Link_Adapter $tracking_link_adapter ) {
		$this->tracking_link_adapter = $tracking_link_adapter;
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

		foreach ( $tasks as $task_id => $task ) {
			if ( ! $task instanceof Task_Interface ) {
				throw new Invalid_Tasks_Exception();
			}

			if ( $task->is_valid() === false ) {
				unset( $tasks[ $task_id ] );
				continue;
			}

			// Generate child tasks for parent tasks (they will be nested in the output).
			if ( $task instanceof Parent_Task_Interface ) {
				$task->generate_child_tasks();
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
			$task_data = $this->get_task_data_with_enhanced_cta( $task );

			// Nest child tasks inside their parent.
			if ( $task instanceof Parent_Task_Interface ) {
				$child_tasks_data = [];
				foreach ( $task->get_child_tasks() as $child_task ) {
					$child_task_data = $this->get_task_data_with_enhanced_cta( $child_task );

					$child_tasks_data[ $child_task->get_id() ] = $child_task_data;
				}
				$task_data['childTasks'] = $child_tasks_data;
			}

			$tasks_data[ $task->get_id() ] = $task_data;
		}

		return $tasks_data;
	}

	/**
	 * Gets the task data with enhanced CTA tracking links.
	 *
	 * @param Task_Interface $task The task.
	 *
	 * @return array<string, string|bool> The task data.
	 */
	private function get_task_data_with_enhanced_cta( Task_Interface $task ): array {
		if ( $task->get_call_to_action() !== null ) {
			$task->set_enhanced_call_to_action(
				new Call_To_Action_Entry(
					$task->get_call_to_action()->get_label(),
					$task->get_call_to_action()->get_type(),
					$this->tracking_link_adapter->create_tracking_link_for_tasks(
						$task->get_call_to_action()->get_href()
					)
				)
			);
		}

		return $task->to_array();
	}
}

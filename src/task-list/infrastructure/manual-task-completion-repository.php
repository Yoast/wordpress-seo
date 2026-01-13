<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Infrastructure;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Stores manual task completion overrides.
 */
class Manual_Task_Completion_Repository {

	/**
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the repository.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Checks whether a task is manually marked as completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool Whether the task is manually completed.
	 */
	public function is_task_manually_completed( string $task_id ): bool {
		$completed_task_ids = $this->options_helper->get( 'manually_completed_tasks', [] );

		return \in_array( $task_id, $completed_task_ids, true );
	}

	/**
	 * Marks a task as manually completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function set_task_manually_completed( string $task_id ): void {
		$completed_task_ids = $this->options_helper->get( 'manually_completed_tasks', [] );

		// Avoid duplicates.
		if ( \in_array( $task_id, $completed_task_ids, true ) ) {
			return;
		}

		$completed_task_ids[] = $task_id;
		$this->options_helper->set( 'manually_completed_tasks', $completed_task_ids );
	}

	/**
	 * Clears the manual completion state for a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function clear_task_manual_completion( string $task_id ): void {
		$completed_task_ids = $this->options_helper->get( 'manually_completed_tasks', [] );
		$completed_task_ids = \array_values(
			\array_filter(
				$completed_task_ids,
				static function ( $id ) use ( $task_id ) {
					return $id !== $task_id;
				}
			)
		);

		$this->options_helper->set( 'manually_completed_tasks', $completed_task_ids );
	}
}

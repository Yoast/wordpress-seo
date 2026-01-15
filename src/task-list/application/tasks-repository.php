<?php

namespace Yoast\WP\SEO\Task_List\Application;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors\Cached_Tasks_Collector;

/**
 * The tasks repository.
 */
class Tasks_Repository {

	/**
	 * The tasks collector.
	 *
	 * @var Cached_Tasks_Collector
	 */
	private $tasks_collector;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Cached_Tasks_Collector $tasks_collector The tasks collector.
	 * @param Options_Helper         $options_helper  The options helper.
	 */
	public function __construct(
		Cached_Tasks_Collector $tasks_collector,
		Options_Helper $options_helper
	) {
		$this->tasks_collector = $tasks_collector;
		$this->options_helper  = $options_helper;
	}

	/**
	 * Returns tasks data.
	 *
	 * @return array<string, array<string, string|bool>> The tasks list.
	 */
	public function get_tasks_data(): array {
		$tasks_data = $this->tasks_collector->get_tasks_data();
		$tasks_data = $this->apply_manual_completion_overrides( $tasks_data );

		return $tasks_data;
	}

	/**
	 * Applies manual completion overrides to the collected task data.
	 *
	 * @param array<string, array<string, string|bool>> $tasks_data The collected tasks data.
	 *
	 * @return array<string, array<string, string|bool>> The tasks data with manual completion overrides applied.
	 */
	private function apply_manual_completion_overrides( array $tasks_data ): array {
		$manually_completed_tasks_ids = $this->options_helper->get( 'manually_completed_tasks', [] );

		foreach ( $manually_completed_tasks_ids as $manually_completed_task_id ) {
			$tasks_data[ $manually_completed_task_id ]['isCompleted'] = true;
		}

		return $tasks_data;
	}
}

<?php

namespace Yoast\WP\SEO\Task_List\Application;

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
	 * The constructor.
	 *
	 * @param Cached_Tasks_Collector $tasks_collector The tasks collector.
	 */
	public function __construct( Cached_Tasks_Collector $tasks_collector ) {
		$this->tasks_collector = $tasks_collector;
	}

	/**
	 * Returns tasks data.
	 *
	 * @return array<string, array<string, string|bool>> The tasks list.
	 */
	public function get_tasks_data(): array {
		return $this->tasks_collector->get_tasks_data();
	}
}

<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Task_List\Application\Configuration;

use Yoast\WP\SEO\Task_List\Application\Tasks_Collector;

/**
 * Responsible for the task list configuration.
 */
class Task_List_Configuration {

	/**
	 * The tasks collector.
	 *
	 * @var Tasks_Collector
	 */
	private $tasks_collector;

	/**
	 * The constructor.
	 *
	 * @param Tasks_Collector $tasks_collector The tasks collector.
	 */
	public function __construct(
		Tasks_Collector $tasks_collector
	) {
		$this->tasks_collector = $tasks_collector;
	}

	/**
	 * Returns a configuration
	 *
	 * @return array<string, array<string>|array<string, string|array<string, array<string, int>>>>
	 */
	public function get_configuration(): array {
		$configuration = [
			'tasksConfiguration' => $this->get_tasks_configuration(),
		];

		return $configuration;
	}

	/**
	 * Returns the tasks's configuration.
	 *
	 * @return array<string, array<string>|array<string, string|array<string, array<string, int>>>>
	 */
	protected function get_tasks_configuration(): ?array {
		$tasks_configuration = [];

		$tasks = $this->tasks_collector->get_tasks();
		foreach ( $tasks as $key => $task ) {
			$tasks_configuration[ $key ] = $task->config_to_array();
		}

		return $tasks_configuration;
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors;

use WPSEO_Utils;

/**
 * Manages the cached collection of tasks.
 */
class Cached_Tasks_Collector implements Tasks_Collector_Interface {

	public const TASKS_TRANSIENT = 'wpseo_task_list_tasks';

	/**
	 * Holds the tasks collector.
	 *
	 * @var Tasks_Collector
	 */
	private $tasks_collector;

	/**
	 * Constructs the cached collector.
	 *
	 * @param Tasks_Collector $tasks_collector The tasks collector.
	 */
	public function __construct( Tasks_Collector $tasks_collector ) {
		$this->tasks_collector = $tasks_collector;
	}

	/**
	 * Gets the tasks data.
	 *
	 * @TODO: Maybe this can be improved at some point by caching only the is_completed info instead of all the task data.
	 *
	 * @return array<string, array<string, string|bool>> The tasks data.
	 */
	public function get_tasks_data(): array {
		$cached_tasks_data = \get_transient( self::TASKS_TRANSIENT );

		if ( $cached_tasks_data !== false ) {
			return \json_decode( $cached_tasks_data, true );
		}

		$tasks_data = $this->tasks_collector->get_tasks_data();
		\set_transient( self::TASKS_TRANSIENT, WPSEO_Utils::format_json_encode( $tasks_data ), \MINUTE_IN_SECONDS );

		return $tasks_data;
	}
}

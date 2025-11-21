<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Task_List\Infrastructure\Tasks_Collectors;

/**
 * The interface of task collectors.
 */
interface Tasks_Collector_Interface {

	/**
	 * Gets the tasks data.
	 *
	 * @return array<string, array<string, string|bool>> The tasks data.
	 */
	public function get_tasks_data(): array;
}

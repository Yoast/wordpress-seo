<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Components;

/**
 * Represents an analyzer component for a task.
 */
interface Task_Analyzer_Interface {

	/**
	 * Returns the type of the analyzer.
	 *
	 * @return string
	 */
	public function get_type(): string;

	/**
	 * Returns an array representation of the analyzer data.
	 *
	 * @return array<string, string> Returns in an array format.
	 */
	public function to_array(): array;
}

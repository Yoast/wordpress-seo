<?php

namespace Yoast\WP\SEO\Task_List\Domain;

/**
 * Represents a task.
 */
interface Task_Interface {

	/**
	 * Returns the task ID.
	 *
	 * @return string
	 */
	public function get_id();

	/**
	 * Returns whether this task is open.
	 *
	 * @return bool
	 */
	public function get_is_open();

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool>
	 */
	public function to_array();
}

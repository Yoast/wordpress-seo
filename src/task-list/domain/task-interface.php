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
	public function get_id(): string;

	/**
	 * Returns whether this task is completed.
	 *
	 * @return bool
	 */
	public function get_is_completed(): bool;

	/**
	 * Returns an array representation of the task config data.
	 *
	 * @return array<string, string|bool>
	 */
	public function config_to_array(): array;

	/**
	 * Returns the task's priority.
	 *
	 * @return string
	 */
	public function get_priority(): string;

	/**
	 * Returns the task's duration.
	 *
	 * @return int
	 */
	public function get_duration(): int;

	/**
	 * Returns the task's link.
	 *
	 * @return string|null
	 */
	public function get_link(): ?string;
}

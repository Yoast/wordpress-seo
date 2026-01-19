<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;
use Yoast\WP\SEO\Task_List\Domain\Components\Copy_Set;

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
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool>
	 */
	public function to_array(): array;

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

	/**
	 * Returns the task's badge.
	 *
	 * @return string|null
	 */
	public function get_badge(): ?string;

	/**
	 * Returns the task's call to action.
	 *
	 * @return Call_To_Action_Entry
	 */
	public function get_call_to_action(): Call_To_Action_Entry;

	/**
	 * Returns the task's copy set.
	 *
	 * @return Copy_Set
	 */
	public function get_copy_set(): Copy_Set;

	/**
	 * Sets the enhanced call to action.
	 *
	 * @param Call_To_Action_Entry $enhanced_call_to_action The enhanced call to action.
	 *
	 * @return void
	 */
	public function set_enhanced_call_to_action( ?Call_To_Action_Entry $enhanced_call_to_action ): void;

	/**
	 * Returns the enhanced call to action.
	 *
	 * @return Call_To_Action_Entry|null
	 */
	public function get_enhanced_call_to_action(): ?Call_To_Action_Entry;

	/**
	 * Returns whether the task is valid.
	 *
	 * @return bool
	 */
	public function is_valid(): bool;
}

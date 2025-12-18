<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;

/**
 * Abstract class for a task.
 */
abstract class Abstract_Task implements Task_Interface {

	/**
	 * The ID of the task.
	 *
	 * @var string
	 */
	protected $id;

	/**
	 * The priority of the task.
	 *
	 * @var string
	 */
	protected $priority;

	/**
	 * The duration of the task.
	 *
	 * @var int
	 */
	protected $duration;

	/**
	 * The enhanced call to action.
	 *
	 * @var Call_To_Action_Entry
	 */
	private $enhanced_call_to_action;

	/**
	 * Returns the task ID.
	 *
	 * @return string
	 */
	public function get_id(): string {
		return $this->id;
	}

	/**
	 * Returns the task's priority.
	 *
	 * @return string
	 */
	public function get_priority(): string {
		return $this->priority;
	}

	/**
	 * Returns the task's duration.
	 *
	 * @return int
	 */
	public function get_duration(): int {
		return $this->duration;
	}

	/**
	 * Returns the task's badge.
	 *
	 * @return string|null
	 */
	public function get_badge(): ?string {
		return null;
	}

	/**
	 * Sets the enhanced call to action.
	 *
	 * @param Call_To_Action_Entry $enhanced_call_to_action The enhanced call to action.
	 *
	 * @return void
	 */
	public function set_enhanced_call_to_action( ?Call_To_Action_Entry $enhanced_call_to_action ): void {
		$this->enhanced_call_to_action = $enhanced_call_to_action;
	}

	/**
	 * Returns the enhanced call to action.
	 *
	 * @return Call_To_Action_Entry|null
	 */
	public function get_enhanced_call_to_action(): ?Call_To_Action_Entry {
		return $this->enhanced_call_to_action;
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		$data = [
			'id'           => $this->get_id(),
			'duration'     => $this->get_duration(),
			'priority'     => $this->get_priority(),
			'badge'        => $this->get_badge(),
			'isCompleted'  => $this->get_is_completed(),
			'callToAction' => $this->get_enhanced_call_to_action()->to_array(),
		];

		return \array_merge( $data, $this->get_copy_set()->to_array() );
	}

	/**
	 * Returns whether the task is valid.
	 *
	 * @return bool
	 */
	public function is_valid(): bool {
		return true;
	}
}

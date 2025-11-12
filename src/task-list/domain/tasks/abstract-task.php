<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

use Yoast\WP\SEO\Task_List\Domain\Call_To_Actions\Call_To_Action_Entry;
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
	 * Returns the task's call to action.
	 *
	 * @return Call_To_Action_Entry
	 */
	public function get_call_to_action(): Call_To_Action_Entry {
		return $this->call_to_action;
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array(): array {
		return [
			'id'             => $this->get_id(),
			'duration'       => $this->get_duration(),
			'priority'       => $this->get_priority(),
			'link'           => $this->get_link(),
			'is_completed'   => $this->get_is_completed(),
			'call_to_action' => $this->get_call_to_action()->to_array(),
		];
	}
}

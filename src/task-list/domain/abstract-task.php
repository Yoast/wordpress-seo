<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain;

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
	 * Returns an array representation of the task config data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function config_to_array(): array {
		return [
			'id'       => $this->id,
			'duration' => $this->duration,
			'priority' => $this->priority,
			'link'     => $this->get_link(),
		];
	}
}

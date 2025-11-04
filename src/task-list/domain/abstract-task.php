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
	 * Returns the task ID.
	 *
	 * @return string
	 */
	public function get_id() {
		return $this->id;
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool> Returns in an array format.
	 */
	public function to_array() {
		return [
			'id'       => $this->get_id(),
			'is_open'  => $this->get_is_open(),
		];
	}
}

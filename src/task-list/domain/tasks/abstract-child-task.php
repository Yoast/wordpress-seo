<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Task_Analyzer_Interface;

/**
 * Abstract class for a child task.
 * Use this when you need a task that belongs to a parent task.
 */
abstract class Abstract_Child_Task extends Abstract_Task implements Child_Task_Interface {

	/**
	 * The parent task associated with the task.
	 *
	 * @var Parent_Task_Interface
	 */
	protected $parent_task;

	/**
	 * Returns the task's analyzer component.
	 *
	 * @return Task_Analyzer_Interface|null
	 */
	public function get_analyzer(): ?Task_Analyzer_Interface {
		return null;
	}

	/**
	 * Returns an array representation of the task data.
	 *
	 * @return array<string, string|bool|int|array|null> Returns in an array format.
	 */
	public function to_array(): array {
		$data = parent::to_array();

		$analyzer = $this->get_analyzer();

		$data['parentTaskId'] = $this->parent_task->get_id();
		$data['analyzer']     = ( $analyzer !== null ) ? $analyzer->to_array() : null;

		return $data;
	}
}

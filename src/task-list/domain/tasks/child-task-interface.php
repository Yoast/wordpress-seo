<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

/**
 * Represents a child task.
 */
interface Child_Task_Interface extends Task_Interface {

	/**
	 * Returns the parent task this task belongs to.
	 *
	 * @return Parent_Task_Interface
	 */
	public function get_parent_task(): Parent_Task_Interface;

	/**
	 * Sets the parent task this task belongs to.
	 *
	 * @param Parent_Task_Interface $parent_task The parent task.
	 *
	 * @return void
	 */
	public function set_parent_task( Parent_Task_Interface $parent_task ): void;
}

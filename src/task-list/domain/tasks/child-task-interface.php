<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Given it's a very specific case.
namespace Yoast\WP\SEO\Task_List\Domain\Tasks;

use Yoast\WP\SEO\Task_List\Domain\Components\Task_Analyzer_Interface;

/**
 * Represents a child task.
 */
interface Child_Task_Interface extends Task_Interface {

	/**
	 * Returns the task's analyzer component.
	 *
	 * @return Task_Analyzer_Interface|null
	 */
	public function get_analyzer(): ?Task_Analyzer_Interface;
}

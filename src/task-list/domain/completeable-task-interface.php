<?php

namespace Yoast\WP\SEO\Task_List\Domain;

/**
 * Represents a completeable task.
 */
interface Completeable_Task_Interface extends Task_Interface {

	/**
	 * Completes a task.
	 *
	 * @return void
	 */
	public function complete_task(): void;
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Exceptions;

use Exception;

/**
 * Exception for incorrect child task usage.
 */
class Incorrect_Child_Task_Usage_Exception extends Exception {

	/**
	 * Constructor of the exception.
	 *
	 * @param string|null $task_identifier The identifier of the task that caused the exception.
	 */
	public function __construct( $task_identifier = null ) {
		$message = 'Used child task incorrectly. Child tasks should not be added to the Tasks Collector directly, as they are meant to be used within the context of their parent task.';
		if ( $task_identifier !== null ) {
			$message .= ' Offending task: ' . $task_identifier;
		}

		parent::__construct( $message, 400 );
	}
}

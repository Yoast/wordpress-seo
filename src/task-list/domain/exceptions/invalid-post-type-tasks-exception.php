<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Exceptions;

use Exception;

/**
 * Exception for invalid post type tasks.
 */
class Invalid_Post_Type_Tasks_Exception extends Exception {

	/**
	 * Constructor of the exception.
	 */
	public function __construct() {
		parent::__construct( 'Added invalid post type task.', 400 );
	}
}

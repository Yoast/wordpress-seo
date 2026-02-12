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
	 */
	public function __construct() {
		parent::__construct( 'Used child task incorrectly.', 400 );
	}
}

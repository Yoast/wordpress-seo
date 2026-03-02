<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Exceptions;

use Exception;

/**
 * Exception for incorrect child task trait usage.
 */
class Incorrect_Child_Trait_Usage_Exception extends Exception {

	/**
	 * Constructor of the exception.
	 */
	public function __construct() {
		parent::__construct( 'Content_Score_Child_Task_Trait can only be used in classes extending Abstract_Child_Task.', 400 );
	}
}

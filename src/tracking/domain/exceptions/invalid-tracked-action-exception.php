<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tracking\Domain\Exceptions;

use Exception;

/**
 * Exception for when there's an invalid tracked action.
 */
class Invalid_Tracked_Action_Exception extends Exception {

	/**
	 * Constructor of the exception.
	 */
	public function __construct() {
		parent::__construct( 'The tracked action is invalid', 400 );
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Exceptions;

use Exception;

/**
 * Exception for when we can't complete the sample page task.
 */
class Complete_Sample_Page_Task_Exception extends Exception {

	/**
	 * Constructor of the exception.
	 */
	public function __construct() {
		parent::__construct( \esc_html__( 'Failed to delete the Sample Page.', 'wordpress-seo' ), 400 );
	}
}

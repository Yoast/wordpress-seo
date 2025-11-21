<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Task_List\Domain\Exceptions;

use Exception;

/**
 * Exception for when we can't complete the llms.txt task.
 */
class Complete_LLMS_Task_Exception extends Exception {

	/**
	 * Constructor of the exception.
	 */
	public function __construct() {
		parent::__construct( \esc_html__( 'Failed to enable llms.txt option.', 'wordpress-seo' ), 400 );
	}
}

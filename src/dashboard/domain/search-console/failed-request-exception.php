<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Dashboard\Domain\Search_Console;

use Exception;

/**
 * Exception for when a search console request fails.
 */
class Failed_Request_Exception extends Exception {

	/**
	 * Constructor of the exception.
	 *
	 * @param string $error The error of the request.
	 */
	public function __construct( $error ) {
		parent::__construct( 'The Search Console request failed: ' . $error, 500 );
	}
}

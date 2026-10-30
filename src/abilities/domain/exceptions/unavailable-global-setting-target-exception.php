<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Domain\Exceptions;

use Exception;

/**
 * Exception for when the global settings of a target cannot be changed, like for a homepage that is a static page.
 */
class Unavailable_Global_Setting_Target_Exception extends Exception {

	/**
	 * The machine-readable code of the error.
	 *
	 * @var string
	 */
	private $error_code;

	/**
	 * Constructor of the exception.
	 *
	 * @param string $error_code The machine-readable code of the error.
	 * @param string $message    Why the global settings cannot be changed, meant to be relayed to the user.
	 */
	public function __construct( string $error_code, string $message ) {
		parent::__construct( $message, 400 );

		$this->error_code = $error_code;
	}

	/**
	 * Returns the machine-readable code of the error.
	 *
	 * @return string The error code.
	 */
	public function get_error_code(): string {
		return $this->error_code;
	}
}

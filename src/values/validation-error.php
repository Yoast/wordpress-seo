<?php


namespace Yoast\WP\SEO\Values;

/**
 * Class Validation_Error.
 */
class Validation_Error {

	/**
	 * The message to describe the error.
	 *
	 * @var string
	 */
	protected $error_message;

	/**
	 * Validation_Error constructor.
	 *
	 * @param string $error_message Message describing the error.
	 */
	public function __construct( $error_message ) {
		$this->error_message = $error_message;
	}

	/**
	 * Get the error message.
	 *
	 * @return string The error message.
	 */
	public function get_error_message() {
		return $this->error_message;
	}
}

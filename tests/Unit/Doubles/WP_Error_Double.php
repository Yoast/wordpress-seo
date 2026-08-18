<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles;

/**
 * Test double for the WordPress native WP_Error class.
 *
 * Aliased to `WP_Error` in the unit test bootstrap, so `new WP_Error()` calls in production code
 * create an inspectable object instead of a bare Mockery-declared class, allowing tests to assert
 * on the code, message and data passed by the code under test. Deliberately not final: existing
 * tests mock `WP_Error`, and Mockery cannot replace methods of a final class.
 */
class WP_Error_Double {

	/**
	 * The error code.
	 *
	 * @var string|int
	 */
	private $code;

	/**
	 * The error message.
	 *
	 * @var string
	 */
	private $message;

	/**
	 * The error data.
	 *
	 * @var mixed
	 */
	private $data;

	/**
	 * Constructs the error, mirroring the WP native signature.
	 *
	 * @param string|int $code    The error code.
	 * @param string     $message The error message.
	 * @param mixed      $data    The error data.
	 */
	public function __construct( $code = '', $message = '', $data = '' ) {
		$this->code    = $code;
		$this->message = $message;
		$this->data    = $data;
	}

	/**
	 * Retrieves the error code.
	 *
	 * @return string|int The error code.
	 */
	public function get_error_code() {
		return $this->code;
	}

	/**
	 * Retrieves the error message.
	 *
	 * @return string The error message.
	 */
	public function get_error_message() {
		return $this->message;
	}

	/**
	 * Retrieves the error data.
	 *
	 * @return mixed The error data.
	 */
	public function get_error_data() {
		return $this->data;
	}
}

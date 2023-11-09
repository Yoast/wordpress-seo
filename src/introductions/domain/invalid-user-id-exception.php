<?php

namespace Yoast\WP\SEO\Introductions\Domain;

use InvalidArgumentException;
use Throwable;

/**
 * Invalid user ID.
 */
class Invalid_User_Id_Exception extends InvalidArgumentException {

	/**
	 * Constructs the exception.
	 *
	 * @link https://php.net/manual/en/exception.construct.php
	 *
	 * @param string         $message  [optional] The Exception message to throw.
	 * @param int            $code     [optional] The Exception code.
	 * @param null|Throwable $previous [optional] The previous throwable used for the exception chaining.
	 */
	public function __construct( // phpcs:ignore Generic.CodeAnalysis.UselessOverridingMethod.Found -- Reason: A default message is used.
		$message = 'Invalid User ID',
		$code = 0,
		$previous = null
	) {
		parent::__construct( $message, $code, $previous );
	}
}

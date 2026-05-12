<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions;

use Exception;
use Throwable;

/**
 * Class Remote_Request_Exception
 *
 * @deprecated 27.7
 * @codeCoverageIgnore
 */
abstract class Remote_Request_Exception extends Exception {

	/**
	 * A string error code that can be used to identify a particular type of error.
	 *
	 * @var string
	 */
	private $error_identifier;

	/**
	 * Constructor.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @param string         $message          The error message.
	 * @param int            $code             The error status code.
	 * @param string         $error_identifier The error code identifier, used to identify a type of error.
	 * @param Throwable|null $previous         The previously thrown exception.
	 */
	public function __construct( $message = '', $code = 0, $error_identifier = '', ?Throwable $previous = null ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		parent::__construct( $message, $code, $previous );
		$this->error_identifier = (string) $error_identifier;
	}

	/**
	 * Returns the error identifier.
	 *
	 * @deprecated 27.7
	 * @codeCoverageIgnore
	 *
	 * @return string The error identifier.
	 */
	public function get_error_identifier(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 27.7' );
		return $this->error_identifier;
	}
}

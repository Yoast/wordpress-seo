<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions;

use Exception;
use Throwable;

/**
 * Class Remote_Request_Exception
 */
abstract class Remote_Request_Exception extends Exception {

	/**
	 * A string error code that can be used to identify a particular type of error.
	 *
	 * @var string
	 */
	private $error_identifier;

	/**
	 * The response headers associated with the error, keyed by lower-cased header name.
	 *
	 * @var array<string, string|array<string>>
	 */
	private $response_headers;

	/**
	 * Constructor.
	 *
	 * @param string                              $message          The error message.
	 * @param int                                 $code             The error status code.
	 * @param string                              $error_identifier The error code identifier, used to identify a type of error.
	 * @param Throwable|null                      $previous         The previously thrown exception.
	 * @param array<string, string|array<string>> $response_headers The response headers associated with the error.
	 */
	public function __construct( $message = '', $code = 0, $error_identifier = '', ?Throwable $previous = null, array $response_headers = [] ) {
		parent::__construct( $message, $code, $previous );
		$this->error_identifier = (string) $error_identifier;
		$this->response_headers = $response_headers;
	}

	/**
	 * Returns the error identifier.
	 *
	 * @return string The error identifier.
	 */
	public function get_error_identifier(): string {
		return $this->error_identifier;
	}

	/**
	 * Returns the response headers associated with the error, keyed by lower-cased header name.
	 *
	 * @return array<string, string|array<string>> The response headers.
	 */
	public function get_response_headers(): array {
		return $this->response_headers;
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions;

use Exception;
use Throwable;

/**
 * Class Remote_Request_Exception
 *
deprecated 26.3
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
	deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @param string         $message          The error message.
	 * @param int            $code             The error status code.
	 * @param string         $error_identifier The error code identifier, used to identify a type of error.
	 * @param Throwable|null $previous         The previously thrown exception.
	 */
	public function __construct( $message = '', $code = 0, $error_identifier = '', ?Throwable $previous = null ) {
		parent::__construct( $message, $code, $previous );
		$this->error_identifier = (string) $error_identifier;
	}

	/**
	 * Returns the error identifier.
	 *
	deprecated 26.3
	 * @codeCoverageIgnore
	 *
	 * @return string The error identifier.
	 */
	public function get_error_identifier(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.3', 'Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception::get_error_identifier' );
		return $this->error_identifier;
	}
}

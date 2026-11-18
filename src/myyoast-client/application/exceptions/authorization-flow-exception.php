<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

use RuntimeException;
use Throwable;

/**
 * Exception thrown when the authorization flow cannot be started.
 *
 * Wraps underlying failures (registration, discovery, invalid parameters)
 * that prevent building the authorization URL.
 */
class Authorization_Flow_Exception extends RuntimeException {

	/**
	 * The error code identifying the failure reason.
	 *
	 * @var string
	 */
	private $error_code;

	/**
	 * Authorization_Flow_Exception constructor.
	 *
	 * @param string         $error_code        The error code.
	 * @param string         $error_description A human-readable description.
	 * @param int            $code              The exception code.
	 * @param Throwable|null $previous          The previous exception.
	 */
	public function __construct( string $error_code, string $error_description = '', int $code = 0, ?Throwable $previous = null ) {
		$this->error_code = $error_code;

		$message = $error_code;
		if ( $error_description !== '' ) {
			$message .= ': ' . $error_description;
		}

		parent::__construct( $message, $code, $previous );
	}

	/**
	 * Returns the error code.
	 *
	 * @return string
	 */
	public function get_error_code(): string {
		return $this->error_code;
	}
}

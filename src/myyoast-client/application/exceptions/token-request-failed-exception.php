<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Application\Exceptions;

use RuntimeException;
use Throwable;

/**
 * Exception thrown when a token endpoint request fails.
 *
 * Wraps OAuth error codes like `invalid_grant`, `invalid_client`,
 * `invalid_dpop_proof`, etc.
 */
class Token_Request_Failed_Exception extends RuntimeException {

	/**
	 * The OAuth error code from the token endpoint response.
	 *
	 * @var string
	 */
	private $error_code;

	/**
	 * Token_Request_Failed_Exception constructor.
	 *
	 * @param string         $error_code        The OAuth error code.
	 * @param string         $error_description A human-readable description.
	 * @param int            $code              The HTTP status code.
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
	 * Returns the OAuth error code.
	 *
	 * @return string
	 */
	public function get_error_code(): string {
		return $this->error_code;
	}

	/**
	 * Creates an exception from a token endpoint response body.
	 *
	 * @param array<string, string> $response_body The parsed JSON response.
	 * @param int                   $status_code   The HTTP status code.
	 *
	 * @return self
	 */
	public static function from_response( array $response_body, int $status_code = 0 ): self {
		return new self(
			( $response_body['error'] ?? 'unknown_error' ),
			( $response_body['error_description'] ?? '' ),
			$status_code,
		);
	}
}

<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\Domain;

/**
 * Immutable value object for an HTTP response returned by the OAuth client.
 *
 * Carries the HTTP status code (0 on transport failure), response headers,
 * and parsed body. The body is either an associative array (for JSON
 * responses) or a string (for everything else).
 */
final class HTTP_Response {

	/**
	 * HTTP status code. Zero indicates a transport-level failure
	 * (e.g. DNS, TLS, timeout) where no response was received.
	 *
	 * @var int
	 */
	private $status;

	/**
	 * Response headers, keyed by header name.
	 *
	 * @var array<string, string|string[]>
	 */
	private $headers;

	/**
	 * Parsed response body. An associative array for JSON responses,
	 * otherwise the raw body string.
	 *
	 * @var array<string, mixed>|string
	 */
	private $body;

	/**
	 * @param int                             $status  The HTTP status code.
	 * @param array<string, string|string[]>  $headers The response headers.
	 * @param array<string, mixed>|string     $body    The parsed body.
	 */
	public function __construct( int $status, array $headers, $body ) {
		$this->status  = $status;
		$this->headers = $headers;
		$this->body    = $body;
	}

	/**
	 * @return int The HTTP status code (0 on transport failure).
	 */
	public function get_status(): int {
		return $this->status;
	}

	/**
	 * @return array<string, string|string[]> The response headers.
	 */
	public function get_headers(): array {
		return $this->headers;
	}

	/**
	 * @return array<string, mixed>|string The parsed body.
	 */
	public function get_body() {
		return $this->body;
	}

	/**
	 * @return bool True if the body is an associative array (decoded JSON).
	 */
	public function has_array_body(): bool {
		return \is_array( $this->body );
	}

	/**
	 * Returns a value from an array body by key, or a default when the
	 * body is not an array or the key is missing.
	 *
	 * @param string $key     The key to look up.
	 * @param mixed  $default The default value.
	 *
	 * @return mixed
	 */
	public function get_body_value( string $key, $default = null ) {
		if ( ! \is_array( $this->body ) ) {
			return $default;
		}

		return ( $this->body[ $key ] ?? $default );
	}

	/**
	 * @return bool True if the status indicates a successful response (2xx).
	 */
	public function is_successful(): bool {
		return ( $this->status >= 200 && $this->status < 300 );
	}

	/**
	 * @return bool True if no response was received (transport failure).
	 */
	public function is_transport_failure(): bool {
		return ( $this->status === 0 );
	}
}

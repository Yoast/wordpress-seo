<?php

namespace Yoast\WP\SEO\AI_HTTP_Request\Domain;

use InvalidArgumentException;

/**
 * Class Request
 * Represents a request to the AI Generator API.
 *
 * @deprecated 28.4
 * @codeCoverageIgnore
 */
class Request {

	public const METHOD_GET    = 'GET';
	public const METHOD_POST   = 'POST';
	public const METHOD_DELETE = 'DELETE';

	private const ALLOWED_METHODS = [ self::METHOD_GET, self::METHOD_POST, self::METHOD_DELETE ];

	/**
	 * The action path for the request.
	 *
	 * @var string
	 */
	private $action_path;

	/**
	 * The body of the request.
	 *
	 * @var array<string>
	 */
	private $body;

	/**
	 * The headers for the request.
	 *
	 * @var array<string>
	 */
	private $headers;

	/**
	 * The HTTP method for the request.
	 *
	 * @var string
	 */
	private $http_method;

	/**
	 * Constructor for the Request class.
	 *
	 * @deprecated 28.4
	 * @codeCoverageIgnore
	 *
	 * @param string        $action_path The action path for the request.
	 * @param array<string> $body        The body of the request.
	 * @param array<string> $headers     The headers for the request.
	 * @param string        $http_method The HTTP method for the request. One of the METHOD_* constants. Defaults to POST.
	 *
	 * @throws InvalidArgumentException When $http_method is not one of the supported METHOD_* constants.
	 */
	public function __construct( string $action_path, array $body = [], array $headers = [], string $http_method = self::METHOD_POST ) {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.4' );
		if ( ! \in_array( $http_method, self::ALLOWED_METHODS, true ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			throw new InvalidArgumentException( "Unsupported HTTP method: $http_method" );
		}

		$this->action_path = $action_path;
		$this->body        = $body;
		$this->headers     = $headers;
		$this->http_method = $http_method;
	}

	/**
	 * Get the action path for the request.
	 *
	 * @deprecated 28.4
	 * @codeCoverageIgnore
	 *
	 * @return string The action path for the request.
	 */
	public function get_action_path(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.4' );
		return $this->action_path;
	}

	/**
	 * Get the body of the request.
	 *
	 * Returns null for an empty body: an empty PHP array is ambiguous once JSON-encoded (`[]` vs `{}`),
	 * so an empty body is omitted from the request entirely rather than sent as an empty array, which
	 * the AI service rejects.
	 *
	 * @deprecated 28.4
	 * @codeCoverageIgnore
	 *
	 * @return array<string>|null The body of the request, or null when there is no body to send.
	 */
	public function get_body(): ?array {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.4' );
		return ( $this->body === [] ) ? null : $this->body;
	}

	/**
	 * Get the headers for the request.
	 *
	 * @deprecated 28.4
	 * @codeCoverageIgnore
	 *
	 * @return array<string> The headers for the request.
	 */
	public function get_headers(): array {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.4' );
		return $this->headers;
	}

	/**
	 * Get the HTTP method for the request.
	 *
	 * @deprecated 28.4
	 * @codeCoverageIgnore
	 *
	 * @return string One of the METHOD_* constants.
	 */
	public function get_http_method(): string {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.4' );
		return $this->http_method;
	}
}

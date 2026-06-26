<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\HTTP_Request\Domain;

use InvalidArgumentException;

/**
 * Class Request
 * Represents a request to the AI Generator API.
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
	 * @param string        $action_path The action path for the request.
	 * @param array<string> $body        The body of the request.
	 * @param array<string> $headers     The headers for the request.
	 * @param string        $http_method The HTTP method for the request. One of the METHOD_* constants. Defaults to POST.
	 *
	 * @throws InvalidArgumentException When $http_method is not one of the supported METHOD_* constants.
	 */
	public function __construct( string $action_path, array $body = [], array $headers = [], string $http_method = self::METHOD_POST ) {
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
	 * @return string The action path for the request.
	 */
	public function get_action_path(): string {
		return $this->action_path;
	}

	/**
	 * Get the body of the request.
	 *
	 * @return array<string> The body of the request.
	 */
	public function get_body(): array {
		return $this->body;
	}

	/**
	 * Get the headers for the request.
	 *
	 * @return array<string> The headers for the request.
	 */
	public function get_headers(): array {
		return $this->headers;
	}

	/**
	 * Get the HTTP method for the request.
	 *
	 * @return string One of the METHOD_* constants.
	 */
	public function get_http_method(): string {
		return $this->http_method;
	}

	/**
	 * Returns a copy of the request with the given headers merged in.
	 *
	 * @param array<string> $headers The headers to add.
	 *
	 * @return self The new request.
	 */
	public function with_added_headers( array $headers ): self {
		return new self(
			$this->action_path,
			$this->body,
			\array_merge( $this->headers, $headers ),
			$this->http_method,
		);
	}
}

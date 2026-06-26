<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\HTTP_Request\Infrastructure;

use WPSEO_Utils;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;

/**
 * Class API_Client
 * Handles the API requests to the AI Generator API.
 *
 * @makePublic
 */
class API_Client implements API_Client_Interface {

	/**
	 * The base URL for the API.
	 *
	 * @var string
	 */
	private $base_url = 'https://ai.yoa.st/api/v1';

	/**
	 * Performs a request to the API.
	 *
	 * @param string        $action_path The action path for the request.
	 * @param array<string> $body        The body of the request.
	 * @param array<string> $headers     The headers for the request.
	 * @param string        $http_method The HTTP method for the request. One of `Request::METHOD_*`.
	 *
	 * @return array<int|string|array<string>> The response from the API.
	 *
	 * @throws WP_Request_Exception When the underlying WordPress HTTP call returns an error, or the HTTP method is not supported.
	 */
	public function perform_request( string $action_path, $body, $headers, string $http_method ): array {
		// Our API expects JSON.
		$headers   = \array_merge( $headers, [ 'Content-Type' => 'application/json' ] );
		$arguments = [
			'timeout' => $this->get_request_timeout(),
			'headers' => $headers,
		];

		// Only POST sends a body to the AI API today; GET and DELETE endpoints do not.
		if ( $http_method === Request::METHOD_POST ) {
			// phpcs:ignore Yoast.Yoast.JsonEncodeAlternative.Found -- Reason: We don't want the debug/pretty possibility.
			$arguments['body'] = WPSEO_Utils::format_json_encode( $body );
		}

		$url = $this->get_url( $action_path );

		switch ( $http_method ) {
			case Request::METHOD_POST:
				$response = \wp_remote_post( $url, $arguments );
				break;
			case Request::METHOD_GET:
				$response = \wp_remote_get( $url, $arguments );
				break;
			case Request::METHOD_DELETE:
				$response = \wp_remote_request( $url, \array_merge( $arguments, [ 'method' => 'DELETE' ] ) );
				break;
			default:
				// Defensive: the Request constructor already validates the method, so we should never reach this branch.
				// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
				throw new WP_Request_Exception( "Unsupported HTTP method: $http_method" );
		}

		if ( \is_wp_error( $response ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- false positive.
			throw new WP_Request_Exception( $response->get_error_message() );
		}

		return $response;
	}

	/**
	 * Builds the full URL for a request to the AI API, applying the same filter perform_request() uses.
	 *
	 * @param string $action_path The action path for the request.
	 *
	 * @return string The full URL for the request.
	 */
	public function get_url( string $action_path ): string {
		return $this->get_base_url() . $action_path;
	}

	/**
	 * Returns the RFC 8707 resource indicator for the AI API: the origin (scheme + host + optional port)
	 * of the configured base URL, without the path. This is the audience AI access tokens are bound to,
	 * so it must track the same filter that decides where requests are actually sent.
	 *
	 * @return string The AI resource server origin (e.g. https://ai.yoa.st).
	 */
	public function get_resource_url(): string {
		$parsed = \wp_parse_url( $this->get_base_url() );
		if ( $parsed === false ) {
			return $this->get_base_url();
		}

		$scheme = ( $parsed['scheme'] ?? 'https' );
		$host   = ( $parsed['host'] ?? '' );
		$port   = isset( $parsed['port'] ) ? ( ':' . $parsed['port'] ) : '';

		return $scheme . '://' . $host . $port;
	}

	/**
	 * Resolves the base URL for the AI API, applying the configurable override filter.
	 *
	 * @return string The (possibly filtered) base URL, including its path (e.g. https://ai.yoa.st/api/v1).
	 */
	private function get_base_url(): string {
		/**
		 * Filter: 'Yoast\WP\SEO\ai_api_url' - Replaces the default URL for the AI API with a custom one.
		 *
		 * @internal
		 *
		 * @param string $url The default URL for the AI API.
		 */
		return (string) \apply_filters( 'Yoast\WP\SEO\ai_api_url', $this->base_url );
	}

	/**
	 * Gets the timeout of the requests in seconds.
	 *
	 * @return int The timeout of the suggestion requests in seconds.
	 */
	public function get_request_timeout(): int {
		/**
		 * Filter: 'Yoast\WP\SEO\ai_suggestions_timeout' - Replaces the default timeout with a custom one, for testing purposes.
		 *
		 * @since 22.7
		 * @internal
		 *
		 * @param int $timeout The default timeout in seconds.
		 */
		return (int) \apply_filters( 'Yoast\WP\SEO\ai_suggestions_timeout', 60 );
	}
}

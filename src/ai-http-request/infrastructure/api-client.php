<?php

namespace Yoast\WP\SEO\AI_HTTP_Request\Infrastructure;

use WPSEO_Utils;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Request;

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

		/**
		 * Filter: 'Yoast\WP\SEO\ai_api_url' - Replaces the default URL for the AI API with a custom one.
		 *
		 * @internal
		 *
		 * @param string $url The default URL for the AI API.
		 */
		$url = \apply_filters( 'Yoast\WP\SEO\ai_api_url', $this->base_url );

		switch ( $http_method ) {
			case Request::METHOD_POST:
				$response = \wp_remote_post( $url . $action_path, $arguments );
				break;
			case Request::METHOD_GET:
				$response = \wp_remote_get( $url . $action_path, $arguments );
				break;
			case Request::METHOD_DELETE:
				$response = \wp_remote_request( $url . $action_path, \array_merge( $arguments, [ 'method' => 'DELETE' ] ) );
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

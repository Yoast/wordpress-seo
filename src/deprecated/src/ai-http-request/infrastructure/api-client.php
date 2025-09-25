<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_HTTP_Request\Infrastructure;

use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\WP_Request_Exception;

/**
 * Class API_Client
 * Handles the API requests to the AI Generator API.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
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
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param string        $action_path The action path for the request.
	 * @param array<string> $body        The body of the request.
	 * @param array<string> $headers     The headers for the request.
	 * @param bool          $is_post     Whether the request is a POST request.
	 *
	 * @return array<int|string|array<string>> The response from the API.
	 *
	 * @throws WP_Request_Exception When the wp_remote_post() returns an error.
	 */
	public function perform_request( string $action_path, $body, $headers, bool $is_post ): array {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client::perform_request' );

		return [];
	}

	/**
	 * Gets the timeout of the requests in seconds.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @return int The timeout of the suggestion requests in seconds.
	 */
	public function get_request_timeout(): int {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client::get_request_timeout' );
		return -1;
	}
}

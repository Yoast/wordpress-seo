<?php

namespace Yoast\WP\SEO\AI_HTTP_Request\Infrastructure;

use Exception;

/**
 * Interface for the API client.
 */

interface API_Client_Interface {

	/**
	 * Performs a request to the API.
	 *
	 * @param string        $action_path The action path for the request.
	 * @param array<string> $body        The body of the request.
	 * @param array<string> $headers     The headers for the request.
	 * @param bool          $is_post     Whether the request is a POST request.
	 *
	 * @throws Exception When the request fails for any reason.
	 *
	 * @return object The response from the API.
	 */
	public function perform_request( string $action_path, $body, $headers, bool $is_post ): object;
}

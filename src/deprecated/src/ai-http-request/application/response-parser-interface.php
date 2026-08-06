<?php

namespace Yoast\WP\SEO\AI_HTTP_Request\Application;

use Yoast\WP\SEO\AI_HTTP_Request\Domain\Response;

/**
 * Interface Response_Parser_Interface
 *
 * @deprecated 28.4
 * @codeCoverageIgnore
 */
interface Response_Parser_Interface {

	/**
	 * Parses the response from the API.
	 *
	 * @deprecated 28.4
	 * @codeCoverageIgnore
	 *
	 * @param array<int|string|array<string>> $response The response from the API.
	 *
	 * @return Response The parsed response.
	 */
	public function parse( $response ): Response;
}

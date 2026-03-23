<?php

namespace Yoast\WP\SEO\AI_HTTP_Request\Application;

use Yoast\WP\SEO\AI_HTTP_Request\Domain\Response;

interface Response_Parser_Interface {

	/**
	 * Parses the response from the API.
	 *
	 * @param array<int|string|array<string>> $response The response from the API.
	 *
	 * @return Response The parsed response.
	 *
	 * @deprecated 27.5
	 * @codeCoverageIgnore
	 */
	public function parse( $response ): Response;
}

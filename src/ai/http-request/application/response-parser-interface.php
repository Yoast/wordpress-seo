<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI\HTTP_Request\Application;

use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

interface Response_Parser_Interface {

	/**
	 * Parses the response from the API.
	 *
	 * @param array<int|string|array<string>> $response The response from the API.
	 *
	 * @return Response The parsed response.
	 */
	public function parse( $response ): Response;
}

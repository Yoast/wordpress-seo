<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\AI_HTTP_Request\Application;

use Yoast\WP\SEO\AI_HTTP_Request\Domain\Response;

/**
 * Class Response_Parser
 * Parses the response from the AI API and creates a Response object.
 *
 * @deprecated 26.2
 * @codeCoverageIgnore
 */
class Response_Parser implements Response_Parser_Interface {

	/**
	 * Parses the response from the API.
	 *
	 * @deprecated 26.2
	 * @codeCoverageIgnore
	 *
	 * @param array<int|string|array<string>> $response The response from the API.
	 *
	 * @return Response The parsed response.
	 */
	public function parse( $response ): Response {
		\_deprecated_function( __METHOD__, 'Yoast SEO 26.2', 'Yoast\WP\SEO\AI\HTTP_Request\Application\Response_Parser::parse' );

		return new Response( '', 200, '' );
	}
}

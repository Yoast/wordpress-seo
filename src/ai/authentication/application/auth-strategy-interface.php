<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Strategy for authenticating an outbound request to the yoast-ai service.
 *
 * Implementations decorate the given Request with the auth headers (and body fields) appropriate for their
 * auth flow, then dispatch it via the AI Request_Handler. The actual wp_remote_* call always originates from
 * the AI HTTP layer regardless of strategy, so response parsing and exception mapping stay uniform.
 */
interface Auth_Strategy_Interface {

	/**
	 * Sends a request to the AI API.
	 *
	 * @param Request $request The base request, without auth-specific headers.
	 * @param WP_User $user    The WP user the request is on behalf of.
	 *
	 * @return Response The parsed response.
	 */
	public function send( Request $request, WP_User $user ): Response;
}

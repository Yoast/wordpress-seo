<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Strategy for authenticating and dispatching an outbound yoast-ai request.
 *
 * Strategies own the full call: they acquire whatever credentials they need, dispatch the request,
 * map the result into the AI Response domain object, and translate any non-200 into the matching
 * typed exception. Any failure-path cleanup (clearing a stale cached token, deleting stored JWTs,
 * translating one exception type into another) happens inside the implementation before the
 * exception is rethrown. The sender does not retry — it only chooses between a primary and an
 * optional fallback strategy.
 */
interface Auth_Strategy_Interface {

	/**
	 * Authenticates and dispatches the request, returning the parsed response.
	 *
	 * Non-200 responses are translated into typed exceptions from the AI HTTP_Request exception
	 * family. Strategy-specific 4xx semantics (e.g. an OAuth-only `insufficient_scope` 403) are
	 * thrown as their own typed exceptions so the sender can route them past the fallback path.
	 *
	 * @param Request $request The base request, without auth headers.
	 * @param WP_User $user    The WP user the request is on behalf of.
	 *
	 * @return Response The parsed response.
	 */
	public function send( Request $request, WP_User $user ): Response;
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\AI\Authentication\Application;

use WP_User;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Remote_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;

/**
 * Strategy for putting the right authentication onto an outbound yoast-ai request.
 *
 * Strategies are pure decorators: they attach auth headers (and where applicable, body fields)
 * to a given Request and return the result. They never call the HTTP layer themselves — that's
 * the AI_Request_Sender's job. They also expose an on_failure() hook so the sender can ask the
 * strategy to recover from a transient failure (e.g. stash a fresh DPoP nonce, clear a stale
 * cached token) before the next decoration attempt.
 */
interface Auth_Strategy_Interface {

	/**
	 * Returns a copy of the request with this strategy's auth-specific headers (and body fields) attached.
	 *
	 * Acquires whatever tokens/proofs the strategy needs from its underlying services. Internal
	 * implementation-detail exceptions (e.g. token-issuance failures, DPoP signing failures) are
	 * translated into the AI exception family so callers see a uniform surface.
	 *
	 * @param Request $request The base request, without auth headers.
	 * @param WP_User $user    The WP user the request is on behalf of.
	 *
	 * @return Request The decorated request, ready to dispatch.
	 */
	public function decorate( Request $request, WP_User $user ): Request;

	/**
	 * Strategy-specific recovery, called by the sender after a failed dispatch.
	 *
	 * Implementations may:
	 *  - Mutate internal state (clear a cached token, stash a server-issued nonce) and return
	 *    `true` to signal "please re-decorate and retry".
	 *  - Return `false` to signal "I'm out of recovery options; try the fallback strategy if you
	 *    have one, otherwise propagate".
	 *  - `throw` an exception to override propagation with a typed exception (e.g. translate a
	 *    generic Forbidden_Exception into an Insufficient_Scope_Exception).
	 *
	 * The sender enforces a hard cap on total attempts; strategies don't need to track their own
	 * retry budget.
	 *
	 * @param Request                  $request   The base request (unchanged from the original send).
	 * @param WP_User                  $user      The WP user.
	 * @param Remote_Request_Exception $exception The exception thrown by the failed dispatch.
	 * @param int                      $attempt   The 1-based attempt counter for this strategy.
	 *
	 * @return bool True to retry; false to give up.
	 */
	public function on_failure( Request $request, WP_User $user, Remote_Request_Exception $exception, int $attempt ): bool;
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions;

/**
 * Thrown when the yoast-ai service returns a 403 on the MyYoast OAuth wire that isn't a scope error.
 *
 * Distinct from a generic Forbidden_Exception because the recovery path differs: a Token-flow 403
 * means consent was revoked (the caller clears the user's consent), but on the OAuth wire there is
 * no "consent" concept — the 403 is a deployment / policy / token-rejection problem the user can't
 * resolve by re-consenting. Callers that catch Forbidden_Exception to revoke consent must catch
 * OAuth_Forbidden_Exception first and re-throw it untouched.
 *
 * AI_Request_Sender also catches this type ahead of the generic Remote_Request_Exception so the
 * Token strategy is not invoked as a fallback — a different identity surface would mask the bug.
 */
class OAuth_Forbidden_Exception extends Forbidden_Exception {

}

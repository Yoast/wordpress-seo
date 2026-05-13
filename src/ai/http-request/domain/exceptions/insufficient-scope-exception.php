<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions;

/**
 * Thrown when the AI service rejects a request with a 403 carrying `error="insufficient_scope"`.
 *
 * This is distinct from a generic {@see Forbidden_Exception} because the recovery path differs:
 * a consent-revoked 403 should clear the user's consent and surface a re-consent prompt; a scope
 * failure should NOT touch consent (it's a deployment / token-issuance problem). Callers that catch
 * Forbidden_Exception to revoke consent must catch Insufficient_Scope_Exception first and re-throw
 * it untouched.
 */
class Insufficient_Scope_Exception extends Forbidden_Exception {

}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions;

/**
 * Thrown when the AI service rejects a request with a 403 because the user's consent is required.
 *
 * Distinct from a generic {@see Forbidden_Exception} because the recovery path differs and because
 * the fallback must be skipped: the consent state is an authoritative answer about this user, so
 * trying the secondary auth strategy (which talks to the same service for the same user) is
 * pointless and can mask the real signal with an unrelated failure. The caller clears local consent
 * and re-prompts the user. The service carries no machine-readable discriminator for this case, so
 * it is classified from the 403 response message — see {@see \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy}.
 */
class Consent_Required_Exception extends Forbidden_Exception {

}
